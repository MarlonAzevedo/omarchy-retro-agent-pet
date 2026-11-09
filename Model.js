.pragma library

// Textos do painel; chave sem tradução cai no português
var TEXTS = {
  pt: {
    character: "Personagem", computer: "Computador", cat: "Gato", robot: "ET", dog: "Cachorro", axolotl: "Axolote",
    noLimitData: "Sem dados de limite", focus: "Foco", focusRound: "Foco {0}/{1}", breakRound: "Pausa {0}/{1}", paused: " · pausado",
    resume: "Continuar", pause: "Pausar", stop: "Parar", todaySummary: "Hoje · {0} respostas · {1} · {2}",
    moodAnimado: "animado", moodNormal: "normal", moodCansado: "cansado", moodEmburrado: "emburrado",
    sessions: "Sessões", noSessions: "Nenhuma sessão ativa", sessionsSummary: "● {0} rodando · {1} no total",
    limits: "Limites", depletion: "no ritmo atual, acaba às {0}", limit: "Limite", usage: "Uso", plan: "Assinatura",
    usageToday: "Hoje · {0} prompts · {1} · {2} tokens", oneSession: "{0} sessão", manySessions: "{0} sessões",
    tokensPerDay: "Tokens por dia", tokensPerModel: "Tokens por modelo", noUsage: "Sem dados de uso",
    needsYou: "● Precisa de você", waitingFor: "esperando há {0}", answerIn: "Responda no {0}; este painel continua aberto.",
    agent: "agente", moreWaiting: "+{0} esperando", moreRunning: "+{0} rodando", noRequest: "Nenhum pedido pendente",
    agents: "Agentes", noLimits: "Sem limites", noAgents: "Nenhum agente encontrado", discreet: "Modo discreto",
    discreetHint: "Sem notificações e sem piscar o ícone", enable: "Ativar", language: "Idioma", auto: "Automático",
    hiddenHint: "Agentes ocultos saem das telas de início, sessões e limites.", about: "Sobre", version: "versão {0}",
    license: "licença {0}", aboutText: "Acompanha as sessões do Claude Code e do Codex, os pedidos de permissão, os limites e o uso de cada agente.",
    createdBy: "Criado por", email: "E-mail", project: "Projeto", issues: "Problemas", openIssue: "abrir uma issue",
    credits: "Uso e limites: coletores do widget Agents do Omarchy. Inspirado no Mupli.", home: "Início", request: "Pedido",
    asked: "Pediu permissão", waitingAnswer: "Esperando resposta", idle: "Ocioso", thinking: "Pensando",
    focusDone: "Foco concluído · {0} rodadas", focusBreak: "Pausa de {0} min · rodada {1}/{2} concluída", focusWork: "Foco: rodada {0}/{1} · {2} min",
    hooksOk: "Acompanhando Claude Code e Codex", hooksMissing: "Desativado: ative para ver as sessões dos agentes", hooksInstalling: "Ativando…",
    hooksError: "Falhou; rode bin/agent-pet setup na pasta do plugin", hooksChecking: "Conferindo…", inTime: "em {0}", today: "Hoje"
  },
  en: {
    character: "Character", computer: "Computer", cat: "Cat", robot: "ET", dog: "Dog", axolotl: "Axolotl",
    noLimitData: "No limit data", focus: "Focus", focusRound: "Focus {0}/{1}", breakRound: "Break {0}/{1}", paused: " · paused",
    resume: "Resume", pause: "Pause", stop: "Stop", todaySummary: "Today · {0} replies · {1} · {2}",
    moodAnimado: "excited", moodNormal: "fine", moodCansado: "tired", moodEmburrado: "grumpy",
    sessions: "Sessions", noSessions: "No active sessions", sessionsSummary: "● {0} running · {1} total",
    limits: "Limits", depletion: "at this pace, runs out at {0}", limit: "Limit", usage: "Usage", plan: "Subscription",
    usageToday: "Today · {0} prompts · {1} · {2} tokens", oneSession: "{0} session", manySessions: "{0} sessions",
    tokensPerDay: "Tokens per day", tokensPerModel: "Tokens per model", noUsage: "No usage data",
    needsYou: "● Needs you", waitingFor: "waiting {0}", answerIn: "Answer in {0}; this panel stays open.",
    agent: "the agent", moreWaiting: "+{0} waiting", moreRunning: "+{0} running", noRequest: "No pending request",
    agents: "Agents", noLimits: "No limits", noAgents: "No agents found", discreet: "Discreet mode",
    discreetHint: "No notifications and no blinking icon", enable: "Turn on", language: "Language", auto: "Automatic",
    hiddenHint: "Hidden agents leave the home, sessions and limits screens.", about: "About", version: "version {0}",
    license: "license {0}", aboutText: "Follows your Claude Code and Codex sessions, permission requests, limits and usage per agent.",
    createdBy: "Created by", email: "E-mail", project: "Project", issues: "Issues", openIssue: "open an issue",
    credits: "Usage and limits: collectors of Omarchy's Agents widget. Inspired by Mupli.", home: "Home", request: "Request",
    asked: "Asked for permission", waitingAnswer: "Waiting for an answer", idle: "Idle", thinking: "Thinking",
    focusDone: "Focus done · {0} rounds", focusBreak: "{0} min break · round {1}/{2} done", focusWork: "Focus: round {0}/{1} · {2} min",
    hooksOk: "Following Claude Code and Codex", hooksMissing: "Off: turn it on to see your agents' sessions", hooksInstalling: "Turning on…",
    hooksError: "Failed; run bin/agent-pet setup in the plugin folder", hooksChecking: "Checking…", inTime: "in {0}", today: "Today"
  }
}
var DAYS = { pt: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"], en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }
var VERBS = {
  pt: { Edit: "Editando", apply_patch: "Editando", MultiEdit: "Editando", Write: "Escrevendo", Read: "Lendo", NotebookEdit: "Editando",
    Grep: "Buscando", Glob: "Buscando", WebSearch: "Pesquisando", Task: "Subagente ·", Agent: "Subagente ·" },
  en: { Edit: "Editing", apply_patch: "Editing", MultiEdit: "Editing", Write: "Writing", Read: "Reading", NotebookEdit: "Editing",
    Grep: "Searching", Glob: "Searching", WebSearch: "Searching the web", Task: "Subagent ·", Agent: "Subagent ·" }
}

// "pt" ou "en": escolha do config, ou o LANG do sistema no automático
function language(setting, envLang) {
  if (setting === "pt" || setting === "en") return setting
  return /^pt/i.test(String(envLang || "")) ? "pt" : "en"
}

function t(lang, key) {
  var table = TEXTS[lang] || TEXTS.pt
  return table[key] !== undefined ? table[key] : (TEXTS.pt[key] !== undefined ? TEXTS.pt[key] : key)
}

// Preenche {0}, {1}… do texto
function format(lang, key, values) {
  return t(lang, key).replace(/\{(\d+)\}/g, function(match, index) { return String((values || [])[Number(index)]) })
}

function sortSessions(sessions) {
  return (sessions || []).slice().sort(function(a, b) {
    var attention = (b.status === "attention" ? 1 : 0) - (a.status === "attention" ? 1 : 0)
    if (attention) return attention
    return Number(b.updated_at || 0) - Number(a.updated_at || 0)
  })
}

function hasAttention(sessions) {
  return (sessions || []).some(function(session) { return session.status === "attention" })
}

function petState(sessions, limits, now, focusing) {
  if (hasAttention(sessions)) return "attention"
  if (alarmingLimit(limits, 90, now)) return "limit"
  if (focusing) return "focus"
  if ((sessions || []).some(function(session) { return session.status === "working" })) return "working"
  return "idle"
}

function mood(sessions, limits, daily, now) {
  var current = now === undefined ? Date.now() : Number(now)
  if ((sessions || []).some(function(session) {
    return session.status === "attention" && Number(session.activity_started_at) > 0 &&
      current - Number(session.activity_started_at) > 300000
  })) return "emburrado"
  var date = new Date(current)
  var today = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0")
  var summary = daily && (!daily.date || daily.date === today) ? daily : {}
  if (Number(summary.active_seconds || 0) > 14400 || alarmingLimit(limits, 75, current)) return "cansado"
  return Number(summary.completed_responses || 0) >= 20 ? "animado" : "normal"
}

function pettingDetected(previous, x, now, state) {
  if (state === "attention" || state === "limit") return { lastX: x, lastDirection: 0, turns: 0, firstAt: now, gesture: false }
  var old = previous || { lastX: x, lastDirection: 0, turns: 0, firstAt: now }
  if (now - old.firstAt > 1500) old = { lastX: x, lastDirection: 0, turns: 0, firstAt: now }
  var direction = x > old.lastX ? 1 : x < old.lastX ? -1 : 0
  var turns = old.turns + (direction && old.lastDirection && direction !== old.lastDirection ? 1 : 0)
  return { lastX: x, lastDirection: direction || old.lastDirection, turns: turns, firstAt: old.firstAt, gesture: turns >= 3 }
}

var RECADO_SECTIONS = ["trabalhando", "pedido", "limite", "foco", "dormindo", "animado", "normal", "cansado", "emburrado"]
function parseRecados(text) {
  var result = {}
  var section = ""
  String(text || "").split(/\r?\n/).forEach(function(line) {
    var value = line.trim()
    if (!value || value.charAt(0) === "#") return
    var match = value.match(/^\[([^\]]+)\]$/)
    if (match) { section = RECADO_SECTIONS.indexOf(match[1]) >= 0 ? match[1] : ""; if (section && !result[section]) result[section] = []; return }
    if (section) result[section].push(value)
  })
  return result
}

