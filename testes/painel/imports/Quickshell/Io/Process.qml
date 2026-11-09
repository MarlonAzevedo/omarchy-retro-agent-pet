import QtQuick
QtObject { property var command; property bool running; property var stdout; property var stderr; signal exited(int exitCode, int exitStatus) }
