import QtQuick
import QtTest
import QtCore
import Quickshell

Item {
  id: test
  width: 500
  height: 750
  Loader { id: loader; source: "../../Panel.qml" }

  function find(item, name) {
    if (!item) return null
    if (item.objectName === name) return item
    var children = item.data || item.children || []
    for (var i = 0; i < children.length; i++) {
      var found = find(children[i], name)
      if (found) return found
    }
    return null
  }

  TestCase {
    name: "PersonalidadeDoPet"
    when: windowShown && loader.status === Loader.Ready

    function test_choosing_user_character() {
      var configHome = StandardPaths.writableLocation(StandardPaths.GenericConfigLocation)
      Quickshell.envOverrides = { XDG_CONFIG_HOME: configHome }
      Quickshell.readFiles = true
      loader.active = false
      loader.active = true
      tryCompare(loader, "status", Loader.Ready)
      var panel = loader.item
      panel.usageRecords = [{ id: "claude", todayPrompts: 1, limits: [] }]
      var userPath = configHome + "/agent-pet/characters/custom.json"
      var scan = test.find(panel, "characterScan")
      verify(!!scan, "Busca de personagens ausente")
      compare(scan.command[0], "find")
      compare(scan.command[2], configHome + "/agent-pet/characters")
      // Regressão (#14507): só arquivos comuns e pequenos chegam ao FileView
      verify(scan.command.indexOf("-type") > 0 && scan.command[scan.command.indexOf("-type") + 1] === "f", "find sem -type f")
      verify(scan.command.indexOf("-size") > 0 && scan.command[scan.command.indexOf("-size") + 1] === "-256k", "find sem limite de tamanho")
      var bigPath = configHome + "/agent-pet/characters/big.json"
      scan.stdout.text = panel.builtinCharactersDir + "/computer.json\t20000\t1\n" + userPath + "\t2000\t1\n" + bigPath + "\t999999999\t1\n"
      scan.stdout.streamFinished()
      tryVerify(function() { return panel.characters.some(function(item) { return item.id === "custom" }) })
      compare(panel.characters.filter(function(item) { return item.id === "custom" })[0].name.pt, "Meu pet")
      compare(panel.characterFiles.filter(function(entry) { return entry.indexOf(bigPath) === 0 }).length, 0, "Personagem grande foi carregado")
      panel.config = { character: "computer", language: "pt" }
      panel.screen = "agents"
      wait(100)
      var button = test.find(panel, "choose-custom")
      verify(!!button, "Cartão do personagem novo não apareceu")
      mouseClick(button, button.width / 2, button.height / 2)
      compare(panel.config.character, "custom")
      compare(panel.character, "custom")
    }

    function test_petting_gesture() {
      var panel = loader.item
      panel.usageRecords = [{ id: "claude", todayPrompts: 1, limits: [] }]
      panel.screen = "home"
      panel.petState = "idle"
      wait(50)
      var area = test.find(panel, "pettingArea")
      verify(!!area, "Área de carinho ausente")
      mouseMove(area, 20, 20)
      mouseMove(area, 80, 20)
      mouseMove(area, 20, 20)
      mouseMove(area, 80, 20)
      mouseMove(area, 20, 20)
      compare(panel.petState, "petted")
    }

    function test_discreet_hides_balloon() {
      var panel = loader.item
      panel.usageRecords = [{ id: "claude", todayPrompts: 1, limits: [] }]
      panel.screen = "home"
      panel.config = { language: "pt", discreet: false }
      panel.daily = { completed_responses: 0, active_seconds: 0 }
      panel.builtinRecadoText = "[normal]\nOi"
      var balloon = test.find(panel, "recadoBalloon")
      verify(!!balloon, "Balão ausente")
      verify(balloon.visible, "Balão deveria aparecer com recado")
      panel.config = { language: "pt", discreet: true }
      verify(!balloon.visible, "Modo discreto deveria ocultar o balão")
    }

    // Regressão (#14507): recados do usuário também passam pelo limite de tamanho antes da leitura
    function test_user_recados_size_limit() {
      var configHome = StandardPaths.writableLocation(StandardPaths.GenericConfigLocation)
      Quickshell.envOverrides = { XDG_CONFIG_HOME: configHome }
      Quickshell.readFiles = true
      loader.active = false
      loader.active = true
      tryCompare(loader, "status", Loader.Ready)
      var panel = loader.item
      panel.config = { character: "computer", language: "pt" }
      var scan = test.find(panel, "recadoScan")
      verify(!!scan, "Busca de recados ausente")
      compare(scan.command[1], configHome + "/agent-pet/characters/computer")
      verify(scan.command.indexOf("-type") > 0 && scan.command[scan.command.indexOf("-type") + 1] === "f", "find sem -type f")
      verify(scan.command.indexOf("-size") > 0 && scan.command[scan.command.indexOf("-size") + 1] === "-64k", "find sem limite de tamanho")
      var path = configHome + "/agent-pet/characters/computer/recados.pt.txt"
      scan.stdout.text = path + "\t30\t1\n"
      scan.stdout.streamFinished()
      tryVerify(function() { return String(panel.userRecadoText || "").indexOf("Recado meu") >= 0 })
      scan.stdout.text = path + "\t999999999\t2\n"
      scan.stdout.streamFinished()
      tryCompare(panel, "userRecadoText", null)
    }

    // Regressão: prévias do seletor apareciam vazias
    function test_picker_draws_characters() {
      var panel = loader.item
      panel.usageRecords = [{ id: "claude", todayPrompts: 1, limits: [] }]
      panel.config = { character: "computer", language: "pt" }
      panel.screen = "agents"
      Quickshell.readFiles = true
      var scan = test.find(panel, "characterScan")
      scan.stdout.text = ["computer", "cat", "robot", "dog", "axolotl"].map(function(id) {
        return panel.builtinCharactersDir + "/" + id + ".json\t20000\t1" }).join("\n") + "\n"
      scan.stdout.streamFinished()
      tryVerify(function() { return panel.characters.length === 5 })
      wait(100)
      panel.characters.forEach(function(item) {
        var pet = test.find(panel, "preview-" + item.id)
        verify(!!pet, "Prévia ausente: " + item.id)
        verify(/[^.]/.test(pet.rows.join("")), "Prévia vazia: " + item.id)
      })
      var drawn = panel.characters.map(function(item) { return test.find(panel, "preview-" + item.id).rows.join("") })
      compare(drawn.filter(function(rows, i) { return drawn.indexOf(rows) === i }).length, drawn.length, "Prévias repetem o mesmo desenho")
    }

    // Regressão: limite de um agente deixava o pet em alerta com outro selecionado
    function test_limit_follows_selected_agent() {
      var panel = loader.item
      panel.sessions = []
      panel.usageRecords = [
        { id: "claude", todayPrompts: 1, limits: [{ label: "5h", percent: 0.2 }] },
        { id: "codex", todayPrompts: 1, limits: [{ label: "5h", percent: 1 }] } ]
      panel.screen = "home"
      panel.selectedAgent = "codex"
      compare(panel.computedPetState, "limit")
      verify(panel.alarm, "Agente selecionado no limite deveria alertar")
      panel.selectedAgent = "claude"
      compare(panel.computedPetState, "idle")
      verify(!panel.alarm, "Limite de outro agente não deveria alertar")
      compare(panel.currentMood, "normal")
      tryCompare(panel, "petState", "idle")
      wait(50)
      var area = test.find(panel, "pettingArea")
      mouseMove(area, 20, 20)
      mouseMove(area, 80, 20)
      mouseMove(area, 20, 20)
      mouseMove(area, 80, 20)
      mouseMove(area, 20, 20)
      compare(panel.petState, "petted")
    }
  }
}
