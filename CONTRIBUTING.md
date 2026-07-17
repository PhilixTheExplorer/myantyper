# Contributing to MyanTyper

Thank you for considering a contribution. MyanTyper exists to make Myanmar
Unicode typing more accessible. Native-speaker review, layout corrections,
teaching experience, accessibility feedback, and code contributions all help
the project serve learners better.

## How to contribute

1. **Open an issue first** for anything substantial (a new feature, a
   curriculum overhaul, a theme). For typo / wording fixes, just open a PR.
2. **Fork → branch → PR.** Branch names like `feat/medial-ra-lessons` or
   `fix/pyidaungsu-shift-y`.
3. **Keep PRs focused.** Smaller is easier to review.
4. **Run the relevant checks** before pushing: `pnpm lint`, `pnpm test`, and
   `pnpm build` as appropriate for the change.
5. **Keep design docs current.** Curriculum changes must update
   [`docs/CURRICULUM.md`](docs/CURRICULUM.md); architecture changes must update
   [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Where help is useful

### Curriculum

The curriculum structure and transcription rules live in
[`docs/CURRICULUM.md`](docs/CURRICULUM.md). Lesson data lives under
[`src/lib/curriculum`](src/lib/curriculum). We especially welcome:

- Native-speaker review of words, sentences, and fluency passages
- New drills that fit MyanTyper's skill progression
- Corrections to spelling, spacing, punctuation, and syllable construction
- Better progressive drills that retain complete KBDMYAN key coverage

### Keyboard layout

The shared Windows Myanmar (Visual order) KBDMYAN map lives in
[`src/lib/keyboard.ts`](src/lib/keyboard.ts) and covers the unshifted and Shift
layers. If a mapping disagrees with the official layout, open a PR or issue with
a source reference.

### Themes

Themes are CSS-token records. See `src/lib/themes.ts` for the available theme
metadata and `src/styles/tokens.css` for their visual tokens.

### Accessibility

Reports from people who use screen readers, high-contrast mode, reduced motion,
or keyboard-only navigation are especially useful. Please include the browser,
assistive technology, and steps that exposed the problem when possible.

## Code style

- TypeScript, strict mode, no `any`.
- React Server Components by default; opt into client with `"use client"`.
- Tailwind utility classes for layout/typography; CSS custom properties (via
  `styles/tokens.css`) for theme values.
- No runtime CSS-in-JS.
- Keep one primary component per feature file. Co-locate small private helpers.

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm test         # Vitest
pnpm lint         # biome lint
pnpm format       # biome format
pnpm build        # production build and TypeScript check
```

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Be
patient, be kind, assume good faith.

## License

By contributing, you agree that code contributions are licensed under the
project's [GNU Affero General Public License v3.0](LICENSE), while curriculum,
documentation, and project artwork contributions are licensed under
[Creative Commons Attribution-ShareAlike 4.0](LICENSE-CONTENT.md), unless a
contribution is clearly identified with another compatible licence before it is
accepted. Contributors must disclose third-party sources and must have the
right to submit them.
