const https = require('https');
const { judge0ApiUrl, judge0ApiKey } = require('../config/env');
const Job = require('../models/Job');
const { generateTestCases, reviewCodeWithAI } = require('./aiReviewService');

const compileCode = async (code, language, jobId) => {
  try {
    const languageIds = { python: 71, javascript: 63, java: 62 };
    const encodeBase64 = (str) => Buffer.from(str).toString('base64');

    console.log('compileCode called with:', { code, language, jobId });

    let cleanedCode = code;
    if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'java') {
      cleanedCode = code
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .trim();
    } else if (language.toLowerCase() === 'python') {
      cleanedCode = code
        .replace(/#.*$/gm, '')
        .trim();
    }

    if (!cleanedCode) {
      console.log('No code to compile after cleaning comments');
      return { success: false, output: '', error: 'No code to compile after cleaning comments' };
    }

    console.log('Cleaned code:', cleanedCode);

    console.log('Fetching job with ID:', jobId);
    const job = await Job.findById(jobId);
    if (!job || !job.codingQuestion) {
      console.log('Job or coding question not found for jobId:', jobId);
      return { success: false, output: '', error: 'Invalid job or no coding question' };
    }

    console.log('Job fetched:', job);

    const problemTitle = job.codingQuestion.title;
    const { input, output } = job.codingQuestion.example;
    console.log('Generating test cases for problem:', problemTitle);
    const testCases = await generateTestCases(job.codingQuestion);
    testCases.unshift({ input, output });
    console.log('Test Cases:', JSON.stringify(testCases, null, 2));

    const wrapCode = (tc, lang, problem) => {
      console.log('Wrapping code for test case:', tc);
      if (problem === 'Two Sum') {
        const numsMatch = tc.input.match(/nums = \[([^\]]+)\]/);
        const targetMatch = tc.input.match(/target = (\d+)/);
        const nums = numsMatch ? numsMatch[1] : '';
        const target = targetMatch ? targetMatch[1] : '';

        if (lang.toLowerCase() === 'javascript') {
          return `
            ${cleanedCode}
            const nums = [${nums}];
            const target = ${target};
            const result = twoSum(nums, target);
            process.stdout.write('[' + result.join(', ') + ']');
          `;
        } else if (lang.toLowerCase() === 'python') {
          return `
import json
${cleanedCode}
nums = [${nums}]
target = ${target}
result = twoSum(nums, target)
print(f'[{result[0]}, {result[1]}]', end='')
          `;
        } else if (lang.toLowerCase() === 'java') {
          return `
${cleanedCode}
public class Main {
    public static void main(String[] args) {
        int[] nums = new int[] {${nums}};
        int target = ${target};
        int[] result = new Solution().twoSum(nums, target);
        if (result.length == 0) {
            System.out.print("[]");
        } else {
            System.out.print("[" + result[0] + ", " + result[1] + "]");
        }
    }
}
          `;
        }
      } else if (problem === 'Reverse a String') {
        const str = tc.input;
        if (lang.toLowerCase() === 'javascript') {
          return `
            ${cleanedCode}
            const str = "${str}";
            const result = reverse(str);
            process.stdout.write(result);
          `;
        } else if (lang.toLowerCase() === 'python') {
          return `
${cleanedCode}
str = "${str}"
result = reverse(str)
print(result, end='')
          `;
        } else if (lang.toLowerCase() === 'java') {
          return `
${cleanedCode}
public class Main {
    public static void main(String[] args) {
        String str = "${str}";
        String result = new Solution().reverse(str);
        System.out.print(result);
    }
}
          `;
        }
      } else if (problem === 'Design a Rate-Limiting Mechanism') {
        const timestampsMatch = tc.input.match(/timestamps = \[([^\]]+)\]/);
        const ipMatch = tc.input.match(/ip = '([^']+)'/);
        const timestamps = timestampsMatch ? timestampsMatch[1].split(',').map(t => parseInt(t.trim())) : [];
        const ip = ipMatch ? ipMatch[1] : '192.168.1.1';

        if (lang.toLowerCase() === 'javascript') {
          return `
            ${cleanedCode}
            const timestamps = [${timestamps.join(',')}];
            const ip = "${ip}";
            const results = [];
            for (let time of timestamps) {
              const response = rateLimit(ip, time);
              results.push(response.status);
            }
            process.stdout.write(results.join(','));
          `;
        } else if (lang.toLowerCase() === 'python') {
          return `
${cleanedCode}
timestamps = [${timestamps.join(',')}]
ip = "${ip}"
results = []
for time in timestamps:
    response = rate_limit(ip, time)
    results.append(response['status'])
print(','.join(map(str, results)), end='')
          `;
        } else if (lang.toLowerCase() === 'java') {
          return `
${cleanedCode}
public class Main {
    public static void main(String[] args) {
        int[] timestamps = new int[] {${timestamps.join(',')}};
        String ip = "${ip}";
        RateLimiter rateLimiter = new RateLimiter();
        java.util.List<Integer> results = new java.util.ArrayList<>();
        for (int time : timestamps) {
            Response response = rateLimiter.rateLimit(ip, time);
            results.add(response.status);
        }
        System.out.print(String.join(",", results.stream().map(String::valueOf).collect(java.util.stream.Collectors.toList())));
    }
}
          `;
        }
      }
      throw new Error(`Unsupported problem type: ${problem} or language: ${lang}`);
    };

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const results = [];
    for (const tc of testCases) {
      const wrappedCode = wrapCode(tc, language, problemTitle);
      console.log('Wrapped Code for', tc.input, ':\n', wrappedCode);
      console.log('Running code for test case:', tc.input);
      const result = await runCode(wrappedCode, languageIds[language.toLowerCase()], tc.input, tc.output);
      console.log('Test case result:', result);
      const testCaseResult = { ...result, input: tc.input, expectedOutput: tc.output };
      console.log('Test case result with input/output:', testCaseResult);
      results.push(testCaseResult);
      await delay(1000);
    }
    console.log('Final test case results:', JSON.stringify(results, null, 2));
    const allPassed = results.every(r => r.success);

    let aiFeedback = null;
    if (problemTitle === 'Design a Rate-Limiting Mechanism') {
      console.log('Generating AI feedback for rate-limiting problem');
      aiFeedback = await reviewCodeWithAI(cleanedCode, language);
      console.log('AI Feedback:', aiFeedback);
    }

    return {
      success: allPassed,
      output: results.map(r => r.output).join('\n'),
      error: allPassed ? null : results.find(r => !r.success)?.error,
      testCaseResults: results,
      aiFeedback,
    };
  } catch (error) {
    console.error('Error in compileCode:', error.message, error.stack);
    throw new Error(`Failed to compile code: ${error.message}`);
  }
};



