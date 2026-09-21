import importlib.util
import json
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
PLAN = json.loads((ROOT/'content/seo/link-backfill-20260921.json').read_text())

class BackfillTests(unittest.TestCase):
    def test_every_inventoried_article_has_exactly_two_new_distinct_targets(self):
        self.assertEqual(len(PLAN['entries']),30)
        for entry in PLAN['entries']:
            with self.subTest(url=entry['url']):
                links=entry['added_links']
                self.assertEqual(len(links),2)
                self.assertEqual({x['kind'] for x in links},{'internal','external'})
                self.assertEqual(len({x['href'] for x in links}),2)
                self.assertFalse({x['href'] for x in links}&{x['href'] for x in entry['baseline_body_links']})
                text=(ROOT/entry['source_file']).read_text()
                if entry['source_constant']:
                    text=text.split('const '+entry['source_constant']+':',1)[1].split('\n];',1)[0]
                for edit in entry['edits']:
                    self.assertIn(edit['new'],text)

    def test_backfill_is_idempotent_and_refuses_drift(self):
        script=ROOT/'scripts/apply-seo-link-backfill.py'
        self.assertTrue(script.exists(),'Missing idempotent backfill')
        spec=importlib.util.spec_from_file_location('backfill',script)
        module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
        entry=PLAN['entries'][0]
        original=subprocess.check_output(['git','show',PLAN['base_commit']+':'+entry['source_file']],cwd=ROOT,text=True)
        updated=module.apply_entry(original,entry)
        self.assertEqual(module.apply_entry(updated,entry),updated)
        with self.assertRaises(ValueError):module.apply_entry('unexpected source',entry)

if __name__=='__main__':unittest.main()
