# Changelog

All notable changes to MyanTyper are documented in this file. The project uses
[Semantic Versioning](https://semver.org/).

## [0.2.0] - 2026-07-24

Optional accounts and cross-device history sync.

### Added

- Optional Google sign-in. Practice stays anonymous and local-first by default;
  signing in is never required.
- Cross-device typing-history sync for signed-in accounts, scoped to the
  account and kept separate from anonymous local history.
- Account menu with sign-in, sync status, and in-app account deletion that
  removes the profile, sessions, and all synced history from the server.
- Privacy policy page covering the optional account, the data stored when
  signed in, service providers, and data retention and deletion.
- Terms of Service page for account and sync features.

### Changed

- About page and security policy now describe the optional account and sync
  behaviour.
- Progress history now uses IndexedDB for reliable local persistence and sync.
- Refined header popovers for consistent account and settings interactions.
- Improved metadata and page wording for Burmese and Myanmar typing searches
  while preserving MyanTyper's free, open-source positioning.

## [0.1.0] - 2026-07-18

Initial public release.

### Included

- Six progressive KBDMYAN curriculum tracks, from finger anchors and core
  syllables through vowels, medials, stacked forms, and fluency practice.
- Complete coverage of the Windows Myanmar (Visual order) keyboard's printable
  keys, including number-row symbols and shifted characters.
- Unicode-aware typing engine that separates canonical Myanmar display text
  from the physical Visual-order keystroke sequence.
- Keys mode with explicit input-order guidance and Reader mode for natural
  Myanmar text practice.
- Guided lessons with live accuracy, words-per-minute, active-time, error, and
  rhythm feedback.
- Free Type practice generated from user-provided Myanmar Unicode text, with
  normalization, length checks, unsupported-character feedback, and a Zawgyi
  warning.
- Responsive on-screen keyboard with current-key, finger, hand, and Shift-state
  guidance.
- Local lesson progress, session history, personal statistics, and WPM trend
  charting.
- Local-first storage for practice data and preferences, with no account,
  advertising, analytics, or tracking.
- Adjustable visual themes, bundled Myanmar fonts, accent colours, and optional
  typewriter feedback.
- Bilingual learner guidance and reference pages for Myanmar Unicode and the
  Windows Visual-order keyboard.
- Responsive layouts for desktop and mobile, with semantic navigation and
  visible keyboard-focus states throughout the experience.
- Search metadata, social previews, sitemap, robots directives, and production
  browser-security headers.
