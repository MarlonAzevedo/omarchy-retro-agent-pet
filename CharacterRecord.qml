import QtQuick
import Quickshell.Io
import "Model.js" as Model

Item {
  id: root
  visible: false
  required property string entry
  readonly property string path: entry.split("\t")[0]
  property var definition: null

  FileView {
    path: root.path
    printErrors: false
    onLoaded: root.definition = Model.characterFromJson(text(), root.path)
    onLoadFailed: root.definition = null
  }
}
