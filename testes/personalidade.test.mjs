import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'

const source = readFileSync(new URL('../Model.js', import.meta.url), 'utf8').replace(/^\.pragma library\s*/, '')
const Model = new Function(source + '; return { petRows, characterFromJson, characterList, characterId, characterName, setCharacters, mood, pettingDetected, parseRecados, chooseRecados, recadoSection, pickRecado, recadoShouldChange, celebrationTrigger, format }')()
Model.setCharacters(['computer', 'cat', 'robot', 'dog', 'axolotl'].map(id =>
  Model.characterFromJson(readFileSync(new URL(`../characters/${id}.json`, import.meta.url), 'utf8'), `${id}.json`)), [])
const golden = JSON.parse(readFileSync(new URL('./fixtures/personagens-23aa180.json', import.meta.url), 'utf8'))

function sample(id = 'custom') {
  return { id, name: { pt: 'Meu pet', en: 'My pet' }, frames: 2,
    base: Array.from({ length: 16 }, () => '................'),
    eyes: [[5, 6], [10, 6]], face: 'B', mouth: [[7, 8], [8, 8]], work: [[6, 12], [9, 12]],
    overlays: [], detail: [] }
}

test('C1: sprites originais em todos os estados, quadros e tamanhos', () => {
  for (const [character, states] of Object.entries(golden))
    for (const [state, frames] of Object.entries(states))
      for (const [frame, sizes] of Object.entries(frames))
        for (const [size, expected] of Object.entries(sizes)) {
          const rows = Model.petRows(state, Number(frame), character, size === '32')
          const digest = createHash('sha256').update(rows.join('\n')).digest('hex')
          assert.equal(digest, expected, `${character}/${state}/${frame}/${size}`)
        }
})

