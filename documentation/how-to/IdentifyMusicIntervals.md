# Identify Music Intervals test

## Description

The developer would specify intervals to test on (e.g., unison, major third, perfect fifth, octave), then build the corresponding layout (4 buttons with those labels), and the test would construct two-note, sequential intervals using piano notes and the listener would press the corresponding button.

## Likely changes to TestCore
 
Currently TestCore is set up to have a default index which is the difference in pitch that the test starts with. Based on correct or incorrect answer, this index changes. This is likely unnecessary for a test for identifying music intervals. They can be made optional.

The TestCore can be made more generic by making handleAnswer and handleEndTest parameters to MusicTestConfig. This would allow each test to handle them independently leading to easy extension for the new test.

## Other set up

A new `questionGenerator` and `evaluator` would be needed for this new test. The `player` can be the same as the one used for the Pitch Resolution Test 

Create a new file like [PitchResolutionTest.tsx](frontend/src/pages/PitchResolutionTest.tsx) to set up the test. 

## Results

Results are displayed in two ways. One is specific to the most recent run of the test and displayed after completion. Refer to [PitchResolutionTestResults.tsx](frontend/src/pages/PitchResolutionTestResults.tsx). The second holds results from every run of the test. Refer to [PitchResolutionResults.tsx](frontend/src/pages/PitchResolutionResults.tsx).