function chooseRecados(userText, builtinText) {
  return parseRecados(userText !== null && userText !== undefined ? userText : builtinText)
}

function recadoSection(state, currentMood) {
  var states = { working: "trabalhando", attention: "pedido", limit: "limite", focus: "foco", sleep: "dormindo" }
  return states[state] || (["idle", "petted", "celebrate"].indexOf(state) >= 0 ? currentMood || "normal" : "")
}

// Recado fica ao menos 1 min; pedido e limite trocam na hora
function recadoShouldChange(previous, current, lastAt, now) {
  if (previous === current) return now - lastAt >= 600000
  return !previous || current === "pedido" || current === "limite" || now - lastAt >= 60000
}

function pickRecado(sections, section, previous, seed) {
  var list = sections && sections[section] || []
  if (!list.length) return ""
  var choices = list.length > 1 ? list.filter(function(value) { return value !== previous }) : list
  if (!choices.length) choices = list
  return choices[Math.abs(Math.floor(Number(seed) || 0)) % choices.length]
}

function celebrationTrigger(previous, current) {
  if (!previous || !current || current.state === "attention" || current.state === "limit") return ""
  if (previous.state === "working" && current.state === "idle") return "session"
  if (previous.focus !== "done" && current.focus === "done") return "focus"
  if (Math.floor(Number(current.responses || 0) / 25) > Math.floor(Number(previous.responses || 0) / 25)) return "responses"
  return ""
}

