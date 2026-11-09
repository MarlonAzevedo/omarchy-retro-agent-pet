import json
import os
import subprocess
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


# Cada função QML roda num processo próprio: juntas, uma herda o estado do painel da outra
def run_qml(test, function, config_home):
    env = dict(os.environ, QT_QPA_PLATFORM="offscreen", QML_XHR_ALLOW_FILE_READ="1",
               QML_IMPORT_PATH=str(ROOT / "testes" / "painel" / "imports"), XDG_CONFIG_HOME=config_home)
    result = subprocess.run([
        "/usr/lib/qt6/bin/qmltestrunner", "-input", str(ROOT / "testes" / "painel" / "tst_personalidade.qml"),
        "-o", "-,txt", "PersonalidadeDoPet::" + function],
        env=env, cwd=ROOT, text=True, capture_output=True)
    test.assertEqual(result.returncode, 0, result.stdout + result.stderr)


class PainelPersonagemTests(unittest.TestCase):
    def test_c3_real_json(self):
        with tempfile.TemporaryDirectory() as temp:
            characters = Path(temp) / "agent-pet" / "characters"
            characters.mkdir(parents=True)
            character = json.loads((ROOT / "characters" / "cat.json").read_text(encoding="utf-8"))
            character["id"] = "custom"
            character["name"] = {"pt": "Meu pet", "en": "My pet"}
            (characters / "custom.json").write_text(json.dumps(character), encoding="utf-8")
            run_qml(self, "test_choosing_user_character", temp)

    def test_petting_gesture(self):
        with tempfile.TemporaryDirectory() as temp:
            run_qml(self, "test_petting_gesture", temp)

    def test_discreet_hides_balloon(self):
        with tempfile.TemporaryDirectory() as temp:
            run_qml(self, "test_discreet_hides_balloon", temp)

    def test_picker_draws_characters(self):
        with tempfile.TemporaryDirectory() as temp:
            run_qml(self, "test_picker_draws_characters", temp)

    def test_limit_follows_selected_agent(self):
        with tempfile.TemporaryDirectory() as temp:
            run_qml(self, "test_limit_follows_selected_agent", temp)
