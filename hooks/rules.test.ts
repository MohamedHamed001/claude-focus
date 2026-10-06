// The bundled ADHD writing rules: how the skill file becomes system-prompt text, and when the
// plugin adds it (on by default, off by setting, and not twice next to the standalone plugin).

import { expect, test } from 'claude-code/testing'

import { adhdRulesText, standaloneAdhdActive } from './logic'

const SKILL = '---\nname: i-have-adhd\nlicense: MIT\n---\n\n# i-have-adhd\n\nLead with the next action.\n'

test('the skill file loses its front matter and gains a header', () => {
  const text = adhdRulesText(SKILL)
  expect(text.startsWith('ADHD MODE ACTIVE (from the focus plugin)')).toBe(true)
  expect(text).toContain('# i-have-adhd\n\nLead with the next action.')
  expect(text).not.toContain('license: MIT')
})

test('the standalone plugin counts only when installed and switched on', () => {
  const standalone = [{ name: 'i-have-adhd:i-have-adhd', plugin: 'i-have-adhd' }]
  expect(standaloneAdhdActive(standalone, true)).toBe(true)
  expect(standaloneAdhdActive(standalone, false)).toBe(false) // installed, always-on flag missing
  expect(standaloneAdhdActive([{ name: 'focus:i-have-adhd', plugin: 'focus' }], true)).toBe(false) // our own copy
  expect(standaloneAdhdActive([], true)).toBe(false)
})

/** A started session on a fake machine; returns the system prompt sections it composes. */
async function composedSections($: any, on: any, commands: Array<{ name: string; plugin?: string }>, flag: boolean) {
  on('session.start', (_$: unknown, e: object) => ({ ...e, cwd: 'D:/repo' }))
  on('clock.now', () => ({ value: 1_000 }))
  on('clock.every', () => ({ value: undefined }))
  on('store.get', () => ({ value: undefined }))
  on('command.register', (_$: unknown, e: { name: string }) => ({ value: { command: e.name } }))
  on('command.list', () => ({ value: commands.map(one => ({ ...one, description: '', source: 'plugin' })) }))
  on('env.get', (_$: unknown, e: { name: string }) => ({ value: e.name === 'HOME' ? '/home/me' : undefined }))
  on('fs.exists', () => ({ value: flag }))
  on('fs.read', () => ({ value: SKILL }))
  on('prompt.compose', () => ({ sections: [] }))

  await $.session.start({ source: 'startup', cwd: 'D:/repo' } as never)
  const composed = await $.prompt.compose({ model: 'claude-opus-5-5', promptModel: 'claude-opus-5-5', surfaces: [], tools: [], outputStyle: null, traits: [] } as never)

  return (composed.sections as Array<{ id: string; text: string }>).map(section => section.id)
}

test('by default every session gets the rules', async ($, on) => {
  expect(await composedSections($, on, [], false)).toContain('focus:adhd-rules')
})

test('the setting switches them off', { options: { adhdRules: false } }, async ($, on) => {
  expect(await composedSections($, on, [], false)).not.toContain('focus:adhd-rules')
})

test('next to the switched-on standalone plugin they are not added twice', async ($, on) => {
  const ids = await composedSections($, on, [{ name: 'i-have-adhd:i-have-adhd', plugin: 'i-have-adhd' }], true)
  expect(ids).not.toContain('focus:adhd-rules')
})
