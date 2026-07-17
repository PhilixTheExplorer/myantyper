# MyanTyper Curriculum Design

This document records the curriculum structure, lesson ordering, identifiers,
content policy, and learner progression. It gives contributors a shared basis
for reviewing changes. The document and code remain aligned in the same change.

## Purpose

MyanTyper teaches touch typing for the Windows Myanmar (Visual order) keyboard
(KBDMYAN). The curriculum is organized around physical reach, character
frequency, orthographic complexity, visual typing order, and typing fluency.
Authorship, review, and licensing are recorded in `docs/PROVENANCE.md`.

## Tracks

The curriculum moves through six skill tracks:

| Track ID | Display name | Focus |
|---|---|---|
| `foundation` | Keyboard Foundations | Finger zones, unshifted consonants, and controlled reaches |
| `core` | Core Myanmar | Simple vowels, marks, open syllables, and common combinations |
| `vowels` | Vowel Building | Front-vowel order, shifted vowels, tones, punctuation, and transitions |
| `medials` | Medials and Joined Forms | Ya, Ra, Wa, and Ha medials and medial-vowel chains |
| `stacking` | Codas and Stacking | Asat codas, virama stacks, kinzi, rare outputs, numerals, and full-keyboard checks |
| `fluency` | Sentences and Fluency | Words, phrases, sentences, rhythm, hand balance, and continuous typing |

Track and unit array position is curriculum order. There is no duplicate
`order` field. Learners may open any track; tracks guide practice rather than
locking it.

## Curriculum Hierarchy

```text
Track
  Unit
    Drill 1
    Drill 2
    ...
```

The current curriculum uses `drill` as its only lesson kind, including for word,
sentence, fluency, and checkpoint material. Future lesson kinds may be added
when a distinct presentation or runtime behavior helps learners and fits the
progression described here.

## Lesson Model

The source types live in `src/lib/curriculum/types.ts`:

```ts
type Track =
  | "foundation"
  | "core"
  | "vowels"
  | "medials"
  | "stacking"
  | "fluency";

type LessonKind = "drill";

interface LessonSource {
  id: string;
  kind: LessonKind;
  title?: string;
  hint?: string;
  introduces?: string;
  lines: string[];
}

interface CurriculumUnitSource {
  id: string;
  track: Track;
  title: string;
  lessons: readonly LessonSource[];
}
```

`src/lib/lessons.ts` derives lesson numbering, unit ownership, display titles,
and the flattened `LESSONS` collection. Source files contain authored material
rather than copies of that derived metadata.

`introduces` identifies the single new keyboard output taught by a key-memory
lesson. Its value contains exactly one Unicode code point. Combination and
review lessons omit it. `keyLesson()` builds the short isolation drill shared
by these lessons; track unit files keep the cumulative practice text beside its
unit.

## Current Progression

| Track | Units |
|---|---|
| Keyboard Foundations | Build the finger anchors; Reach, repeat, and review |
| Core Myanmar | Build common vowel patterns; Add marks, finals, and review |
| Vowel Building | Learn visual order and shifted vowels; Build common Shift-key control; Practise transitions and punctuation |
| Medials and Joined Forms | Learn Ya and Ra medials; Add shifted Wa and Ha medials; Practise medial switches and chains |
| Codas and Stacking | Build codas and stacked forms; Cover numerals and Shift rows; Review the consonant families; Complete the keyboard checkpoint |
| Sentences and Fluency | Build word and spacing rhythm; Extend rhythm into sentences; Review vowels, reaches, and patterns; Build hand balance and flow |

The first three tracks introduce a small key group, then add one vowel, mark,
visual-order rule, or Shift group at a time. Each track is divided into short
units that move from introduction to controlled repetition, combinations, and
review. Medials are separated from coda and stacking drills so learners do not
absorb several new orthographic movements at once. The complete-keyboard unit
deliberately includes rare KBDMYAN outputs. Fluency units then recombine learned
movements in reviewed words, phrases, and sentences.

## Sequencing Policy

