<p align="center">
  <img src="public/myantyper.png" alt="MyanTyper" width="144" />
</p>

<h1 align="center">MyanTyper</h1>

<p align="center">
  Learn the Windows Myanmar (Visual order) keyboard through focused, private practice.
</p>

<p align="center">
  <a href="https://myantyper.com"><strong>Try MyanTyper</strong></a>
  ·
  <a href="CONTRIBUTING.md">Contribute</a>
</p>

<p align="center">
  <a href="https://github.com/PhilixTheExplorer/myantyper/actions/workflows/ci.yml"><img src="https://github.com/PhilixTheExplorer/myantyper/actions/workflows/ci.yml/badge.svg" alt="CI status" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript 6" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <a href="LICENSE"><img src="https://img.shields.io/badge/code-AGPL--3.0--only-blue" alt="Code license: AGPL-3.0-only" /></a>
  <a href="LICENSE-CONTENT.md"><img src="https://img.shields.io/badge/content-CC%20BY--SA%204.0-green" alt="Content license: CC BY-SA 4.0" /></a>
</p>

MyanTyper is a free, open-source touch-typing tutor built specifically for the
Windows **Myanmar (Visual order)** keyboard (`KBDMYAN`). It turns Myanmar
Unicode’s multi-code-point syllables and visual input order into a clear
physical-key learning path—from finger placement to fluent sentences.

No ads. No tracking. No account required. Your preferences and practice history
stay in the browser.

## Why MyanTyper

**MyanTyper** combines **Myan** and **Typer**. *Myan* points to Myanmar and
echoes the Burmese word <span lang="my">မြန်</span>, meaning *fast*. The name
describes someone learning to type Myanmar text quickly, accurately, and with
confidence.

<span lang="my">**MyanTyper** ဆိုသည်မှာ **Myan** နှင့် **Typer** ကို
ပေါင်းစပ်ထားသော အမည်ဖြစ်သည်။ **Myan** သည် Myanmar ကို ကိုယ်စားပြုသလို “မြန်”
ဟူသော အဓိပ္ပာယ်လည်း ပါဝင်သည်။ မြန်မာစာကို မြန်မြန်၊ မှန်မှန်၊ ယုံကြည်မှုရှိရှိ
ရိုက်တတ်သူကို ဆိုလိုသည်။</span>

## The problem it solves

Myanmar typing is not a one-character, one-keystroke system. A syllable may
combine a consonant, medials, vowels, tone marks, and a coda, while the order
shown on screen can differ from the order typed on the keyboard.

MyanTyper keeps canonical Unicode readable and derives the physical key sequence
separately. For example, <span lang="my">ဖေ</span> is displayed normally, but
the Visual-order layout expects <span lang="my">ေ</span> before
<span lang="my">ဖ</span>. The tutor teaches that movement directly instead of
asking learners to imitate rendered text.

## What it includes

- Six progressive tracks covering finger anchors, vowels, medials, stacked
  forms, complete keyboard coverage, and fluency.
- An on-screen KBDMYAN keyboard with Shift state, physical-key, and finger
  guidance.
- Keys mode for explicit input-order scaffolding and Reader mode for natural
  Myanmar text.
- Free Type sessions generated from any pasted Myanmar Unicode text.
- Local WPM, accuracy, rhythm, keystroke, and session-history feedback.
- Four visual themes and multiple bundled Myanmar fonts.

## How it is built

Core typing and curriculum rules are kept separate from the interface so
contributors can understand, test, and extend one area at a time.

- **Deterministic typing engine.** A framework-independent state machine owns
  matching, visual-order advancement, Shift handling, timing, errors, and
  completion. React is a thin adapter around tested domain logic.
- **Unicode-aware input model.** Canonical display text, Myanmar syllable
  segmentation, and physical keystroke order are separate immutable views of
  the same target.
- **Data-driven curriculum.** Typed curriculum modules generate the catalogue,
  practice routes, navigation, and sitemap. Tests enforce unique lesson IDs,
  introduction order, valid key mappings, and complete keyboard coverage.
- **Local persistence.** Browser data is validated, size-bounded,
  SSR-safe, and synchronized across tabs without requiring a backend or global
  state library.
- **Browser security.** Production responses include Content
  Security Policy, restrictive browser permissions, HSTS, clickjacking
  protection, and related headers.
- **Contributor workflow.** Strict TypeScript, Biome, Vitest, pinned GitHub
  Actions, Dependabot, and a reproducible pnpm lockfile help contributors make
  changes with confidence.

The deeper runtime contracts and design decisions are documented in
[Architecture](docs/ARCHITECTURE.md).

## Stack

- Next.js 16 App Router and React 19
- TypeScript 6 in strict mode
- Tailwind CSS 4 with semantic design tokens
- Vitest 4 and Biome 2
- pnpm, Lefthook 2, and GitHub Actions

## Run locally

### Requirements

- Node.js 20 or newer
- pnpm 11

```bash
git clone https://github.com/PhilixTheExplorer/myantyper.git
cd myantyper
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run the development server |
| `pnpm lint` | Check formatting and lint rules with Biome |
| `pnpm test` | Run the Vitest suite |
| `pnpm build` | Create a production build and type-check the app |
| `pnpm format` | Apply Biome formatting |

## Project structure

```text
src/app/                 Routes, metadata, and page composition
src/components/          Feature UI, providers, and shared primitives
src/components/typing/   Pure engine, browser adapters, and session views
src/lib/curriculum/      Reviewed lesson data organized by track
src/lib/                 Keyboard, Unicode, storage, and statistics logic
src/styles/              Theme tokens, fonts, and global styles
docs/                    Architecture, curriculum, and provenance records
```

## Documentation

- [Bilingual learner guide](https://myantyper.com/guide)
- [Architecture](docs/ARCHITECTURE.md)
- [Curriculum design](docs/CURRICULUM.md)
- [Content and asset provenance](docs/PROVENANCE.md)
- [Contributing guide](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Release history](CHANGELOG.md)

## Contributing

MyanTyper grows through feedback and contributions from people who use and teach
Myanmar typing. Native-speaker review, curriculum improvements, KBDMYAN
verification, accessibility fixes, and focused bug reports are all welcome.
Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

Learner-facing Myanmar text must be original or compatibly licensed, have
documented provenance, and pass the project’s review policy.

## License

Source code is licensed under the [GNU Affero General Public License
v3.0](LICENSE). Project-authored curriculum, documentation, and artwork are
licensed under [Creative Commons Attribution-ShareAlike 4.0](LICENSE-CONTENT.md).
Bundled fonts retain their own licences; see
[font attributions](public/fonts/LICENSES.md).