function alarmingLimit(limits, threshold, now) {
  var cutoff = threshold === undefined ? 90 : Number(threshold)
  return (limits || []).some(function(limit) { return limitPercent(limit, now) >= cutoff })
}

function isExpired(value, now) {
  if (!value) return false
  var time = new Date(String(value)).getTime()
  return isFinite(time) && time <= (now === undefined ? Date.now() : Number(now))
}

function visible(sessions) {
  return (sessions || []).length > 0
}

function formatDuration(seconds) {
  var total = Math.max(0, Math.floor(Number(seconds) || 0))
  var hours = Math.floor(total / 3600)
  var minutes = Math.floor((total % 3600) / 60)
  return hours > 0 ? hours + "h " + minutes + "min" : minutes + " min"
}

function sessionElapsed(session, now) {
  if (!session || (session.status !== "working" && session.status !== "attention")) return null
  var since = Number(session.activity_started_at || session.turn_started_at || session.updated_at)
  if (!isFinite(since) || since <= 0) return null
  return Math.max(0, Math.floor(((now === undefined ? Date.now() : Number(now)) - since) / 1000))
}

// Omarchy grava percent como fração (0..1); devolve 0..100
function limitPercent(limit, now) {
  return isExpired(limit && limit.resetsAt, now) ? 0 : Math.max(0, Math.min(100, (Number(limit && limit.percent) || 0) * 100))
}

