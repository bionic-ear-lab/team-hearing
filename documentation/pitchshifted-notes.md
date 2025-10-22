# Microtonal Pitch Shift Index Mapping

This document explains how the **file index number** maps to **pitch shift values in semitones** for microtonal spacing.

---

## 1. Formula Overview

Each index `b` (ranging from **1** to **37**) corresponds to a pitch shift magnitude defined as:

```
S(b) = 2^(-8 + (b - 1) / 3)
```

where **S(b)** is the **magnitude** of the shift in **semitones**.

* The spacing is **geometric**, not linear.
* Every increase of **+1** in index multiplies the magnitude by **2^(1/3)**.
* Every increase of **+3** doubles the semitone magnitude.

---

## 2. Key Index Landmarks

| Index (b) | Semitone Shift (S(b)) | Description            |
| --------- | --------------------- | ---------------------- |
| 1         | ~1/256                | Tiny downshift         |
| 16        | ~1/8                  | Small shift            |
| 19        | ~1/4                  | Quarter-semitone shift |
| 22        | ~1/2                  | Half-semitone shift    |
| 25        | ~1                    | One semitone           |
| 28        | ~2                    | Two semitones          |
| 34        | ~8                    | Eight semitones        |
| 37        | ~16                   | Largest shift          |

---

## 3. Filename Convention

All files begin with the prefix `piano_`.

```
piano_<index>.wav      → positive (upward) shift of +S(b) semitones
piano_<index>_n.wav    → negative (downward) shift of −S(b) semitones
piano_0.wav            → no shift (original)
```
`<index>` is the integer `b` in 1–37.

---

## 4. Mapping for Positive, Negative, and Zero Shifts

| Shift Type              | Equation          | Example Filename               |
| ----------------------- | ----------------- | ------------------------------ |
| **Negative (Downward)** | `−S(b)` semitones | `piano_25_n.wav` = −1 semitone |
| **Positive (Upward)**   | `+S(b)` semitones | `piano_25.wav` = +1 semitone   |
| **Zero (Original)**     | `0` semitones     | `piano_0.wav` = no shift       |

---

## 5. Inverse Mapping (Given a Semitone Value → Find Index)

To find the index **b** corresponding to a desired semitone shift **g**:

```
b(g) = 1 + 3 * (log2(g) + 8)
```

Round **b(g)** to the nearest integer between 1 and 37.

Examples:

* g = 1  → b ≈ 25  → 1 semitone
* g = 2  → b ≈ 28  → 2 semitones
* g = 8  → b ≈ 34  → 8 semitones
* g = 16 → b ≈ 37  → 16 semitones

---

## 6. Summary of Relationships

* **Forward:** `S(b) = 2^(-8 + (b - 1)/3)`
* **Inverse:** `b(g) = 1 + 3 * (log2(g) + 8)`
* **+1 index** → multiply semitone value by `2^(1/3)`
* **+3 index** → doubles the semitone value
* Range covers ≈ **1/256 semitone** to **16 semitones**.

---