MyanTyper evaluates new or reordered material against these criteria:

1. Physical finger reach and hand balance.
2. Frequency and usefulness of the target code points.
3. Shift-key and visual-order difficulty.
4. Myanmar syllable and orthographic complexity.
5. Previously introduced prerequisites.
6. Availability of reviewed practice text that the project may distribute.

Within that sequence, keyboard outputs follow a learn–combine–review cycle:

1. A key-memory lesson introduces exactly one new output and repeats it in
   isolation. Shifted and unshifted outputs are separate introductions.
2. Relevant practice may combine that output only with outputs already learned.
3. A cumulative drill follows a small related key group and introduces nothing.
4. Authored lines use only outputs introduced in an earlier lesson.

Units group related fingers, reaches, or orthographic skills; they are not one
unit per key. This keeps the catalogue navigable while lessons remain focused.

Contributed material fits this progression and the content and provenance
policy below.

## Identifier Rules

IDs are lowercase ASCII strings and identify their owning track and two-digit
unit. Every lesson follows `<track>-uNN-<description>`, for example:

- `core-u02-open-syllables`
- `vowels-u03-front-vowel-order`
- `medials-u01-medial-ra`
- `stacking-u01-asat-codas`
- `fluency-u01-sentence-cadence`

Lesson IDs are public, stable identifiers from version 0.1.0 onward. Changing
one changes its route and local-history identity, so an ID change requires an
explicit migration decision rather than a silent rename.

## Content and Provenance Policy

`docs/PROVENANCE.md` records the current curriculum's authorship, review status,
and content licence.

- Lesson patterns, word lists, sentences, and passages are original material or
  carry a documented compatible licence.
- Copied or lightly altered passages, exercises, distinctive examples, unit
  titles, and lesson arrangements are not accepted without permission.
- Non-original material includes a record of its origin and licence.
- New or changed Myanmar content reaches final status after maintainer or
  native-speaker review.
- Learner text uses normalized Unicode rather than Zawgyi.
- Code-point operations use `Array.from(text)`, not `.split("")`.
- Every target code point has a `CHAR_TO_KEY` mapping before it enters a lesson.
- Storage and display remain canonical Unicode. `visualTypeOrder()` alone
  derives the KBDMYAN input sequence, including typing `ေ` before its consonant.

## Keyboard Coverage

Every printable output in `CHAR_TO_KEY` has one introduction lesson and occurs
somewhere in the project curriculum. Space and Enter are session
controls rather than lesson introductions. `src/lib/lessons.test.ts` enforces
the one-output rule, unique introduction, complete coverage, and absence of
premature use. Rare Pali and Sanskrit letters belong in the complete-keyboard
checkpoint rather than early practice.

The introduction-order invariant applies to every track, including rare outputs
and Latin symbols in the complete-keyboard checkpoint.

## UI Presentation

The lesson catalogue presents one track at a time:

```text
Track tabs
  Track heading and progress
  Next unfinished lesson
  Collapsible units
    Numbered drills
```

Units generally contain two to six short drills. Repetition is intentional:
new key patterns first appear in isolation, then in alternating sequences,
words, and cumulative review. Completion remains accuracy-based session
practice. Mastery thresholds and adaptive repetition are not represented in the
current curriculum metadata.

All structured lessons default to Keys mode so the visual input-order rail is
available. Learners may switch to Reader mode when they want less scaffolding.
Free Type continues to default to Reader mode.

## Review Checklist

A curriculum change is ready to merge when:

1. The text is original or its compatible licence and provenance are recorded.
2. Maintainer or native-speaker review of learner-facing Myanmar is recorded.
3. IDs follow the conventions and array order follows the documented sequence.
4. Every code point maps to a physical KBDMYAN key.
5. `pnpm test` and the appropriate lint/build checks pass.
6. The lesson catalogue and practice screen render correctly.
7. This document reflects any change to structure, sequencing, or policy.

## Change Log Policy

Git records chronological lesson history. This document describes the current
intended curriculum rather than duplicating that history.
