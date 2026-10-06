# i-have-adhd

`SKILL.md` in this folder comes from [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd)
(version 0.2.0), copyright (c) 2026 Ayoub Ghriss, under the MIT licence in `LICENSE` beside it.

`SKILL.md` is unchanged. What the focus plugin adds around it:

- The plugin puts the ruleset into every session's system prompt itself (the original plugin uses
  a SessionStart hook and an opt-in flag file). It is on by default; the plugin's
  "ADHD writing rules" setting turns it off.
- When the standalone i-have-adhd plugin is installed and its always-on flag
  (`~/.claude/.i-have-adhd-always`) exists, the focus plugin does not add the rules a second time.
- The skill can still be called by hand, as in the original.
