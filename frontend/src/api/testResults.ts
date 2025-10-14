interface TestResultPayload {
  userId: number;
  testType: string;
  subuser?: string;
  gap: number;
  wrongAnswers: number[];
}

export const saveTestResult = async (testData: TestResultPayload) => {
  try {
    const response = await fetch(`http://localhost:8080/api/tests/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error saving test result:', error);
    throw error;
  }
};

export const getTestHistory = async (userId: number) => {
  try {
    const response = await fetch(`http://localhost:8080/api/tests/user/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const tests = await response.json();
    return tests;
  } catch (error) {
    console.error('Error fetching test history:', error);
    throw error;
  }
};