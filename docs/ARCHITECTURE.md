# MyanTyper Architecture

This document records MyanTyper's technical structure, runtime boundaries, and
the decisions behind them so contributors can evaluate changes consistently.
It changes alongside any module boundary, data flow, persistence contract,
route, or core invariant.

## System Context

MyanTyper is a local-first web application whose finite curriculum routes are
statically generated:

- Next.js 16 App Router and React 19
- TypeScript 6 in strict mode
- Tailwind CSS 4 with project design tokens
- Vitest 4, Biome 2, and Lefthook 2 for local and CI verification
- Optional Google authentication through Better Auth, Neon Postgres, and
  Drizzle ORM; local practice still requires no account
- No analytics; remote persistence is limited to optional account-scoped
  typing-history sync
- Browser IndexedDB for session history and `localStorage` for visual preferences
- WebAudio synthesis for feedback; no audio files

Practice pages are generated from the finite curriculum at build time. The
standard deployment uses a Next.js server to handle authentication and serve
the configured response headers. A static export can preserve the signed-out
experience but cannot provide the authentication route.

## Architectural Principles

1. **Keyboard correctness is centralized.** All key display, hints, and matching
   derive from `src/lib/keyboard.ts`.
2. **Curriculum content is data.** Reviewed lesson content lives under
   `src/lib/curriculum`, separate from UI and typing behavior.
3. **The assembler derives runtime metadata.** `src/lib/lessons.ts` flattens
   units for routes while preserving the unit hierarchy for the catalogue.
4. **Typing uses physical keys.** Input matching uses `KeyboardEvent.code` plus
   Shift state, not the operating system's emitted `event.key`.
5. **Display order and typing order are separate.** Myanmar text remains normal
   Unicode for display; visual keyboard order is derived for keystroke matching.
6. **Persistence stays local and validated.** Storage access is isolated behind
   explicit contracts.
7. **Browser capabilities default closed.** Production responses set a content
   security policy and deny unused browser permissions, framing, and MIME
   sniffing.

## Directory Ownership

| Path | Responsibility |
|---|---|
| `src/app/` | Routes, metadata, static parameter generation, page composition |
| `src/app/api/auth/[...all]/` | Better Auth request handler running on the Node.js runtime |
| `src/components/` | Grouped by role: `layout/` (app chrome + tweaks), `providers/` (theme and history contexts), `ui/` (shared presentation primitives), `keyboard/` (on-screen board), and one folder per feature (`home/`, `lessons/`, `history/`, `free/`, `typing/`). A component used by a single feature lives in that feature's folder; only multi-consumer primitives live in `ui/` |
| `src/components/account/` | Optional sign-in and account-session controls |
| `src/components/typing/` | Practice-session feature slice with a public `index.ts` barrel and three internal layers: `engine/` (pure matching state machine, immutable target prep, shared types), `hooks/` (the thin `useTypingSession` adapter plus focused input/timer/audio/flash/persistence hooks), and `view/` (coordinator plus separated header/practice/completion presentation) |
| `src/components/providers/HistoryProvider.tsx` | In-memory history cache, same-tab updates, and cross-context refresh handling |
| `src/components/typing/hooks/useActiveTimer.ts` | Route-local elapsed-time lifecycle that excludes paused intervals |
| `src/lib/curriculum/` | Per-track folders containing small unit modules and reviewed lesson content |
| `src/lib/lessons.ts` | Curriculum assembly, derived metadata, lookup helpers |
| `src/lib/keyboard.ts` | Authoritative KBDMYAN keycaps and character-to-key mapping |
| `src/lib/syllable.ts` | Myanmar segmentation and visual typing order |
| `src/lib/storage.ts` | Validated localStorage reads and writes for device-local preferences (tweaks, Free Type draft) |
| `src/lib/auth/` | Better Auth server configuration and browser client |
| `src/lib/env/` | Validated server-only authentication and database configuration |
| `src/lib/progress/` | Session-history schema and validation (`types.ts`), the async `ProgressStore` seam (`store.ts`), neutral store composition (`index.ts`), and the IndexedDB implementation (`indexedDbStore.ts`) |
| `src/db/` | Neon connection and Drizzle schemas for authentication and the server history mirror |
| `src/lib/sync/` | Authenticated history transport, database repository, and local-first browser sync coordinator |
| `src/lib/wpm.ts` | Pure typing-stat calculations |
| `src/lib/themes.ts` | Theme and Myanmar-font definitions |
| `src/styles/` | Global CSS, Tailwind aliases, and theme tokens |
| `public/` | Static assets and self-hosted fonts |

