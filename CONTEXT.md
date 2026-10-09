# Smile

A just-for-fun web toy: a person takes one selfie and the app says something kind and funny about their smile. It is never an assessment — nobody is ranked or compared.

## Language

### Modes

**The Twist**:
The default mode. After a fake loading sequence it tells everyone their smile is 10/10. Nothing is measured.
_Avoid_: Mode 1, fake mode, default mode

**The Real Reading**:
The mode that actually measures the photo and produces a Reading. Reachable only from The Twist's reveal.
_Avoid_: Mode 2, real mode, analysis

**Reveal**:
The result screen at the end of either mode.
_Avoid_: Result page, output

### What the app says

**Reading**:
What The Real Reading produces for one photo: an Archetype, its Tagline and a Description. Describes the *kind* of smile, never how good it is or how to improve it.
_Avoid_: Score, rating, classification, grade, result, feedback, tips

**Archetype**:
One of eight named kinds of smile (e.g. The Mona Lisa, The Mischief), chosen deterministically from the Features.
_Avoid_: Category, class, label, type

**Tagline**:
The fixed one-line phrase that belongs to an Archetype.

**Description**:
Two or three warm, playful sentences about the person's smile, written by the LLM or, when that is unavailable or unsuitable, a Fallback Description.
_Avoid_: Summary, analysis

**Fallback Description**:
A hand-written Description for an Archetype, shown silently whenever the LLM's Description is missing or rejected.

### Measurement

**Blendshape**:
A raw 0–1 facial-expression coefficient produced on-device by the face model (e.g. `mouthSmileLeft`).

**Feature**:
A 0–1 value derived from Blendshapes that describes the expression: intensity, eye involvement, symmetry, openness. Features — never the photo — are what leave the device.
_Avoid_: Metric, score, measurement

### Sharing

**Pass it on**:
Sharing the app's link (never the photo or the Reading) so a friend gets a smile too.
_Avoid_: Share result

**Friend arrival**:
A visit that came from a Pass it on link; greeted with a banner on the landing page.
