# TestCore.tsx

[frontend/src/pages/TestCore.tsx](../frontend/src/pages/TestCore.tsx)

## TestCore Component

`TestCore` implements the `Props` interface.  
This design allows the same component with general properties to be reused for different ear-training or pitch tests while keeping the core logic centralized. 

### Purpose

The component handles the full lifecycle of a musical test.  
This is: initializing questions, playing sounds, tracking answers, updating difficulty, and saving results. Test behavior (e.g., how questions are generated, evaluated, or played) is defined externally through configuration functions passed via `MusicTestConfig`.  
Note: A question in this context is the notes played and the buttons that correlate with each note.

### Use
To create each test, create a react component that imports TestCore and supply it with a full MusicTestConfig and Props configuration.  
Use [PitchResolutionTest.tsx](frontend/src/pages/PitchResolutionTest.tsx) as a reference.

### Flow

* Popup appears to start the test calling `handleStart`
* Question is set
* Notes play
* User can press Repeat button calling `handleRepeat` which plays the notes again
* User chooses an answer option
* `handleAnswer` checks for correctness, updates results for that question, marks correctness, updates attempts left, ensures there are available attempts, generates next question if applicable
* If answer is wrong, the hearts showing available attempts reduce
* Setting a new question causes new notes to play
* Test ends and `handleEndTest` is called when all available attempts are done
* Test results are saved to database and displayed as a graph

## MusicTestConfig Interface

Defines all configuration properties required to run a test using `TestCore`. Each field controls how questions are generated, evaluated, or presented to the user.  

## Props Interface

Extends `MusicTestConfig` by adding React-specific UI behavior.

## How to implement future tests

`TestCore` is designed to be generic and easy to extend for future tests. However, it has not been tested beyond the PitchResolutionTest. We have added a `how-to` directory in `/documentation` with our thoughts on how to expand it for certain tests.