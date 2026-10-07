# claude-focus

A plugin for [Claude Code](https://docs.claude.com/en/docs/claude-code): **focus**.

Keeps the one next action pinned above the prompt, with time on task, parked thoughts, today's wins and a where-you-left-off recap in a pane.

It bundles the [i-have-adhd](https://github.com/ayghri/i-have-adhd) writing rules, so it works on
its own: no separate skill to install.

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
- **Windows, macOS or Linux.** Developed on Windows; macOS has not been tested yet.

## What it does

Keeps the one next action in front of you.

### The writing rules

Every session gets the [i-have-adhd](https://github.com/ayghri/i-have-adhd) ruleset in its system
prompt. It shapes Claude's replies for a reader with ADHD:

1. Lead with the next action, not with context.
2. Number multi-step work, one bounded action per step.
3. End with one concrete next action: a closing `Next: …` line. **This is the line the band pins.**
4. Restate where you are every turn, give specific time estimates, make finished work visible.
5. No preamble, no recap, no "let me know if…"; tangents become a separate question.

The full text is [`skills/i-have-adhd/SKILL.md`](skills/i-have-adhd/SKILL.md).

| To | Do |
|---|---|
| Switch the rules off for one session | Say "stop adhd mode" (or "normal mode") |
| Switch them off for good | `/config`, then turn off **ADHD writing rules** (the band then only shows a next action when a reply happens to end with `Next:`) |
| Use the standalone i-have-adhd plugin instead | Keep it installed with its always-on flag; this plugin then does not add the rules a second time |

**The next: list (above the prompt).** From
[next-steps](https://github.com/anthropics/claude-plugins-community) by Thariq Shihipar (MIT),
as that plugin draws it, plus one row for focus:

```
next:
  1 Summarise the changes
  2 Review the diff
  3 Run the export tests
  0 dismiss     explain: [simpler] [example] [where it fits]  47m  ✓ 4  2 parked  [Focus]
```

| Item | Comes from |
|---|---|
| 1 to 3 | next-steps: after each reply, one forked request (it shares the prompt cache, so it costs one short reply) suggests likely next prompts, including your skills and slash commands |
| 0 | Hides the list until the next reply |
| simpler, example, where it fits | Shown after a reply of 600 characters or more. Each sends one fixed follow-up: start the explanation again from what it is, show one concrete example, or say where it sits in the whole flow |
| Last row | Time on task, today's wins, parked thoughts, and the Focus button |

Pressing a number puts that prompt in the prompt box as a draft you can edit and send; nothing
is sent for you. The top item is also offered as the prompt box's dim Tab-to-take suggestion.
The list hides while Claude is working.

Claude's own `Next:` line (the writing rules ask for one) stays where it is, at the end of the
reply; the Focus pane shows it under **Now**.

Settings (`/config`): **Shortest answer to suggest after** (default 80 characters) and **Suggest
skills and slash commands** (default on).

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

In the pane, `Do it` and `Start` send a message for you. Nothing else does.

## Developing

```
claude plugin validate .
claude plugin test .
```

To run your working copy instead of the installed version, add this folder to `CLAUDE_CODE_PLUGIN_DIRS` (separated by `;` on Windows, `:` elsewhere), for example in the `env` block of `~/.claude/settings.json`, then start a new session.

## Licence

MIT, see [LICENSE](LICENSE).

The writing rules in `skills/i-have-adhd/` come from
[ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd) (0.2.0), copyright (c) 2026 Ayoub
Ghriss, under the MIT licence kept beside them. They are unchanged;
[`NOTICE.md`](skills/i-have-adhd/NOTICE.md) says how this plugin uses them.

The `next:` list's suggestions come from next-steps by Thariq Shihipar (MIT); see
[`NOTICE.md`](NOTICE.md).

Not affiliated with Anthropic.