## Curriculum Runtime

Each track folder has an `index.ts` that orders its small unit modules. Unit
modules directly own reviewed learner-facing text. `key-lesson.ts` constructs
the uniform one-output isolation drill, while cumulative content remains
explicit data. The root `index.ts` publishes track order, and
`src/lib/lessons.ts` then derives:

- `CURRICULUM_UNITS` for the nested catalogue
- `LESSONS` for routes, sitemap generation, and direct lookup
- `kindNumber` for numbered drill labels
- `unitId`, `unitTitle`, and `track` for runtime context
- a display title when a source lesson does not provide one

`LessonSource.introduces` is absent for reviews or contains exactly one new
Unicode code point. Curriculum tests walk the flattened order and reject
duplicate introductions, premature output use, or mapped outputs without an
introduction lesson.

`lessonById()` is the route lookup. `lessonNeighbors()` supplies completion
navigation across the flattened curriculum. `firstLessonByTrack()` supplies
track entry links without hardcoded lesson IDs. `unitsByTrack()` is the catalogue
lookup. Array position controls order; source objects do not carry numeric order
fields.

Content and sequencing policy is documented in `docs/CURRICULUM.md`.

## Typing Runtime

The typing feature separates *matching rules* from *React wiring*:

- **`typingEngine.ts` is a pure, framework-agnostic state machine.** Its
  `advance(target, state, input)` function owns every rule that moves a session
  forward: visual-order newline skipping, Shift-aware key matching, carriage
  returns, backspace, completion, and inter-keystroke rhythm. It returns the
  next immutable `EngineState` plus a list of `EngineEffect`s (sound, error
  flash, carriage return, completion). It contains no React, DOM, clock, or
  randomness: time arrives on each `EngineInput` as `at`, so it is deterministic
  and unit-tested in isolation by `typingEngine.test.ts`.
- **`useTypingSession.ts` is a thin adapter.** It decodes DOM keyboard events
  into `EngineInput`s, dispatches them through `advance`, and maps the returned
  effects onto small single-purpose hooks: `useScheduler` (tracked timeouts),
  `usePressedKeys` (keycap flash and Shift state), `useErrorFlash`,
  `useCompletionStamps`, `useActiveTimer`, `useTypewriterAudio`, and
  `usePersistCompletion` (the one history write). It exposes the explicit
  `TypingSessionModel` view contract rather than a raw hook return type.
- **`typingTarget.ts`** prepares the immutable, normalized target shared by
  matching and rendering: canonical display code points, paragraph offsets,
  visual keystroke order, and reverse step lookup.

End to end, a session:

1. Joins lesson lines into one target string and normalizes Myanmar text.
2. Segments display syllables and derives visual keystroke order.
3. Listens for physical keyboard events and converts `event.code` to the
   KBDMYAN base key label.
4. Feeds the decoded label plus `event.shiftKey` to the engine, which compares
   it against the expected `KeyHint` and advances progress, errors, timing, and
   rhythm.
5. Runs the engine's effects (audio, flashes, stamps) and, on completion,
   writes the result to local history.

The practice surface always renders the current authored line in canonical
Myanmar with the typed prefix and an inline caret. Advancing past a line break
replaces it with the next line; the target never scrolls. Keys mode adds a
compact visual-input-order rail with detached marks and a fixed strike guide.
Reader mode omits that rail. Switching modes never resets progress or matching.

The front vowel `ေ` is typed before its consonant on KBDMYAN. It remains in
normal Unicode display order; `visualTypeOrder()` owns the keystroke reordering.

## Keyboard Contract

