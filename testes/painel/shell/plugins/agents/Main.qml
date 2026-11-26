// Main.qml falso do widget Agents: só a interface que o painel usa
import QtQuick
Item {
  property var agents: []
  property int dataRevision: 0
  property int refreshLimitsCalls: 0
  property int refreshAllCalls: 0
  property var lastRefreshForce: null
  function refreshLimits() { refreshLimitsCalls++ }
  function refreshAll(force) { refreshAllCalls++; lastRefreshForce = force }
  function formatTokenCount(n) { return n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : String(n) }
  function friendlyModelName(id) { return id }
}
