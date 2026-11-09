import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class TestCharacters(unittest.TestCase):
    def test_c7_cli(self):
        with tempfile.TemporaryDirectory() as temp:
            config_home = Path(temp) / "config"
            config = config_home / "agent-pet" / "config.json"
            characters = config_home / "agent-pet" / "characters"
            characters.mkdir(parents=True)
            sample = json.loads((ROOT / "characters" / "cat.json").read_text(encoding="utf-8"))
            sample["id"] = "custom"
            (characters / "custom.json").write_text(json.dumps(sample), encoding="utf-8")
            env = dict(os.environ, XDG_CONFIG_HOME=str(config_home))

            def cli(*args):
                return subprocess.run([sys.executable, str(ROOT / "bin" / "agent-pet"), "pet", *args],
                                      env=env, text=True, capture_output=True)

            self.assertIn("custom", cli().stdout)
            chosen = cli("custom")
            self.assertEqual(chosen.returncode, 0, chosen.stderr)
            self.assertEqual(json.loads(config.read_text(encoding="utf-8"))["character"], "custom")
            before = config.read_bytes()
            self.assertEqual(cli("missing").returncode, 2)
            self.assertEqual(config.read_bytes(), before)
            sample["detail"] = [{"when": {"state": "idle"}, "lines": [[31, 0, "OO"]]}]
            (characters / "custom.json").write_text(json.dumps(sample), encoding="utf-8")
            self.assertEqual(cli("custom").returncode, 2)
            self.assertEqual(config.read_bytes(), before)