// Horas da janela: "Session (5-hour)", "Weekly (7-day)", "720h window"
function windowHours(label) {
  var text = String(label || "")
  var match = text.match(/(\d+)-(hour|day)/i)
  if (match) return Number(match[1]) * (match[2].toLowerCase() === "hour" ? 1 : 24)
  match = text.match(/(\d+)h\b/i)
  return match ? Number(match[1]) : 0
}

// "5h", "7d", "30d"; sem janela reconhecida mantém o rótulo
function windowShort(label) {
  var hours = windowHours(label)
  if (!hours) return String(label || "")
  return hours >= 24 && hours % 24 === 0 ? hours / 24 + "d" : hours + "h"
}

// Renovação: "em 2h10" até 24 h; depois "sex 19:32"
function resetLabel(resetsAt, now, lang) {
  if (!resetsAt) return ""
  var time = new Date(String(resetsAt)).getTime()
  var current = now === undefined ? Date.now() : Number(now)
  if (!isFinite(time) || time <= current) return ""
  var minutes = Math.ceil((time - current) / 60000)
  if (minutes < 60) return format(lang, "inTime", [minutes + "min"])
  if (minutes < 24 * 60) {
    var rest = minutes % 60
    return format(lang, "inTime", [Math.floor(minutes / 60) + "h" + (rest < 10 ? "0" : "") + rest])
  }
  var date = new Date(time)
  var pad = function(value) { return (value < 10 ? "0" : "") + value }
  return (DAYS[lang] || DAYS.pt)[date.getDay()] + " " + pad(date.getHours()) + ":" + pad(date.getMinutes())
}

function sessionName(session) {
  if (session.session_title) return session.session_title
  var parts = String(session.cwd || "").split("/").filter(function(part) { return part })
  return parts.length ? parts[parts.length - 1] : session.session_id
}

function activityText(session, lang) {
  if (session.status === "attention") return t(lang, session.attention_reason === "permission" ? "asked" : "waitingAnswer")
  if (session.status !== "working") return t(lang, "idle")
  if (!session.current_tool) return t(lang, "thinking")
  if (!session.tool_detail) return session.current_tool
  return ((VERBS[lang] || VERBS.pt)[session.current_tool] || session.current_tool + " ·") + " " + session.tool_detail
}

function permissionText(session) {
  return (session.current_tool || "Claude Code") + (session.tool_detail ? ": " + session.tool_detail : "")
}

// "<1m", "3m", "1h05"
function shortDuration(seconds) {
  var minutes = Math.floor(Math.max(0, Number(seconds) || 0) / 60)
  if (minutes < 1) return "<1m"
  if (minutes < 60) return minutes + "m"
  var rest = minutes % 60
  return Math.floor(minutes / 60) + "h" + (rest < 10 ? "0" : "") + rest
}

function runningCount(sessions) {
  return (sessions || []).filter(function(session) { return session.status === "working" }).length
}

// No ritmo atual, quando o limite chega a 100%; null se durar até a renovação
function depletionTime(limit, now) {
  var hours = windowHours(limit && limit.label)
  var reset = new Date(String(limit && limit.resetsAt)).getTime()
  var percent = limitPercent(limit, now)
  if (!hours || !isFinite(reset) || percent <= 0) return null
  var current = now === undefined ? Date.now() : Number(now)
  var start = reset - hours * 3600000
  if (current <= start) return null
  var end = start + Math.round((current - start) * 100 / percent)
  return end < reset ? end : null
}

var AGENT_LABELS = { claude: "Claude Code", codex: "Codex" }

function agentLabel(session) {
  var agent = session && session.agent || "claude"
  return AGENT_LABELS[agent] || agent
}

// Sessão sem agent é do Claude Code (arquivos anteriores ao campo)
function visibleSessions(sessions, hidden) {
  return (sessions || []).filter(function(session) { return (hidden || []).indexOf(session.agent || "claude") < 0 })
}

// Agentes visíveis que têm limites, para o seletor dos gráficos
function limitRecords(records, hidden) {
  return visibleRecords(records, hidden).filter(function(record) { return record.limits && record.limits.length > 0 })
}

function pickRecord(records, id) {
  var list = records || []
  for (var i = 0; i < list.length; i++)
    if (list[i].id === id) return list[i]
  return list.length ? list[0] : null
}

// Saída do find em ordem fixa: a ordem de gravação muda e recriaria os leitores
function jsonFiles(text) {
  return String(text || "").split("\n").filter(function(path) { return path.endsWith(".json") }).sort()
}

