const { GoogleGenerativeAI } = require('@google/generative-ai');
const { geminiApiKey } = require('../config/env');

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const generateCodingQuestion = async (description) => {
  const prompt = `
    Based on this job description: "${description}"
    Generate a coding question relevant to the role. Include:
    - Title
    - Description
    - Difficulty (Easy, Medium, Hard)
    - Example with input and output as STRINGS (e.g., "nums = [1, 2, 3], target = 5" and "[1, 2]")
    Return the response as a JSON object wrapped in \`\`\`json\`\`\` markers, with no additional text outside the markers.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch || !jsonMatch[1]) {
      throw new Error('No valid JSON found in response');
    }

    const jsonString = jsonMatch[1].trim();
    let question = JSON.parse(jsonString);

    if (Array.isArray(question.example.input)) {
      question.example.input = JSON.stringify(question.example.input);
    }
    if (Array.isArray(question.example.output)) {
      question.example.output = JSON.stringify(question.example.output);
    }

    return question;
  } catch (error) {
    console.error('Error parsing AI response:', error.message, 'Raw response:', text);
    return {
      title: "Fallback Question",
      description: "Write a function to process job data.",
      difficulty: "Easy",
      example: { input: "data = [1, 2, 3]", output: "6" },
    };
  }
};

const reviewCodeWithAI = async (code, language) => {
  const prompt = `
    You are an expert code reviewer. Review this ${language} code:
    \`\`\`${language}
    ${code}
    \`\`\`
    Provide detailed feedback including:
    1. Correctness: Does it solve the problem?
    2. Time and space complexity analysis.
    3. Readability: Is it clear and well-structured?
    4. Edge cases: What might it miss?
    5. Suggestions: How can it be improved?
    6. Alternative solution: Provide a better approach **only if a more efficient solution exists** (e.g., better time complexity). If provided, the alternative solution must be in ${language} and include its time and space complexity.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return 'AI review unavailable due to an error.';
  }
};

const generateTestCases = async (codingQuestion) => {
  const problemTitle = codingQuestion.title;
  let prompt;

  if (problemTitle === 'Two Sum') {
    prompt = `
      Generate 3 valid test cases for this coding question: "${codingQuestion.description}"
      Each test case must:
      - Have an input in the format "nums = [array], target = number"
      - Have an output in the format "[x, y]" with a space after the comma (e.g., "[0, 1]")
      - Ensure the array contains integers and two of them sum exactly to the target
      Return the response as a JSON array wrapped in \`\`\`json\`\`\` markers.
    `;
  } else if (problemTitle === 'Reverse a String') {
    prompt = `
      Generate 3 valid test cases for this coding question: "${codingQuestion.description}"
      Each test case must:
      - Have an input as a string (e.g., "hello")
      - Have an output as the reversed string (e.g., "olleh")
      Return the response as a JSON array wrapped in \`\`\`json\`\`\` markers.
    `;
  } else if (problemTitle === 'Design a Rate-Limiting Mechanism') {
    prompt = `
      Generate 3 valid test cases for this coding question: "${codingQuestion.description}"
      Each test case must:
      - Have an input in the format "timestamps = [array], ip = 'IP_ADDRESS'" where timestamps are integers representing seconds
      - Have an output in the format "status = NUMBER" where NUMBER is the HTTP status code (200 for allowed, 429 for rate-limited)
      - Assume a rate limit of 10 requests per minute (60 seconds) per IP address
      Return the response as a JSON array wrapped in \`\`\`json\`\`\` markers.
    `;
  } else {
    throw new Error(`Unsupported problem type: ${problemTitle}`);
  }

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch || !jsonMatch[1]) {
      throw new Error('No valid JSON found in response');
    }

    const jsonString = jsonMatch[1].trim();
    let testCases = JSON.parse(jsonString);

    if (problemTitle === 'Two Sum') {
      testCases = testCases.map(tc => {
        const numsMatch = tc.input.match(/nums = \[([^\]]+)\]/);
        const targetMatch = tc.input.match(/target = (\d+)/);
        const nums = numsMatch ? numsMatch[1].split(',').map(n => parseInt(n.trim())) : [];
        const target = targetMatch ? parseInt(targetMatch[1]) : 0;
        const [x, y] = JSON.parse(tc.output.replace(/\s/g, ''));
        if (nums[x] + nums[y] !== target) {
          return { input: "nums = [3, 7, 1], target = 10", output: "[0, 1]" };
        }
        return { ...tc, output: `[${x}, ${y}]` };
      });
    } else if (problemTitle === 'Reverse a String') {
      testCases = testCases.map(tc => {
        const reversed = tc.input.split('').reverse().join('');
        return { input: tc.input, output: reversed };
      });
    } else if (problemTitle === 'Design a Rate-Limiting Mechanism') {
      testCases = testCases.map(tc => {
        const timestampsMatch = tc.input.match(/timestamps = \[([^\]]+)\]/);
        const timestamps = timestampsMatch ? timestampsMatch[1].split(',').map(t => parseInt(t.trim())) : [];
        const statusMatch = tc.output.match(/status = (\d+)/);
        const expectedStatus = statusMatch ? parseInt(statusMatch[1]) : 200;

        // Validate rate limiting: 10 requests per 60 seconds
        const requestCount = new Map();
        let calculatedStatus = 200;
        for (const time of timestamps) {
          const windowStart = Math.floor(time / 60) * 60;
          const count = requestCount.get(windowStart) || 0;
          if (count >= 10) {
            calculatedStatus = 429;
            break;
          }
          requestCount.set(windowStart, count + 1);
        }
        return { ...tc, output: `status = ${calculatedStatus}` };
      });
    }

    return testCases;
  } catch (error) {
    console.error('Error generating test cases:', error.message);
    if (problemTitle === 'Two Sum') {
      return [
        { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]" },
        { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]" },
        { input: "nums = [3, 7, 1], target = 10", output: "[0, 1]" },
      ];
    } else if (problemTitle === 'Reverse a String') {
      return [
        { input: "hello", output: "olleh" },
        { input: "world", output: "dlrow" },
        { input: "", output: "" },
      ];
    } else if (problemTitle === 'Design a Rate-Limiting Mechanism') {
      return [
        { input: "timestamps = [1, 11, 21, 31, 41, 51, 61], ip = '192.168.1.1'", output: "status = 429" },
        { input: "timestamps = [2, 12, 22, 32, 42], ip = '10.0.0.2'", output: "status = 200" },
        { input: "timestamps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], ip = '192.168.1.2'", output: "status = 429" },
      ];
    }
    return [];
  }
};

module.exports = { reviewCodeWithAI, generateCodingQuestion, generateTestCases };