`KB_ROWS` and `CHAR_TO_KEY` are two views of the same Windows Myanmar
(Visual order) layout. A change to one normally requires checking the other,
the on-screen keyboard, lesson coverage, and tests.

Input rules:

- Myanmar strings are split with `Array.from`, never `.split("")`.
- Combining marks remain separate code points and keystrokes.
- Input matching uses physical `event.code`, not `event.key`.
- Shift state is matched explicitly.
- `CHAR_TO_KEY` represents every lesson code point.

### Finger model

`keyboard.ts` also owns the touch-typing finger assignment (`fingerForKey`,
`fingerParts`, `fingerLabelForKey`, `HOME_KEYS`, `HOME_BUMP_KEYS`). It is keyed
by the KB_ROWS latin label, so it describes the *physical* QWERTY board and is
independent of the Myanmar layer. The on-screen keyboard tints each cap by
finger column, and the mistake notice names the required finger in words.

### On-screen keyboard sizing

`Keyboard` is fluid, not a fixed-pixel widget: it fills the column it is given
(up to an optional `maxWidth`). Every KB_ROWS row sums to 15u, so each row is a
shared 60-track CSS grid at quarter-unit granularity and a key spanning `u`
units spans `u * 4` tracks, which is what makes columns align across rows.
Keycap, gap, and type sizes all derive from `cqw` against `.mt-kb-frame`, so the
board scales as one piece. Adding a key means keeping its row at 15u.

## Persistence Contract

Two modules own persistence, split by what each kind of data has to survive.

`src/lib/storage.ts` holds device-local preferences and stays synchronous on
purpose, because theme and font must be readable before first paint and an
async read would surface as a flash:

- `myantyper.tweaks`: validated theme, font, accent, and sound preferences
- `myantyper.free-type-draft`: a bounded Unicode draft used to cross from the
  Free Type editor at `/free` to the session route at `/free/session`

`src/lib/progress/` owns the `myantyper-progress` IndexedDB database and its log
of completed sessions.
History is modelled as an **append-only log**: a finished session is immutable,
so every entry carries a stable `id` and merging two devices is a union by id
with no conflict resolution. Entries record `completedAt` as epoch milliseconds
and a `schemaVersion` per entry, not just per store, because once entries sync
one log holds records written by clients on different versions.

The database has four object stores:

- `sessions`: immutable records keyed by local scope and session ID, with
  indexes for scope, completion time, and lesson ID
- `outbox`: pending account-scoped uploads, keyed by user and session ID and
  indexed by queued time for bounded sync batches
- `syncMetadata`: each account's remote pull cursor and last sync time
- `aggregates`: constant-size all-time totals, per-lesson rollups, and the
  newest 30 sessions for each local scope

Signed-out history uses the `anonymous` scope. Signed-in history uses an
account-specific scope, with pending uploads in `outbox` and a per-account
remote cursor in `syncMetadata`. Signing in copies unsynced anonymous history
into the account scope without deleting the anonymous records.

Access goes through the async `ProgressStore` interface. `getProgressStore()`
in `index.ts` is the neutral composition point for anonymous and
account-scoped IndexedDB stores.
`HistoryProvider` holds only the constant-size overview and subscribes to the
store, so cross-context `BroadcastChannel` handling stays inside the store
rather than the provider. History tables request bounded newest-first pages
through the completion-time index; the full append-only log is never loaded
into React memory. Aggregate records are updated transactionally with local
appends, anonymous imports, and remote merges. A version-1 database lazily
builds its aggregate once after upgrading. The provider also exposes loading
and failure state so persistence errors do not become unhandled promise
rejections. Numeric page URLs use `IDBCursor.advance(offset)`: memory and
returned data stay bounded, while seeking a very deep page remains O(offset).