// Falha passageira do coletor grava limites vazios; mantém os últimos bons até maxAgeMs
function keepLimits(previous, current, now, maxAgeMs) {
  return (current || []).map(function(record) {
    if (record.limits && record.limits.length) return record
    var old = (previous || []).filter(function(item) { return item.id === record.id })[0]
    if (!old || !old.limits || !old.limits.length) return record
    var limitsAt = old.limitsAt || old.updatedAt
    if (now - Date.parse(limitsAt) > maxAgeMs) return record
    return Object.assign({}, record, { limits: old.limits, tierLabel: record.tierLabel || old.tierLabel, limitsAt: limitsAt })
  })
}

function visibleRecords(records, hidden) {
  return (records || []).filter(function(record) { return (hidden || []).indexOf(record.id) < 0 })
}

// Agente com algum dado, como o providerHasData do widget Agents do Omarchy
function hasUsage(record) {
  return record.todayPrompts > 0 || record.todaySessions > 0 || record.totalPrompts > 0
    || record.totalSessions > 0 || record.activeDays > 0 || (record.limits && record.limits.length > 0)
    || (record.accounts && record.accounts.length > 0) || !!record.balance
    || (record.ready === true && !!record.tierLabel)
}

// Tela Uso: agentes visíveis que já registraram algum uso
function usageRecords(records, hidden) {
  return visibleRecords(records, hidden).filter(hasUsage)
}

// Tokens dos últimos dias; share é a fração do dia mais movimentado
function dayRows(recentDays, today, lang) {
  var list = recentDays || []
  var peak = Math.max.apply(null, [0].concat(list.map(function(day) { return Number(day.messageCount) || 0 })))
  return list.map(function(day) {
    var tokens = Number(day.messageCount) || 0
    var date = new Date(day.date + "T00:00:00")
    return { date: day.date, label: day.date === today ? t(lang, "today") : (DAYS[lang] || DAYS.pt)[date.getDay()], tokens: tokens, share: peak ? tokens / peak : 0, today: day.date === today }
  })
}

// Os 4 modelos com mais tokens (entrada, saída e cache)
function modelRows(modelUsage) {
  var rows = Object.keys(modelUsage || {}).map(function(id) {
    var bucket = modelUsage[id] || {}
    var total = (Number(bucket.inputTokens) || 0) + (Number(bucket.outputTokens) || 0)
      + (Number(bucket.cacheReadInputTokens) || 0) + (Number(bucket.cacheCreationInputTokens) || 0)
    return { id: id, total: total }
  }).sort(function(a, b) { return b.total - a.total }).slice(0, 4)
  var peak = rows.length ? rows[0].total : 0
  return rows.map(function(row) { return { id: row.id, total: row.total, share: peak ? row.total / peak : 0 } })
}

// Foco/pomodoro: rodadas de trabalho com pausa entre elas (sem pausa após a última)
function focusPhase(focus, now) {
  if (!focus || typeof focus.started_at !== "number") return null
  var work = Number(focus.work_min) * 60000
  var rest = Number(focus.break_min) * 60000
  var rounds = Number(focus.rounds) || 1
  var cycle = work + rest
  var elapsed = Math.max(0, (typeof focus.paused_at === "number" ? focus.paused_at : now) - focus.started_at)
  var base = { rounds: rounds, paused: typeof focus.paused_at === "number" }
  if (elapsed >= rounds * work + (rounds - 1) * rest)
    return Object.assign({ phase: "done", round: rounds, remainingMs: 0, share: 1 }, base)
  var round = Math.floor(elapsed / cycle)
  var within = elapsed - round * cycle
  var working = within < work
  return Object.assign({
    phase: working ? "work" : "break",
    round: round + 1,
    remainingMs: working ? work - within : cycle - within,
    share: working ? within / work : (within - work) / rest
  }, base)
}

// "15:04"; segundos arredondados para cima, para não mostrar 0:00 antes do fim
function focusClock(ms) {
  var seconds = Math.ceil(Math.max(0, ms) / 1000)
  var rest = seconds % 60
  return Math.floor(seconds / 60) + ":" + (rest < 10 ? "0" : "") + rest
}