test('C2: nenhum sprite fica escrito em Model.js', () => {
  assert.doesNotMatch(source, /function characterRows\s*\(/)
  assert.doesNotMatch(source, /["']\.{2}O[BFOECAXZ]/)
})

test('C4: JSON inválido é ignorado sem afetar os válidos', () => {
  const valid = JSON.stringify(sample())
  assert.equal(Model.characterFromJson(valid, 'custom.json').id, 'custom')
  const cases = [
    ['quebrado', '{'], ['vazio', ''],
    ['15 linhas', JSON.stringify({ ...sample(), base: sample().base.slice(1) })],
    ['pixel Q', JSON.stringify({ ...sample(), base: ['Q...............', ...sample().base.slice(1)] })],
    ['id diferente', valid.replace('"custom"', '"outro"')],
    ['olhos fora', JSON.stringify({ ...sample(), eyes: [[16, 6], [10, 6]] })]
  ]
  for (const [name, data] of cases) assert.equal(Model.characterFromJson(data, 'custom.json'), null, name)
  assert.equal(Model.characterFromJson(valid, 'custom.json').id, 'custom')
})

test('C5: embutido vence id duplicado', () => {
  const builtin = { ...sample('computer'), name: { pt: 'Original' } }
  const user = { ...sample('computer'), name: { pt: 'Outro' } }
  assert.equal(Model.characterList([builtin], [user])[0].name.pt, 'Original')
})

test('C6: id salvo inexistente cai no computador', () => {
  assert.equal(Model.characterId('sumiu', [sample('computer')]), 'computer')
})

test('C8: nome usa idioma, inglês e id nessa ordem', () => {
  const pet = sample()
  assert.equal(Model.characterName(pet, 'pt'), 'Meu pet')
  assert.equal(Model.characterName(pet, 'fr'), 'My pet')
  assert.equal(Model.characterName({ ...pet, name: {} }, 'pt'), 'custom')
})

test('C9: carinho exige três viradas em 1,5 s', () => {
  function gesture(times) {
    let state = null
    for (let i = 0; i < times.length; i++) state = Model.pettingDetected(state, i % 2 ? 10 : 0, times[i])
    return state.gesture
  }
  assert.equal(gesture([0, 100, 500, 1000, 1400]), true)
  assert.equal(gesture([0, 100, 600, 1200, 1700]), false)
  assert.equal(gesture([0, 100, 600, 1200]), false)
  assert.equal(gesture([0, 100, 200, 300, 400].map((at) => at)), true)
  let still = null
  for (const at of [0, 100, 200, 300, 400]) still = Model.pettingDetected(still, 5, at)
  assert.equal(still.gesture, false)
})

test('C10: atenção e limite impedem carinho', () => {
  assert.equal(Model.pettingDetected(null, 0, 0, 'attention').gesture, false)
  assert.equal(Model.pettingDetected(null, 0, 0, 'limit').gesture, false)
})

test('C11: carinho tem cara própria nos cinco personagens', () => {
  for (const character of Object.keys(golden)) {
    const states = ['idle', 'working', 'attention', 'done', 'focus', 'sleep', 'limit', 'petted']
    assert.equal(new Set(states.map(state => Model.petRows(state, 0, character).join())).size, states.length, character)
  }
})

test('C13: estado e humor escolhem as nove seções', () => {
  const pairs = { working: 'trabalhando', attention: 'pedido', limit: 'limite', focus: 'foco', sleep: 'dormindo' }
  for (const [state, section] of Object.entries(pairs)) assert.equal(Model.recadoSection(state, 'normal'), section)
  for (const name of ['animado', 'normal', 'cansado', 'emburrado']) assert.equal(Model.recadoSection('idle', name), name)
})

test('C14: seção ou dez minutos trocam a frase sem repetição', () => {
  const sections = { normal: ['A', 'B'] }
  assert.equal(Model.recadoShouldChange('normal', 'normal', 0, 599999), false)
  assert.equal(Model.recadoShouldChange('normal', 'normal', 0, 600000), true)
  assert.equal(Model.recadoShouldChange('normal', 'animado', 0, 1), true)
  assert.equal(Model.pickRecado(sections, 'normal', 'A', 0), 'B')
  assert.equal(Model.pickRecado(sections, 'normal', 'B', 1), 'A')
})

test('C15: arquivo do usuário substitui o embutido por idioma', () => {
  assert.deepEqual(Model.chooseRecados('[normal]\nMeu texto', '[normal]\nTexto padrão'), { normal: ['Meu texto'] })
  assert.deepEqual(Model.chooseRecados(null, '[normal]\nTexto padrão'), { normal: ['Texto padrão'] })
  assert.deepEqual(Model.chooseRecados('', '[normal]\nTexto padrão'), {})
})

test('C18: cinco personagens têm três frases por seção e idioma', () => {
  const sections = ['trabalhando', 'pedido', 'limite', 'foco', 'dormindo', 'animado', 'normal', 'cansado', 'emburrado']
  for (const character of Object.keys(golden)) for (const lang of ['pt', 'en']) {
    const text = readFileSync(new URL(`../characters/${character}/recados.${lang}.txt`, import.meta.url), 'utf8')
    const parsed = Model.parseRecados(text)
    for (const section of sections) assert.ok(parsed[section]?.length >= 3, `${character}/${lang}/${section}`)
  }
})

test('C16: seção vazia não dá frase', () => {
  assert.equal(Model.pickRecado({}, 'normal', '', 0), '')
  assert.equal(Model.pickRecado({ normal: [] }, 'normal', '', 0), '')
})

test('C19: parser ignora comentário, vazio e frase antes de seção', () => {
  assert.deepEqual(Model.parseRecados('fora\n# comentário\n\n[normal]\nOi\n# outro\nOlá\n'), { normal: ['Oi', 'Olá'] })
})

test('C20: humor respeita prioridade e limites exatos', () => {
  const now = 500000
  const day = { completed_responses: 19, active_seconds: 14400 }
  assert.equal(Model.mood([], [], day, now), 'normal')
  assert.equal(Model.mood([], [], { ...day, completed_responses: 20 }, now), 'animado')
  assert.equal(Model.mood([], [], { ...day, active_seconds: 14401, completed_responses: 20 }, now), 'cansado')
  assert.equal(Model.mood([], [{ percent: .75 }], day, now), 'cansado')
  assert.equal(Model.mood([{ status: 'attention', activity_started_at: now - 300000 }], [], day, now), 'normal')
  assert.equal(Model.mood([{ status: 'attention', activity_started_at: now - 301000 }], [{ percent: .75 }], day, now), 'emburrado')
})

test('C21: dia novo sem arquivo volta ao normal', () => {
  assert.equal(Model.mood([], [], { date: '2026-11-08', active_seconds: 15000 }, Date.parse('2026-11-09T12:00:00')), 'normal')
})

test('C22: cada personagem possui quatro faces de humor', () => {
  for (const character of Object.keys(golden))
    assert.equal(new Set(['animado', 'normal', 'cansado', 'emburrado'].map(name => Model.petRows('idle', 0, character, false, name).join())).size, 4, character)
})

test('C23: resumo traduz o humor', () => {
  assert.equal(Model.format('pt', 'todaySummary', [12, '1h 30min', 'animado']), 'Hoje · 12 respostas · 1h 30min · animado')
  assert.equal(Model.format('en', 'todaySummary', [12, '1h 30min', 'excited']), 'Today · 12 replies · 1h 30min · excited')
})

test('C24: sessão terminada aciona comemoração', () => {
  assert.equal(Model.celebrationTrigger({ state: 'working', focus: 'work', responses: 0 }, { state: 'idle', focus: 'work', responses: 0 }), 'session')
})

test('C25: foco concluído aciona uma vez', () => {
  assert.equal(Model.celebrationTrigger({ state: 'focus', focus: 'work', responses: 0 }, { state: 'idle', focus: 'done', responses: 0 }), 'focus')
  assert.equal(Model.celebrationTrigger({ state: 'idle', focus: 'done', responses: 0 }, { state: 'idle', focus: 'done', responses: 0 }), '')
})

test('C26: marcos de 25 respostas disparam sem fogos ao iniciar', () => {
  const state = responses => ({ state: 'idle', focus: '', responses })
  assert.equal(Model.celebrationTrigger(null, state(30)), '')
  assert.equal(Model.celebrationTrigger(state(24), state(25)), 'responses')
  assert.equal(Model.celebrationTrigger(state(25), state(26)), '')
  assert.equal(Model.celebrationTrigger(state(49), state(51)), 'responses')
})

test('C27: atenção ou limite prevalece sobre comemoração', () => {
  assert.equal(Model.celebrationTrigger({ state: 'working', responses: 24 }, { state: 'attention', responses: 25 }), '')
  assert.equal(Model.celebrationTrigger({ state: 'working', responses: 24 }, { state: 'limit', responses: 25 }), '')
})

test('C28: fogos animam e diferem dos outros estados', () => {
  for (const character of Object.keys(golden)) {
    const fire0 = Model.petRows('celebrate', 0, character).join()
    const fire1 = Model.petRows('celebrate', 1, character).join()
    assert.notEqual(fire0, fire1, character)
    for (const state of ['idle', 'working', 'attention', 'done', 'focus', 'sleep', 'limit', 'petted'])
      assert.notEqual(fire0, Model.petRows(state, 0, character).join(), `${character}/${state}`)
  }
  const oneFrame = { ...sample('one'), frames: 1 }
  assert.notDeepEqual(Model.petRows('celebrate', 0, oneFrame), Model.petRows('celebrate', 1, oneFrame))
})

test('C30: política lista leituras, gravações e remoção', () => {
  const policy = readFileSync(new URL('../PRIVACIDADE.md', import.meta.url), 'utf8')
  for (const term of ['sessions/', 'day/', 'focus.json', 'config.json', 'Agents', 'characters/',
    '.claude/settings.json', '.codex/hooks.json', '.bak.', 'internet', 'Como apagar'])
    assert.ok(policy.includes(term), term)
  assert.match(policy, /O código do pet não envia[^.\n]*internet/)
})

test('C31: README liga política e descreve formatos', () => {
  const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8')
  for (const term of ['[PRIVACIDADE.md](PRIVACIDADE.md)', 'Custom characters and messages',
    '<id>.json', 'recados.pt.txt', 'recados.en.txt', 'XDG_CONFIG_HOME'])
    assert.ok(readme.includes(term), term)
})
