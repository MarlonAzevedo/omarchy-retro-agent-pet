import json
import os
import subprocess
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class PainelPersonagemTests(unittest.TestCase):
    def test_c3_real_json(self):
        with tempfile.TemporaryDirectory() as temp:
            characters = Path(temp) / "agent-pet" / "characters"
            characters.mkdir(parents=True)
            character = json.loads((ROOT / "characters" / "cat.json").read_text(encoding="utf-8"))
            character["id"] = "custom"
            character["name"] = {"pt": "Meu pet", "en": "My pet"}
            (characters / "custom.json").write_text(json.dumps(character), encoding="utf-8")
            env = dict(os.environ, QT_QPA_PLATFORM="offscreen", QML_XHR_ALLOW_FILE_READ="1",
                       QML_IMPORT_PATH=str(ROOT / "testes" / "painel" / "imports"), XDG_CONFIG_HOME=temp)
            result = subprocess.run([
                "/usr/lib/qt6/bin/qmltestrunner", "-input", str(ROOT / "testes" / "painel" / "tst_personalidade.qml"),
                "-o", "-,txt", "PersonalidadeDoPet::test_choosing_user_character"],
                env=env, cwd=ROOT, text=True, capture_output=True)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
