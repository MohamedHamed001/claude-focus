# Third-party code

## next-steps

`hooks/nextsteps.ts` and the `next:` list in `hooks/register.tsx` come from **next-steps** by
Thariq Shihipar (`next-steps@claude-community`, version 1.0.0), under the MIT licence:

```
MIT License

Copyright (c) Thariq Shihipar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

What comes from it:

- `hooks/nextsteps.ts`: its fork prompt, the parsing of the reply, and the cleaning of model text
  before it reaches the screen or the prompt box, unchanged apart from `export`.
- `hooks/register.tsx`: the detached fork after each reply, the numbered list with `0 dismiss`,
  filling the prompt box as a draft, and the Tab-to-take suggestion. Changes: item 1 is Claude's
  own `Next:` line; the list's last row carries focus's counters and Focus button; its two
  settings are focus's settings.

## i-have-adhd

The writing rules in `skills/i-have-adhd/` come from ayghri/i-have-adhd (MIT); see
[`skills/i-have-adhd/NOTICE.md`](skills/i-have-adhd/NOTICE.md).
