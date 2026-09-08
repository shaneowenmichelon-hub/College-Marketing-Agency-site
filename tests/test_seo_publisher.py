import contextlib
import importlib.util
import io
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / "scripts/collegiate_seo_autopublish.py"
spec = importlib.util.spec_from_file_location("publisher", SCRIPT)
p = importlib.util.module_from_spec(spec)
spec.loader.exec_module(p)

class PublisherTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.state = self.root / "state.json"
        self.state.write_text(json.dumps({"next_run_at":"2026-01-01T00:00:00-06:00"}))
        for name, value in [("STATE",self.state),("LOG",self.root/"log.md"),("LOCK",self.root/"publisher.lock")]:
            m = patch.object(p,name,value,create=True); m.start(); self.addCleanup(m.stop)

    def test_verification_polls_deployment_until_visible(self):
        with patch.object(p.subprocess,"run",side_effect=[subprocess.CompletedProcess([],1,"not live"),subprocess.CompletedProcess([],0,"verified")]) as run, patch("time.sleep"):
            self.assertTrue(p.verify_live({"worktree":str(self.root)}))
        self.assertEqual(run.call_count,2)

    def test_missing_operational_state_migrates_existing_cadence_without_touching_repo(self):
        self.state.unlink()
        legacy=self.root/"legacy.json"
        legacy.write_text(json.dumps({"next_run_at":"2026-09-10T01:11:00.402398-05:00"}))
        with patch.object(p,"LEGACY_STATE",legacy,create=True):
            state=p.load_state()
        self.assertEqual(state.get("next_run_at"),"2026-09-10T01:11:00.402398-05:00")
        self.assertEqual(json.loads(legacy.read_text()),state)

    def test_state_write_is_atomic(self):
        before=self.state.read_text()
        with patch.object(p.os,"replace",side_effect=OSError("disk failure")):
            with self.assertRaises(OSError): p.save_state({"new":"state"})
        self.assertEqual(self.state.read_text(),before)

    def test_push_retry_keeps_same_commit_and_does_not_publish_twice(self):
        import hashlib
        self.assertTrue(callable(getattr(p,"publish_prepared",None)), "No deterministic publication boundary")
        repo=self.root/"publish"; repo.mkdir()
        def git(*args): return subprocess.run(["git",*args],cwd=repo,check=True,capture_output=True,text=True).stdout.strip()
        git("init","-b","deploy"); git("config","user.email","test@example.invalid"); git("config","user.name","Test")
        (repo/"content/blog").mkdir(parents=True); (repo/"content/seo").mkdir(parents=True)
        (repo/"content/seo/keyword-map.md").write_text("# Keywords\n")
        (repo/"keep.txt").write_text("keep")
        git("add","."); git("commit","-m","baseline")
        base=git("rev-parse","HEAD")
        remote=self.root/"publish-remote.git"
        subprocess.run(["git","clone","--bare",str(repo),str(remote)],check=True,capture_output=True)
        git("remote","add","origin",str(remote))
        (repo/"content/blog/pilot.mdx").write_text("prepared article")
        (repo/"public/images/blog").mkdir(parents=True)
        (repo/"public/images/blog/test.jpg").write_bytes(b"fixture")
        # Photo would already be tracked in the real approved photo library.
        git("add","public"); git("commit","-m","photo fixture"); git("push","origin","deploy")
        artifact={"slug":"pilot","title":"Pilot","primaryKeyword":"pilot","word_count":1300,"worktree":str(repo),"base":git("rev-parse","HEAD"),"run_no":1,"image":"/images/blog/test.jpg","article_sha256":hashlib.sha256(b"prepared article").hexdigest(),"image_sha256":hashlib.sha256(b"fixture").hexdigest()}
        other=self.root/"other"
        subprocess.run(["git","clone",str(remote),str(other)],check=True,capture_output=True)
        for args in (["config","user.email","test@example.invalid"],["config","user.name","Test"]):
            subprocess.run(["git",*args],cwd=other,check=True,capture_output=True)
        (other/"keep.txt").write_text("newer upstream work")
        for args in (["add","keep.txt"],["commit","-m","upstream update"],["push","origin","deploy"]):
            subprocess.run(["git",*args],cwd=other,check=True,capture_output=True)
        upstream=subprocess.run(["git","rev-parse","HEAD"],cwd=other,check=True,capture_output=True,text=True).stdout.strip()
        real=p.command; builds=[]; fail_push=[True]
        def command(args,cwd,timeout=120):
            if args[0] in ("npm","npx"):
                builds.append(args); return "test build boundary"
            if args[:2]==["git","push"] and fail_push[0]:
                fail_push[0]=False
                raise RuntimeError("test rejected push; secret-token")
            return real(args,cwd,timeout)
        with patch.object(p,"BRANCH","deploy"), patch.object(p,"command",side_effect=command):
            with self.assertRaises(RuntimeError): p.publish_prepared(artifact)
            p.publish_prepared(artifact)
            first=git("rev-parse","origin/deploy")
            p.publish_prepared(artifact)
        self.assertEqual(first,git("rev-parse","origin/deploy"))
        self.assertEqual(git("rev-list","--count",upstream+"..origin/deploy"),"1")
        self.assertEqual(sum(a==["npm","run","build"] for a in builds),2)
        self.assertEqual(sum("| pilot |" in line for line in (repo/"content/seo/publish-log.md").read_text().splitlines()),1)

    def test_article_validation_requires_photo_and_rejects_duplicate_keyword(self):
        self.assertTrue(callable(getattr(p,"validate_article",None)), "No article/photo validation")
        blog=self.root/"content/blog"; blog.mkdir(parents=True)
        photos=self.root/"public/images/blog"; photos.mkdir(parents=True)
        (photos/"campus.jpg").write_bytes(b"test-photo-bytes")
        seo=self.root/"content/seo"; seo.mkdir(parents=True)
        (seo/"public-photo-library.md").write_text("/images/blog/campus.jpg https://unsplash.com/photos/example https://unsplash.com/license")
        front = """---
slug: campus-pilot
title: Campus Pilot: A Buyer Checklist
metaTitle: Campus Pilot Guide
metaDescription: A practical campus pilot checklist.
primaryKeyword: campus pilot
category: Events
services: [events, brand-ambassadors]
excerpt: Practical planning advice.
date: 2026-09-08
author: Collegiate Agency
ctaService: events
image: /images/blog/campus.jpg
imageAlt: Campus lawn
imageCredit: Photographer / Unsplash
imageSource: https://unsplash.com/photos/example
imageLicense: https://unsplash.com/license
---
"""
        body="Plan a campus pilot with clear responsibilities.\n\n" + "\n\n".join("## Section " + str(i) + "\n\n" + "Practical campus planning advice. "*75 for i in range(4))
        body += "\n\n- Checklist item\n\n[Events](/services/events) [Ambassadors](/services/brand-ambassadors) [Contact](/contact)"
        article=blog/"campus-pilot.mdx"; article.write_text(front+body)
        valid=p.validate_article(article,self.root)
        self.assertEqual(valid["slug"],"campus-pilot")
        self.assertTrue(valid["image_sha256"])
        article.write_text((front+body).replace("image: /images/blog/campus.jpg\n",""))
        with self.assertRaises(ValueError): p.validate_article(article,self.root)
        article.write_text(front+body+'\n<script>alert(1)</script>')
        with self.assertRaises(ValueError): p.validate_article(article,self.root)
        article.write_text(front+body)
        (seo/"keyword-map.md").write_text(f"- {p.now_ct():%Y-%m-%d} - `campus pilot` - `/insights/old-pilot`\n")
        with self.assertRaises(ValueError): p.validate_article(article,self.root)
        (seo/"keyword-map.md").write_text("")
        (blog/"prior.mdx").write_text(front.replace("slug: campus-pilot","slug: prior")+body)
        with self.assertRaises(ValueError): p.validate_article(article,self.root)

    def test_preparation_uses_latest_clean_worktree_and_recovers_after_restart(self):
        self.assertTrue(callable(getattr(p, "prepare", None)), "No clean worktree preparation boundary")
        repo = self.root / "source"; repo.mkdir()
        def git(*args):
            return subprocess.run(["git",*args],cwd=repo,check=True,capture_output=True,text=True).stdout.strip()
        git("init", "-b", "deploy")
        git("config","user.email","test@example.invalid"); git("config","user.name","Test")
        (repo/"content/blog").mkdir(parents=True)
        (repo/"content/seo").mkdir(parents=True)
        (repo/"content/blog/.gitkeep").write_text("")
        (repo/"content/seo/publish-log.md").write_text("| 37 | 2026-09-01 | old |\n")
        (repo/"content/seo/keyword-map.md").write_text("# Keywords")
        (repo/"keep.txt").write_text("remote baseline")
        git("add","."); git("commit","-m","baseline")
        remote=self.root/"remote.git"
        subprocess.run(["git","clone","--bare",str(repo),str(remote)],check=True,capture_output=True)
        git("remote","add","origin",str(remote))
        (repo/"keep.txt").write_text("precious local dirty edit")
        generated=[]
        def generate(run_no, worktree):
            generated.append(worktree)
            self.assertEqual((worktree/"keep.txt").read_text(),"remote baseline")
            (worktree/"content/blog/campus-pilot.mdx").write_text("prepared")
            return subprocess.CompletedProcess([],0,"credential must not escape")
        artifact={"slug":"campus-pilot","title":"Campus Pilot"}
        with patch.object(p,"REPO",repo), patch.object(p,"BRANCH","deploy"), patch.object(p,"OPS",self.root/"ops"), patch.object(p,"publish_with_hermes",side_effect=generate), patch.object(p,"validate_article",return_value=artifact.copy(),create=True):
            state=json.loads(self.state.read_text())
            first=p.prepare(state,1)
            restarted=json.loads(self.state.read_text())
            again=p.prepare(restarted,1)
        self.assertEqual(first["run_no"],38)
        self.assertEqual(first,again)
        self.assertEqual(len(generated),1)
        self.assertNotEqual(Path(first["worktree"]),repo)
        self.assertEqual((repo/"keep.txt").read_text(),"precious local dirty edit")

    def test_overlap_is_silent_and_does_not_touch_state(self):
        import fcntl
        before = self.state.read_bytes()
        with p.LOCK.open("w") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            with patch.object(p,"prepare",return_value={},create=True) as generate, contextlib.redirect_stdout(io.StringIO()) as out:
                self.assertEqual(p.main(),0)
            generate.assert_not_called()
        self.assertEqual(self.state.read_bytes(),before)
        self.assertEqual(out.getvalue(),"")

    def test_not_due_is_silent_noop(self):
        self.state.write_text(json.dumps({"next_run_at":"2099-01-01T00:00:00-06:00"}))
        before = self.state.read_bytes()
        with patch.object(p,"prepare",return_value={},create=True) as generate, contextlib.redirect_stdout(io.StringIO()) as out:
            self.assertEqual(p.main(),0)
        generate.assert_not_called()
        self.assertEqual(self.state.read_bytes(),before)
        self.assertEqual(out.getvalue(),"")

    def test_retry_reuses_artifact_and_never_generates_a_second_post(self):
        artifact = {"slug":"campus-pilot", "title":"Campus Pilot", "image":"/images/blog/pilot.jpg"}
        with patch.object(p,"publish_with_hermes",return_value=subprocess.CompletedProcess([],0,"")), patch.object(p,"prepare",return_value=artifact,create=True) as generate, patch.object(p,"publish_prepared",create=True) as deploy, patch.object(p,"verify_live",side_effect=[False, True],create=True), contextlib.redirect_stdout(io.StringIO()):
            p.main()
            state = json.loads(self.state.read_text())
            self.assertEqual(state.get("pending"), artifact)
            state["retry_at"] = "2026-01-01T00:00:00-06:00"
            self.state.write_text(json.dumps(state))
            p.main()
            self.assertEqual(generate.call_count, 1)
            self.assertEqual(deploy.call_count, 2)
        state = json.loads(self.state.read_text())
        self.assertIsNone(state["pending"])
        self.assertEqual(state["last_success"]["slug"],"campus-pilot")

    def test_child_exit_zero_is_not_live_success(self):
        with patch.object(p,"prepare",return_value={"slug":"test"}), patch.object(p,"publish_prepared",return_value=None,create=True), patch.object(p,"publish_with_hermes",return_value=subprocess.CompletedProcess([],0,"not live; secret-token")), patch.object(p,"verify_live",return_value=False,create=True), contextlib.redirect_stdout(io.StringIO()) as out:
            self.assertEqual(p.main(),1)
        state = json.loads(self.state.read_text())
        self.assertEqual(state["next_run_at"],"2026-01-01T00:00:00-06:00", "unverified child advanced cadence")
        self.assertNotIn("secret-token",out.getvalue())
        self.assertIn("verification",out.getvalue())

if __name__ == "__main__": unittest.main()
