# claude-focus

A plugin for [Claude Code](https://docs.claude.com/en/docs/claude-code): **focus**.

Keeps the one next action pinned above the prompt, with time on task, parked thoughts, today's wins and a where-you-left-off recap in a pane.

Part of [claude-mods](https://github.com/MohamedHamed001/claude-mods), which lists this plugin and its siblings.

## Install

```
/plugin marketplace add MohamedHamed001/claude-focus
/plugin install focus@claude-focus
```

Then start a new session: a session reads its plugins once, when it starts. Update later with `/plugin marketplace update claude-focus`.

## Requirements

- **Claude Code 2.1.28x or newer.** The plugins use function hooks (TypeScript modules the app
  loads), which older versions do not run.
- **Windows, macOS or Linux.** Process handling is detected per session: PowerShell on Windows,
  `ps` and `pkill` elsewhere. Developed on Windows; macOS has not been tested yet.

## What it does

Keeps the one next action in front of you. Built for the "I have ADHD" writing style, where
every reply ends with a `Next:` line.

**Band (one line above the prompt).**

| State | Line |
|---|---|
| Normal | `→ Next: run the tests  [Do it]  47m  ✓ 4  2 parked  [Focus]` |
| Back after 20+ minutes | `Away 2h. You were: fix the frontend start. Next: run the tests  [Do it]  [Focus]` |
| Reply had no `Next:` line | `No next action in the last reply  [Ask for one]  ...` |

**Pane (`Focus` button or `/focus-pane`).**

| Section | Shows | Comes from |
|---|---|---|
| Now | Task name, step N of M, next action, `Do it` and `Done` | Your first prompt of a task; Claude's task list when it keeps one |
| Time | Time on task, estimate given, over by, session length | A clock started by your prompt; the first "about N minutes" in a reply |
| Parked | Thoughts set aside, each with `Start` and `Drop` | `/park <thought>`; saved per project folder |
| Done today | What was finished, with times | Tasks Claude marked completed, or your press of `Done`; shared across sessions, reset daily |
| Where you left off | Time since last activity, an optional summary | `Refresh recap` asks the model once; nothing is sent unless you press it |

**Commands.** `/park <thought>` sets a thought aside without derailing the current task.
`/focus-pane` opens the pane.

`Do it`, `Ask for one` and `Start` send a message for you. Nothing else does.

## Developing

```
claude plugin validate .
claude plugin test .
```

To run your working copy instead of the installed version, add this folder to `CLAUDE_CODE_PLUGIN_DIRS` (separated by `;` on Windows, `:` elsewhere), for example in the `env` block of `~/.claude/settings.json`, then start a new session.

## Licence

MIT, see [LICENSE](LICENSE).

Not affiliated with Anthropic.
