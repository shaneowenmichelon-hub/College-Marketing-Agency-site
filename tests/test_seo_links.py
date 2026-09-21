import importlib.util
from pathlib import Path
import unittest
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('publisher',ROOT/'scripts/collegiate_seo_autopublish.py')
p=importlib.util.module_from_spec(spec);spec.loader.exec_module(p)
EXT='https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers'
BODY='''Choose [campus events](/services/events) for the live activation.

Use [student ambassadors](/services/brand-ambassadors) for ongoing campus outreach.

When the brief is ready, [contact the team](/contact) to discuss feasibility.

Include the [FTC disclosure guide](EXT) when briefing paid student creators.'''.replace('EXT',EXT)
class LinkPolicyTests(unittest.TestCase):
    def test_requires_external_contextual_link_not_photo_credit(self):
        validator=getattr(p,'validate_contextual_links',None)
        self.assertTrue(callable(validator),'Publisher has no contextual-link policy')
        self.assertEqual(len(validator(BODY)),4)
        with self.assertRaisesRegex(ValueError,'external'):
            validator(BODY.rsplit('\n\n',1)[0])
    def test_distinct_safe_contextual_destinations_preserve_service_and_contact_floor(self):
        for bad in [
            BODY.replace('[student ambassadors](/services/brand-ambassadors)','student ambassadors'),
            BODY.replace('[contact the team](/contact)','contact the team'),
            BODY+'\n\nReview the [same disclosure guide]('+EXT+') with your team.',
            BODY.replace('/services/brand-ambassadors','/services/events'),
            BODY.replace(EXT,'javascript:alert'), BODY.replace(EXT,'https://localhost/private'),
            BODY.replace(EXT,'https://127.0.0.1/private'), BODY.replace(EXT,'https://user:pass@example.org/article'),
            BODY.replace(EXT,'//example.org/article'), BODY.replace(EXT,'https://collegiateagency.com/contact'),
            BODY.replace(EXT,'https://example.org/'),
            BODY.rsplit('\n\n',1)[0]+'\n\n![FTC photograph]('+EXT+')',
            BODY.rsplit('\n\n',1)[0]+'\n\n```\nRead the [FTC disclosure guide]('+EXT+') before posting anything.\n```',
            BODY.rsplit('\n\n',1)[0]+'\n\n## Read the [FTC guide]('+EXT+') before posting anything',
            BODY.rsplit('\n\n',1)[0]+'\n\n[FTC disclosure guide]('+EXT+')',
        ]:
            with self.subTest(body=bad[-120:]), self.assertRaises(ValueError):
                p.validate_contextual_links(bad)
        self.assertEqual(len(p.validate_contextual_links(BODY.replace('/services/brand-ambassadors','/services#product-placement'))),4)

    def test_preflight_fails_closed_on_broken_link_without_relaying_output(self):
        from unittest.mock import patch
        import subprocess
        preflight=getattr(p,'preflight_links',None)
        self.assertTrue(callable(preflight),'Missing pre-push target validation')
        artifact={'worktree':str(ROOT),'body_links':p.validate_contextual_links(BODY)}
        with patch.object(p.subprocess,'run',return_value=subprocess.CompletedProcess([],1,'secret-token')):
            with self.assertRaisesRegex(ValueError,'link-target-preflight'):
                preflight(artifact)
        with patch.object(p.subprocess,'run',return_value=subprocess.CompletedProcess([],0,'[]')) as run:
            preflight(artifact)
            self.assertIn('--targets',run.call_args.args[0])

if __name__=='__main__':unittest.main()
