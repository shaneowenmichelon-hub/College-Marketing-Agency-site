import importlib.util
import os
from pathlib import Path
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('publisher', os.environ.get('PUBLISHER', str(ROOT / 'scripts/collegiate_seo_autopublish.py')))
p = importlib.util.module_from_spec(spec)
spec.loader.exec_module(p)

class RepairTests(unittest.TestCase):
    def test_owned_article_without_fake_license(self):
        work = ROOT
        result, _ = p.frontmatter(work / 'content/blog/college-marketing-agency.mdx')
        p.validate_photo_provenance(result, (work / 'content/seo/public-photo-library.md').read_text())
        self.assertEqual(result['imageRights'], 'owned')
        self.assertNotIn('imageLicense', result)

    def test_model_override_clean_environment(self):
        with patch.dict(os.environ, {'PYTHONPATH':'bad', 'PYTHONHOME':'bad', 'VIRTUAL_ENV':'bad', 'CONDA_PREFIX':'bad'}), patch.object(p.subprocess, 'run') as run:
            p.publish_with_hermes(30, ROOT / 'worktree')
        args = run.call_args.args[0]
        self.assertIn('gpt-6-astra', args)
        self.assertIn('openai-codex', args)
        env = run.call_args.kwargs['env']
        self.assertFalse({'PYTHONPATH','PYTHONHOME','VIRTUAL_ENV','CONDA_PREFIX'} & env.keys())

    def test_randomized_36h_persisted_once_and_dst(self):
        from datetime import datetime, timedelta, timezone
        for seconds in (0, 900, 1800):
            state = {}
            base = datetime(2026,10,31,12,tzinfo=p.TZ)
            with patch.object(p, 'save_state'), patch.object(p.random, 'randint', return_value=seconds) as rng:
                p.schedule_next_interval(state, base)
                due = datetime.fromisoformat(state['next_run_at'])
                self.assertEqual((due.astimezone(timezone.utc)-base.astimezone(timezone.utc)).total_seconds(), 36*3600+seconds)
                self.assertEqual(p.due_run(state, due-timedelta(seconds=1)), (False,False))
                self.assertEqual(p.due_run(state, due), (True,False))
                rng.assert_called_once_with(0,1800)

    def test_buyer_intent_and_owned_only_prompt(self):
        with self.assertRaisesRegex(ValueError, 'student-intent-keyword'):
            p.validate_brand_intent({'primaryKeyword':'college brand ambassador jobs'})
        p.validate_brand_intent({'primaryKeyword':'campus event staffing agency', 'title':'Campus Event Staffing Agency: Hiring Guide'})
        with patch.object(p.subprocess, 'run') as run:
            p.publish_with_hermes(30, ROOT)
        prompt = run.call_args.args[0][run.call_args.args[0].index('-q')+1]
        self.assertIn('Do not use stock', prompt)

    def test_provenance_is_scoped_and_licensed_gate_retained(self):
        library = (ROOT/'content/seo/public-photo-library.md').read_text()
        data = {'image':'/images/blog/campus-library-michael-marsh.jpg','imageSource':'https://unsplash.com/photos/brown-concrete-building-U0dBV_QeiYk','imageLicense':'https://unsplash.com/license'}
        p.validate_photo_provenance(data, library)
        for changed in ({'imageLicense':'https://example.org/license'}, {'imageRights':'owned','imageCredit':'Collegiate Agency'}, {'image':'/images/blog/bloom-sampling-campus-nightlife.jpg'}):
            with self.assertRaises(ValueError):
                p.validate_photo_provenance({**data, **changed}, library)
        owned = {'image':'/images/blog/bloom-sampling-campus-nightlife.jpg','imageRights':'owned','imageCredit':'Collegiate Agency'}
        with self.assertRaisesRegex(ValueError, 'owned-photo-fake-license'):
            p.validate_photo_provenance({**owned,'imageLicense':'Owned by Collegiate'}, library)

    def test_command_environment_has_node(self):
        import subprocess
        with patch.object(p.subprocess, 'run', return_value=subprocess.CompletedProcess([],0,'ok')) as run:
            p.command(['node','--version'], ROOT)
        self.assertTrue(run.call_args.kwargs['env']['PATH'].startswith('/Users/jamesmadison/.hermes/node/bin:'))

    def test_new_article_duplicate_and_retry(self):
        import shutil, tempfile
        work = ROOT
        article = work/'content/blog/campus-field-marketing-agency.mdx'
        result = p.validate_article(article, work)
        self.assertEqual(result['tables'], 1)
        self.assertEqual(len(result['body_links']), 8)
        with tempfile.TemporaryDirectory(dir=ROOT) as temp:
            folder = Path(temp)
            shutil.copytree(work/'content', folder/'content')
            shutil.copytree(work/'public/images/blog', folder/'public/images/blog')
            duplicate = folder/'content/blog/duplicate.mdx'
            duplicate.write_bytes(article.read_bytes())
            with self.assertRaisesRegex(ValueError, 'duplicate-article'):
                p.validate_article(folder/'content/blog'/article.name, folder)
        with tempfile.TemporaryDirectory(dir=ROOT) as temp:
            prepared = Path(temp)/'prepared'
            shutil.copytree(work/'content', prepared/'content')
            shutil.copytree(work/'public/images/blog', prepared/'public/images/blog')
            draft=prepared/'content/blog'/article.name
            content=draft.read_bytes()
            draft.unlink()
            for args in (('init','-b','test'),('config','user.email','test@example.invalid'),('config','user.name','Test'),('add','content','public'),('commit','-m','fixture')):
                p.git(prepared,*args)
            base=p.git(prepared,'rev-parse','HEAD')
            draft.write_bytes(content)
            state = {'preparing':{'worktree':str(prepared),'base':base,'run_no':29}}
            # This fixture reuses an already published article as the prepared draft.
            # Writing-quality, brief, and reserved-keyword gates apply to new drafts
            # and are covered in test_seo_writing_quality.py.
            with patch.object(p,'publish_with_hermes') as generate, patch.object(p,'assert_new_article_gates'):
                a = p.prepare(state,29)
                b = p.prepare(state,29)
            generate.assert_not_called()
            self.assertEqual(a['article_sha256'],b['article_sha256'])

    def test_failed_model_exit_zero_is_not_success(self):
        import subprocess, tempfile
        with tempfile.TemporaryDirectory(dir=ROOT) as temp:
            work = Path(temp)
            (work/'content/blog').mkdir(parents=True)
            state = {'preparing':{'worktree':str(work),'base':'x','run_no':29}}
            with patch.object(p,'git',return_value=''), patch.object(p,'save_state'), patch.object(p,'publish_with_hermes',return_value=subprocess.CompletedProcess([],0,'Model unavailable')):
                with self.assertRaisesRegex(RuntimeError,'expected-one-article'):
                    p.prepare(state,29)
            self.assertEqual(state['preparing']['generation_result']['status'],'completed-no-article')

if __name__ == '__main__':
    unittest.main(verbosity=2)