const runCode = (code, languageId, input, expectedOutput) => {
  return new Promise((resolve) => {
    const postOptions = {
      method: 'POST',
      hostname: 'judge0-ce.p.rapidapi.com',
      path: '/submissions?base64_encoded=true&wait=false&fields=*',
      headers: {
        'x-rapidapi-key': judge0ApiKey,
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
    };

    const postReq = https.request(postOptions, (postRes) => {
      let postData = '';
      postRes.on('data', (chunk) => (postData += chunk));
      postRes.on('end', () => {
        console.log('POST Response:', postData);
        let token;
        try {
          const postResult = JSON.parse(postData);
          if (postResult.message === 'Too many requests') {
            return resolve({ success: false, output: '', error: 'Rate limit exceeded' });
          }
          token = postResult.token;
        } catch (e) {
          console.error('POST Parse Error:', e.message, 'Raw Data:', postData);
          return resolve({ success: false, output: '', error: 'Failed to parse POST response' });
        }
        if (!token) return resolve({ success: false, output: '', error: 'No token received' });

        let attempts = 0;
        const pollResult = () => {
          const getReq = https.request({
            method: 'GET',
            hostname: 'judge0-ce.p.rapidapi.com',
            path: `/submissions/${token}?base64_encoded=true&fields=*`,
            headers: {
              'x-rapidapi-key': judge0ApiKey,
              'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            },
          }, (getRes) => {
            let getData = '';
            getRes.on('data', (chunk) => (getData += chunk));
            getRes.on('end', () => {
              console.log('GET Response:', getData);
              let result;
              try {
                result = JSON.parse(getData);
              } catch (e) {
                console.error('GET Parse Error:', e.message, 'Raw Data:', getData);
                return resolve({ success: false, output: '', error: 'Failed to parse GET response' });
              }
              const statusId = result.status.id;

              if (statusId <= 2 && attempts < 10) {
                attempts++;
                setTimeout(pollResult, 1000);
              } else {
                const rawOutput = result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '';
                const output = rawOutput.trim(); // Trim to remove any trailing newlines or whitespace
                const trimmedExpectedOutput = expectedOutput.trim(); // Trim expected output as well
                console.log('Raw Judge0 Output:', JSON.stringify(rawOutput), 'Length:', rawOutput.length);
                console.log('Trimmed Judge0 Output:', JSON.stringify(output), 'Length:', output.length);
                console.log('Expected Output:', JSON.stringify(trimmedExpectedOutput), 'Length:', trimmedExpectedOutput.length);
                const error = result.stderr ? Buffer.from(result.stderr, 'base64').toString() : 
                              result.compile_output ? Buffer.from(result.compile_output, 'base64').toString() : 
                              result.message || result.status.description;
                const outputsMatch = output === trimmedExpectedOutput;
                console.log('Outputs Match:', outputsMatch, 'Status ID:', statusId);
                resolve({
                  success: outputsMatch, // Trust the output comparison over Judge0's status
                  output,
                  error: outputsMatch ? null : error,
                });
              }
            });
          });
          getReq.on('error', (err) => {
            console.error('GET Request Error:', err.message);
            resolve({ success: false, output: '', error: err.message });
          });
          getReq.end();
        };
        pollResult();
      });
    });

    postReq.on('error', (err) => {
      console.error('POST Request Error:', err.message);
      resolve({ success: false, output: '', error: err.message });
    });
    postReq.write(JSON.stringify({
      language_id: languageId,
      source_code: Buffer.from(code).toString('base64'),
      stdin: Buffer.from(input).toString('base64'),
      expected_output: Buffer.from(expectedOutput).toString('base64'),
    }));
    postReq.end();
  });
};

module.exports = { compileCode };