Browser storage access remains behind client-only effects. Invalid session
records are dropped individually rather than breaking the whole history. There
is no application-level history cap. The server `history` table mirrors
immutable client entries and uses its server-authored monotonic `seq` as an
opaque pull cursor. The authenticated `/api/sync/history` transport can upload
bounded batches idempotently and pull bounded pages for the current user. It
keeps device-authored `completedAt` separate from server-authored `createdAt`.
The browser sync coordinator uploads the outbox before pulling remote pages.
Remote entries merge into the account scope by stable entry ID, and the pull
cursor only moves forward. Sync runs after sign-in, a signed-in completion, a
cross-tab change, and browser reconnect. Network failure never blocks a local
write; pending entries stay queued for a later retry.

The account control reports whether history is syncing, synced, offline, or
saved locally after a sync failure. Offline and failed states offer a manual
retry. This status describes cross-device transport only; local persistence
errors remain part of the history view's existing error state.

## Authentication Contract

Accounts are optional and use Google OAuth only. Better Auth exposes its handler
at `/api/auth/[...all]` and persists its `user`, `session`, `account`, and
`verification` records through Drizzle. Google is the only enabled sign-in
method. The verification table remains part of Better Auth's core schema even
though the current provider does not use it for sign-in.

Database credentials, OAuth credentials, the application origin, and the auth
secret are server-only environment variables. They are validated when the auth
handler or database is first used so builds and signed-out local development do
not require account infrastructure. The browser derives login state through the
Better Auth client and never receives those secrets.

Authentication selects an account-specific IndexedDB scope. A completed lesson
is committed locally together with its outbox record before background sync is
started. The sync API derives ownership from the validated Better Auth session
and never accepts a client owner ID.

Free Type input is capped at 5,000 Unicode code points before a session can
start. A validated draft is saved before navigation to `/free/session`, so the
session can survive a refresh and return naturally to `/free` for editing.
This bounds segmentation and render work while preserving normal pasted
practice material.

## Typing Statistics Contract

`src/lib/wpm.ts` centralizes typing statistics. WPM uses five successfully
typed Unicode code points as one word. Components and feature modules share
that definition.

## Deployment Security

`next.config.ts` applies the browser security-header baseline to every route:
Content Security Policy, clickjacking and MIME-sniffing protection, a restrictive
permissions policy, cross-origin opener and resource policies, referrer policy,
and HSTS.
The production CSP only permits same-origin scripts, fonts, connections, and
forms; inline scripts and styles remain allowed because the Next.js App Router
emits them. Development additionally permits the local eval/WebSocket behavior
required by hot reload.

Static-export deployments reproduce these headers in their CDN or web-server
configuration rather than receiving them from Next.js.

## Styling Contract

- Components use semantic CSS variables and Tailwind token aliases rather than
  hardcoded hex colors.
- Theme values live in `src/styles/tokens.css` and `src/lib/themes.ts`.
- The Myanmar font is selected through the theme provider.
- Operational pages favor compact, scannable layouts over marketing cards.
- The finger-colour key (`--mt-finger-*`) is deliberately theme-independent: it
  is a legend with the same meaning on every theme. It is composited
  into the keycap at low alpha so it reads as a tint of the active theme.

## Practice Prompts

`TypingSession` always shows the readable target. The mode controls whether a
visual-input-order rail is also shown:

| Mode | Prompt | Scaffold |
|---|---|---|
| `keys` | Shaped Myanmar plus a one-line detached key sequence (`ဖေ` and `ေ  ဖ`) | Heavy: the input order is explicit |
| `reader` | Current authored line in correctly shaped Myanmar (`ဖေ` shows as `ဖေ`) | Light: the learner follows the highlighted keyboard key |

The default is derived from the lesson: structured curriculum drills open in
`keys`, while Free Type opens in `reader`. The learner can override either
default without resetting progress. A help control beside the mode switch
summarizes both modes and links to the bilingual learner guide.

The paragraph preview stays visible beside the keyboard on desktop and
highlights the current authored line.

The `mt-typewriter-*` CSS names the moving keystroke-sequence presentation;
`mt-reader-*` names the shaped prose presentation.

## Practice Screen Layout

The session keeps the target text and keyboard visible together on a laptop
viewport through these layout rules:

- The practice route fills the remaining viewport height.
- The practice header keeps lesson identity, prompt mode, help, pause, restart,
  and exit in one compact row on desktop.
