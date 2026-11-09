import QtQuick
import Quickshell
QtObject {
  property string path
  property bool watchChanges
  property bool atomicWrites
  property bool printErrors
  property string contents: ""
  signal fileChanged()
  signal loaded()
  signal loadFailed()
  onPathChanged: reload()
  Component.onCompleted: reload()
  function reload() {
    if (!Quickshell.readFiles || !path) return
    var request = new XMLHttpRequest()
    request.open("GET", path.indexOf("file:") === 0 ? path : "file://" + path, false)
    try {
      request.send()
      if (request.status === 0 || request.status === 200) {
        contents = request.responseText
        loaded()
      } else loadFailed()
    } catch (error) { loadFailed() }
  }
  function text() { return contents }
  function setText(t) { console.log("WRITE", t) }
}
