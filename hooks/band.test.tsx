// Drives the real hooks the way a session does: a reply arrives, next-steps' fork answers,
// then the app draws the band and the pane. Catches wiring mistakes logic.test.ts cannot see.

import { expect, test } from 'claude-code/testing'

const BAND = {
  plugin: 'focus',
  surface: 'desktop',
  component: 'AbovePrompt',
  props: { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 100, scroll: { offset: 0, bodyRows: 10 }, view: {} },
} as const

const REPLY = {
  answer: 'Fixed the exporter and its tests pass now.\n\nNext: run the CAPL export tests and paste the first failing line.',
  durationMs: 1000,
  isAborted: false,
  turnId: 't1',
  reason: 'answer',
}

/** The engine beneath: a fork that suggests two prompts, and a prompt box to fill. */
function fakeEngine(on: any, forkText: string, filled: string[]) {
  on('clock.now', () => ({ value: 1_000_000 }))
  on('turn.complete', (_: unknown, e: { answer: string }) => ({ text: e.answer }))
  on('command.list', () => ({ value: [] }))
  on('model.fork', () => ({ value: { isAnswered: true, text: forkText } }))
  on('prompt.suggest', () => ({ isShown: true }))
  on('prompt.fill', (_: unknown, e: { text: string }) => {
    filled.push(e.text)

    return { isFilled: true }
  })
  on('ui.toast', () => ({ value: undefined }))
  on('ui.invalidate', () => ({ value: undefined }))
  on('ui.render', { component: 'AbovePrompt' }, ($$: any, e: any) => {
    const { Text } = $$.ui.resolve(e)

    return <Text>OTHERS</Text>
  })
}

const SUGGESTED = JSON.stringify([
  { label: 'Summarise the changes', prompt: 'Summarise the uncommitted changes' },
  { label: 'Review the diff', prompt: 'Review the uncommitted diff' },
])

/** Let the detached fork finish. */
const settle = () => new Promise(resolve => setTimeout(resolve, 20))

test("the next: list shows next-steps' suggestions; Claude's Next line stays in the reply", async ($, on) => {
  fakeEngine(on, SUGGESTED, [])
  await $.turn.complete(REPLY as never)
  await settle()

  const ui = await $.ui.mount(BAND)
  expect((await ui.find({ text: /next:/ })) !== undefined).toBe(true)
  expect((await ui.find({ text: /Summarise the changes/ })) !== undefined).toBe(true)
  expect((await ui.find({ text: /Review the diff/ })) !== undefined).toBe(true)
  expect((await ui.find({ text: /run the CAPL export tests/ })) === undefined).toBe(true) // not in the band
  expect((await ui.find({ key: 'open-focus' })) !== undefined).toBe(true)
  expect((await ui.find({ text: /OTHERS/ })) !== undefined).toBe(true) // what others drew stays
})

test('pressing 1 drafts the first suggestion, and the list is dismissed', async ($, on) => {
  const filled: string[] = []
  fakeEngine(on, SUGGESTED, filled)
  await $.turn.complete(REPLY as never)
  await settle()

  const ui = await $.ui.mount(BAND)
  await ui.press({ key: 'next-item-1' })
  expect(filled).toEqual(['Summarise the uncommitted changes'])

  const after = await $.ui.mount(BAND)
  expect((await after.find({ text: /Summarise the changes/ })) === undefined).toBe(true)
})

test('the pane draws on the desktop surface', async ($, on) => {
  const ui = await $.ui.mount({
    plugin: 'focus',
    surface: 'desktop',
    component: 'Pane',
    requestId: 'focus',
    props: {} as never,
  })
  expect((await ui.find({ text: /Done today/ })) !== undefined).toBe(true)
  expect((await ui.find({ key: 'recap' })) !== undefined).toBe(true)
})

test('a long reply gets the explain buttons; a short one does not; simpler sends its prompt', async ($, on) => {
  const sent: string[] = []
  fakeEngine(on, '[]', [])
  on('prompt.submit', (_: unknown, e: { text: string }) => {
    sent.push(e.text)

    return { text: e.text }
  })

  await $.turn.complete(REPLY as never)
  await settle()
  const short = await $.ui.mount(BAND)
  expect((await short.find({ key: 'explain-simpler' })) === undefined).toBe(true)

  await $.turn.complete({ ...REPLY, turnId: 't2', answer: 'A long explanation. '.repeat(40) } as never)
  await settle()
  const long = await $.ui.mount(BAND)
  expect((await long.find({ key: 'explain-example' })) !== undefined).toBe(true)
  await long.press({ key: 'explain-simpler' })
  await settle()
  expect(sent.length).toBe(1)
  expect(sent[0]).toContain('Start again from the beginning')
})
