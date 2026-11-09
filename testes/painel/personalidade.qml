// Uso: QT_QPA_PLATFORM=offscreen qml6 -I testes/painel/imports testes/painel/personalidade.qml
import QtQuick
import QtQuick.Window

Window {
  id: test
  width: 500
  height: 750
  visible: true
  property bool failed: false
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
  function check(value, message) {
    if (!value) { console.error(message); test.failed = true }
  }

  Timer {
    interval: 300
    running: true
    onTriggered: {
      var panel = loader.item
      test.check(!!panel, "Painel não carregou")
      panel.screen = "home"
      panel.usageRecords = [{ id: "claude", todayPrompts: 1, limits: [] }]
      panel.characters = [{ id: "computer", name: { pt: "Computador", en: "Computer" } },
        { id: "custom", name: { pt: "Meu pet", en: "My pet" } }]
      panel.config = { character: "custom", language: "pt" }
      test.check(panel.character === "custom", "Personagem do usuário não foi escolhido")
      panel.dailyObservedPath = ""
      panel.petState = "idle"
      panel.acceptDaily({ completed_responses: 30, active_seconds: 0 })
      test.check(panel.petState !== "celebrate", "Abrir com 30 respostas disparou fogos")
      panel.acceptDaily({ completed_responses: 51, active_seconds: 0 })
      test.check(panel.petState === "celebrate", "Cruzamento de 50 respostas não disparou fogos")
      panel.petState = "idle"
      panel.builtinRecadoText = "[animado]\nFrase do pet"
      test.check(panel.recadoText === "Frase do pet", "Recado não chegou ao Início")
      panel.userRecadoText = "[animado]\nRecado próprio"
      test.check(panel.recadoText === "Recado próprio", "Recado do usuário não substituiu o embutido")
      var balloon = test.find(panel, "recadoBalloon")
      var homePet = test.find(panel, "homePet")
      var barPet = test.find(panel, "barPet")
      test.check(!!balloon && balloon.visible && !!homePet && !!barPet, "Balão ou pets ausentes")
      test.check(balloon.parent === homePet.parent && balloon.parent.children.indexOf(balloon) < balloon.parent.children.indexOf(homePet), "Balão não ficou acima do pet")
      var summary = test.find(panel, "todaySummary")
      test.check(!!summary && summary.text.indexOf("animado") >= 0, "Humor ausente do resumo em português")
      panel.config = { character: "custom", language: "en" }
      test.check(summary.text.indexOf("Today") >= 0 && summary.text.indexOf("excited") >= 0, "Humor ausente do resumo em inglês")
      panel.config = { character: "custom", language: "pt" }
      test.check(test.find(panel, "celebrationTimer").interval === 2400, "Fogos sem duração de 2,4 s")
      test.check(test.find(panel, "pettedTimer").interval === 2000, "Carinho sem duração de 2 s")
      panel.sessions = [{ session_id: "work", status: "working" }]
      test.check(panel.petState === "working", "Sessão em trabalho não mudou estado")
      panel.sessions = []
      test.check(panel.petState === "celebrate", "Fim de sessão não mostrou fogos")
      panel.petState = "celebrate"
      panel.config = { character: "custom", language: "pt", discreet: true }
      test.check(!balloon.visible, "Balão aparece no modo discreto")
      test.check(homePet.petState === "celebrate" && barPet.petState !== "celebrate", "Fogos apareceram na barra discreta")
      panel.config = { character: "custom", language: "pt" }
      test.check(barPet.petState === "celebrate", "Fogos não apareceram na barra normal")
      if (!test.failed) console.log("Personagem, balão, tempos e modo discreto: passaram")
      Qt.exit(test.failed ? 1 : 0)
    }
  }
}