// Texto do aviso ao entrar em cada etapa do foco
function focusMessage(info, focus, lang) {
  if (info.phase === "done") return format(lang, "focusDone", [info.rounds])
  if (info.phase === "break") return format(lang, "focusBreak", [focus.break_min, info.round, info.rounds])
  return format(lang, "focusWork", [info.round, info.rounds, focus.work_min])
}

// Estado dos hooks na tela Agentes ("", ok, missing, installing, error)
var HOOKS_KEYS = { ok: "hooksOk", missing: "hooksMissing", installing: "hooksInstalling", error: "hooksError" }
function hooksText(state, lang) {
  return t(lang, HOOKS_KEYS[state] || "hooksChecking")
}

// Biblioteca compartilhada: só a primeira cópia do painel (um por monitor) avisa
var CLAIMED = {}
function claimOnce(key) {
  if (CLAIMED[key]) return false
  CLAIMED[key] = true
  return true
}

// Definições carregadas pelo painel; sprites ficam nos arquivos characters/*.json.
var CHARACTERS = []

function characterFromJson(text, filename) {
  var item
  try { item = JSON.parse(String(text || "")) } catch (error) { return null }
  if (!item || typeof item !== "object" || Array.isArray(item)) return null
  var fileId = String(filename || "").split("/").pop().replace(/\.json$/, "")
  if (!/^[a-z][a-z0-9_-]*$/.test(item.id) || item.id !== fileId) return null
  if (!item.name || typeof item.name !== "object" || Array.isArray(item.name)) return null
  if (!Number.isInteger(item.frames) || item.frames < 1 || item.frames > 4) return null
  if (!Array.isArray(item.base) || item.base.length !== 16 ||
      !item.base.every(function(row) { return typeof row === "string" && /^[.OECBFAZX]{16}$/.test(row) })) return null
  function points(value) {
    return Array.isArray(value) && value.length === 2 && value.every(function(point) {
      return Array.isArray(point) && point.length === 2 && point.every(function(n) { return Number.isInteger(n) && n >= 0 && n < 16 })
    })
  }
  if (!points(item.eyes) || !points(item.mouth) || !points(item.work) || !/^[OECBFAZX]$/.test(item.face)) return null
  function validWhen(when) {
    if (!when || typeof when !== "object" || Array.isArray(when)) return false
    return Object.keys(when).every(function(key) {
      if (key === "state") return typeof when[key] === "string"
      if (key === "frame") return Number.isInteger(when[key]) && when[key] >= 0 && when[key] < item.frames
      if (key === "phase") return Number.isInteger(when[key]) && when[key] >= 0 && when[key] < item.frames
      if (key === "awake") return typeof when[key] === "boolean"
      return false
    })
  }
  if (!Array.isArray(item.overlays) || !item.overlays.every(function(overlay) {
    return overlay && validWhen(overlay.when) && overlay.rows && typeof overlay.rows === "object" && !Array.isArray(overlay.rows) &&
      Object.keys(overlay.rows).every(function(y) { return /^(?:[0-9]|1[0-5])$/.test(y) && /^[.OECBFAZX]{16}$/.test(overlay.rows[y]) })
  })) return null
  if (!Array.isArray(item.detail) || !item.detail.every(function(detail) {
    return detail && validWhen(detail.when) && Array.isArray(detail.lines) && detail.lines.every(function(line) {
      return Array.isArray(line) && line.length === 3 && Number.isInteger(line[0]) && Number.isInteger(line[1]) &&
        line[0] >= 0 && line[1] >= 0 && line[1] < 32 && typeof line[2] === "string" &&
        /^[.OECBFAZXHSGD]+$/.test(line[2]) && line[0] + line[2].length <= 32
    })
  })) return null
  return item
}

function characterList(builtins, user) {
  var result = []
  var seen = Object.create(null)
  var order = ["computer", "cat", "robot", "dog", "axolotl"]
  var sortedBuiltins = (builtins || []).slice().sort(function(a, b) { return order.indexOf(a.id) - order.indexOf(b.id) })
  var sortedUser = (user || []).slice().sort(function(a, b) { return a.id.localeCompare(b.id) })
  ;sortedBuiltins.concat(sortedUser).forEach(function(item) {
    if (!item || seen[item.id]) return
    seen[item.id] = true
    result.push(item)
  })
  return result
}