- Live statistics and progress share the existing target heading instead of
  adding header height; a mistake notice temporarily replaces them.
- The current canonical target line stays visible without scrolling; Keys adds
  a compact rail.
- The keyboard takes the flexible column and is capped at 900px; the paragraph
  preview takes a fixed 300px column on desktop.
- Mistakes appear in the fixed-height target heading and do not reflow the
  keyboard.
- Cadence appears in completion results, not during active typing.
- `ChromeGate` hides the site footer on `/practice`. The header stays; it
  carries the tweaks panel, which learners reach for mid-session.

## Routes

| Route | Purpose |
|---|---|
| `/` | Overview, local statistics, and track entry points |
| `/lessons` | Track, unit, and lesson catalogue; `track` and `unit` query parameters preserve catalogue position |
| `/practice/[lessonId]` | Static practice page for a curriculum lesson |
| `/free` | User-provided text editor |
| `/free/session` | Local-draft typing session; directs learners to `/free` when no valid draft exists |
| `/guide` | Bilingual learner guide, Visual-order explanation, and practice-mode guidance |
| `/history` | Local session history |
| `/myanmar-keyboard` | Keyboard reference |
| `/myanmar-unicode` | Unicode reference |
| `/about` | Project information |
| `/privacy` | Privacy policy for anonymous use, optional accounts, and synchronized data |
| `/terms` | Terms for using the public service and optional account features |
| `/api/auth/[...all]` | Better Auth API for Google sign-in and account sessions |
| `/api/sync/history` | Authenticated, paginated push and pull transport for immutable history entries |

## Verification

Verification normally runs in this order:

```bash
pnpm lint
pnpm test
pnpm build
```

During iteration, verification stays proportional to the change. Curriculum
tests enforce unique IDs, declared tracks, unit ownership, independent track
availability, valid keyboard mappings, complete curriculum glyph coverage, and
controlled early character introduction.

Layout verification covers `/lessons` and `/practice/[lessonId]` at desktop and
mobile widths, together with browser errors.

## Current Release Boundaries

- Accounts and cross-device history sync are optional
- No account is required for lessons, Free Type, history, or preferences
- Remote sync is limited to completed session history; preferences and Free
  Type drafts remain device-local
- No analytics, advertising, or behavioral tracking
- No global state library until cross-route state genuinely requires one
- No content management system while typed local curriculum modules remain
  maintainable

## Future Constraints

MyanTyper may expand synchronized progress data and add game-based practice.
Optional accounts already preserve the local-first learning path, and future
additions must keep that contract:

- Core lessons, Free Type, and local practice remain available without an
  account.
- Signing in opts the learner into synchronizing existing local history.
- Account removal includes export and deletion of synchronized learner data.
- Storage migrations and conflict handling are explicit and versioned.
- Game features reuse the keyboard, curriculum, and typing-engine contracts
  rather than introducing separate input rules.
- Analytics or behavioral tracking are not prerequisites for these features.

## Change Impact Guide

| Change | Affected areas |
|---|---|
| Keyboard position or glyph | `keyboard.ts`, on-screen keyboard, syllable hints, curriculum coverage tests |
| Myanmar ordering rule | `syllable.ts`, `TypingSession`, segmentation tests, this document |
| Curriculum structure or titles | Curriculum modules, `lessons.ts`, catalogue UI, `CURRICULUM.md` |
| Lesson type or runtime metadata | Curriculum types, assembler, catalogue, practice header, tests |
| Storage shape | Validators, readers/writers, affected UI, persistence section here |
| Theme token | Theme definitions, token CSS, consuming components |
| Route | App route, navigation, sitemap, route table here |

## Documentation Maintenance

Documentation is part of the implementation, not a later cleanup task.

- `docs/CURRICULUM.md` tracks curriculum hierarchy, sequence, title,
  transcription, lesson-kind, and ID-policy changes.
- This document tracks architecture, module ownership, routes, data flow,
  persistence, and core runtime changes.
- Changes that cross those boundaries are reflected in both documents.
- Documentation drift is corrected alongside the change that exposes it.
