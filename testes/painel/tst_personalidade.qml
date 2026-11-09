import QtQuick
import QtTest

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
      var panel = loader.item
      panel.usageRecords = [{ id: "claude", todayPrompts: 1, limits: [] }]
      panel.characters = [
        { id: "computer", name: { pt: "Computador", en: "Computer" } },
        { id: "custom", name: { pt: "Meu pet", en: "My pet" } } ]
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
  }
}
