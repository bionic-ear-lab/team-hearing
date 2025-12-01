# Word Recognition Test

## Description

This document describes how a developer/a team of developers might construct word identification tests using the existing [TestCore](/frontend/src/pages/TestCore.tsx) structure and a material database of spoken word audio files. For this test type, an audio recording of a word is played, and the user should select the corresponding button. The test should keep track of the percent of correctly identified words as the test proceeds.

## Create a new test page

Create a new file for the word recognition test similar to the one for the [pitch resolution test](/frontend/src/pages/PitchResolutionTest.tsx). This page should import and wrap the [TestCore](/frontend/src/pages/TestCore.tsx) component.

The `baseNotes`, `defaultIndex`, `correctShift`, and `incorrectShift` elements are unnecessary for a word recognition test, so they can be set to placeholders like an empty array and 0s, respectively. Similarly, `getSemitoneGap` and `indexUpdater` are not needed, so they can => 0. The `numberOfAttempts` element may need to change depending on whether the developer wants the word recognition test to end after a set number of questions regardless of the number of incorrect answers.

The `buttonOptions` can be set statically or dynamically to an array of the word options for each question, and the page will automatically adapt to display word buttons.

The developer would need a new `questionGenerator`, `evaluator`, and `player`.

### Implementing questionGenerator

A `createWordQuestion` should generate word questions. It should randomly select a word from the database, fetch or compute the corresponding audio file path, and decide what the buttons should be (the correct answer and the distractor answers). It should then return an object for TestCore, which anticipates a certain structure, that includes the audio path file and the index for the correct button.

### Implementing evaluator

An `evaluateWordAnswer` should evaluate the correctness of an answer depending on the button selected by the user. It should also recalculate the percentage of correctly selected words based on whether or not this answer was correct.

### Implementing player

A `playWords` function is needed to play word files instead of `playNotes`, which plays note files. This will play only one word file given an identifier for the word file obtained from the `questionGenerator`. Alternatively, the developer can modify `playNotes` to be more general and handle arbitrary audio files.

## Results

The results from each word recognition test can be saved in the database using the [testResults api](/frontend/src/api/testResults.ts). The developer may also want to reference the [database setup](/database/) or the [database documentation](/documentation/database.md) to fully understand how test results are stored.

Likely, a unique results display will need to be written according to the desires of the developer. One is displayed immediately after test completion (see [PitchResolutionTestResults.tsx](/frontend/src/pages/PitchResolutionTestResults.tsx) for an example, where these immediate results are displayed as a graph specific to the pitch resolution test). The other results display is for every run of the test a user has completed (see [PitchResolutionResults.tsx](/frontend/src/pages/PitchResolutionResults.tsx) for an example). The developer would likely end up creating `WordRecognitionTestResults.tsx` and `WordRecognitionResults.tsx` pages accordingly.