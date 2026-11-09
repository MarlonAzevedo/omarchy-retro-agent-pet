import QtQuick
import Quickshell.Io
import "Model.js" as Model

Item {
  id: root
  visible: false
  required property string path
  property var definition: null

  FileView {
    path: root.path
    watchChanges: true
    printErrors: false
    onFileChanged: reload()
    onLoaded: root.definition = Model.characterFromJson(text(), root.path)
    onLoadFailed: root.definition = null
  }
}