function setCharacters(builtins, user) { CHARACTERS = characterList(builtins, user) }

function characterId(value, list) {
  var available = list || CHARACTERS
  return available.some(function(item) { return item.id === value }) ? value : "computer"
}

function characterName(item, lang) {
  if (!item) return ""
  return (item.name && (item.name[lang] || item.name.en)) || item.id
}

function characterDefinition(value) {
  if (value && typeof value === "object" && Array.isArray(value.base)) return value
  var id = characterId(value)
  return CHARACTERS.filter(function(item) { return item.id === id })[0] || null
}

function matchesWhen(when, state, frame, frames) {
  if (when.state !== undefined && when.state !== state) return false
  if (when.frame !== undefined && when.frame !== frame) return false
  if (when.phase !== undefined && when.phase !== frame % frames) return false
  if (when.awake !== undefined && when.awake !== (state !== "sleep")) return false
  return true
}

function petRows(state, frame, character, detailed, mood) {
  var item = characterDefinition(character)
  if (!item) return Array.from({ length: detailed ? 32 : 16 }, function() { return ".".repeat(detailed ? 32 : 16) })
  var phase = Number(frame) % item.frames || 0
  var rows = item.base.slice()
  function pixel(x, y, value) { rows[y] = rows[y].slice(0, x) + value + rows[y].slice(x + 1) }
  var override = item.overlays.some(function(overlay) { return matchesWhen(overlay.when, state, phase, item.frames) })
  if (!override) {
    var eye = state === "limit" && phase === 0 ? "X" : state === "sleep" || state === "focus" ? item.face : "E"
    item.eyes.forEach(function(point) {
      pixel(point[0], point[1], eye)
      if (point[1] + 1 < 16) pixel(point[0], point[1] + 1, state === "done" ? item.face : state === "focus" ? "C" : eye)
    })
    if (state === "attention") item.mouth.forEach(function(point) { pixel(point[0], point[1], "X") })
    if (state === "working") {
      var work = item.work[phase % 2]
      pixel(work[0], work[1], "A")
    }
    if (state === "petted") {
      item.eyes.forEach(function(point) { pixel(point[0], point[1], "F") })
      item.mouth.forEach(function(point) { pixel(point[0], point[1], "A") })
    }
    if (state === "celebrate") {
      var spark = Number(frame) % 2 || 0
      pixel(1 + spark, 1, "A"); pixel(14 - spark, 1, "X")
      pixel(1 + ((spark + 1) % 2), 3, "X"); pixel(14 - ((spark + 1) % 2), 3, "A")
    }
  }
  item.overlays.forEach(function(overlay) {
    if (matchesWhen(overlay.when, state, phase, item.frames))
      Object.keys(overlay.rows).forEach(function(y) { rows[Number(y)] = overlay.rows[y] })
  })
  if (state === "idle" && mood && mood !== "normal") {
    var face = mood === "animado" ? "A" : mood === "cansado" ? "Z" : "X"
    item.eyes.forEach(function(point) { pixel(point[0], point[1], face) })
    if (mood === "emburrado") item.mouth.forEach(function(point) { pixel(point[0], point[1], "X") })
    if (mood === "animado") item.mouth.forEach(function(point) { pixel(point[0], point[1], "A") })
  }
  if (!detailed) return rows
  var pixels = []
  rows.forEach(function(row) {
    var doubled = row.split("").map(function(color) { return color + color }).join("")
    pixels.push(doubled.split(""), doubled.split(""))
  })
  for (var y = 1; y < 31; y++) for (var x = 1; x < 31; x++) {
    if (pixels[y][x] !== "B") continue
    if (pixels[y][x - 1] === "O" || pixels[y - 1][x] === "O") pixels[y][x] = "H"
    else if (pixels[y][x + 1] === "O" || pixels[y + 1][x] === "O") pixels[y][x] = "S"
  }
  if ((!mood || mood === "normal") && state !== "petted" && state !== "celebrate")
    item.detail.forEach(function(detail) {
      if (!matchesWhen(detail.when, state, phase, item.frames)) return
      detail.lines.forEach(function(line) {
        for (var i = 0; i < line[2].length; i++) pixels[line[1]][line[0] + i] = line[2].charAt(i)
      })
    })
  return pixels.map(function(row) { return row.join("") })
}
