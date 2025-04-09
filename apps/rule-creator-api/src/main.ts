import express from 'express';
import * as path from 'path';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import OpenAI from 'openai';
import { promisify } from 'util';

const app = express();
app.use(express.json());

// Middleware to parse JSON request bodies
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to rule-creator-api!' });
});

// Endpoint to prompt GPT
// @ts-ignore
app.post('/api/gpt', async (req, res) => {
  // const { message, apiKey } = req.body;
  // console.log('in be', apiKey);
  // const client = new OpenAI({
  //   apiKey
  // });
  //
  // const response = await client.responses.create({
  //   model: 'gpt-4o',
  //   store: true,
  //   instructions: 'You are a coding assistant specialized in ESLint',
  //   input: message,
  //   max_output_tokens: 1000,
  // });

  const response = "```json\n{\n  \"rule\": \"import { Rule } from 'eslint';\\n\\nexport function useJestImports(context: Rule.RuleContext): Rule.RuleListener {\\n  return {\\n    ImportDeclaration(node) {\\n      const sourceValue = node.source.value;\\n      if (\\n        sourceValue === '@ngneat/spectator' &&\\n        !sourceValue.includes('jest')\\n      ) {\\n        context.report({\\n          node,\\n          message: `By default, Spectator uses Jasmine for creating spies. Please use import path @ngneat/spectator/jest in order to let Spectator create Jest-compatible spies.`,\\n          fix: function (fixer) {\\n            return fixer.replaceText(node.source, \\\"'@ngneat/spectator/jest'\\\");\\n          },\\n        });\\n      }\\n    },\\n  };\\n}\",\n  \"ruleTest\": \"import { RuleTester } from 'eslint';\\nimport { useJestImports } from './path-to-your-rule-file'; // Adjust the import path\\n\\nconst ruleTester = new RuleTester({\\n  parserOptions: {\\n    ecmaVersion: 2020,\\n    sourceType: 'module',\\n  },\\n});\\n\\nruleTester.run('useJestImports', useJestImports, {\\n  valid: [\\n    {\\n      code: \\\"import { createComponent } from '@ngneat/spectator/jest';\\\", // Valid import using jest\\n    },\\n    {\\n      code: \\\"import { createComponent } from '@ngneat/spectator/xyz';\\\", // Non-violating but not jest-specific\\n    },\\n  ],\\n\\n  invalid: [\\n    {\\n      code: \\\"import { createComponent } from '@ngneat/spectator';\\\",\\n      errors: [\\n        {\\n          message:\\n            \\\"By default, Spectator uses Jasmine for creating spies. Please use import path @ngneat/spectator/jest in order to let Spectator create Jest-compatible spies.\\\",\\n          type: 'ImportDeclaration',\\n        },\\n      ],\\n      output: \\\"import { createComponent } from '@ngneat/spectator/jest';\\\", // Expect this change as a fix\\n    },\\n  ],\\n});\"\n}\n```";
  const cleanedResponse = response.replace(/```json|```/g, '').trim();

  try {
    const parsedData =  JSON.parse(cleanedResponse);
    return res.json({ success: true, message: parsedData });
  } catch (error) {
    console.error('Invalid JSON format:', error);
    return null;
  }
  // console.log(response.output_text)
});

const execPromise = promisify(exec);

// @ts-ignore
app.post('/api/run-test', async (req, res) => {
  const { codeToTest, testCode } = req.body;
  if (!codeToTest || !testCode) {
    return res.status(400).json({
      success: false,
      message: 'Both codeToTest and testCode must be provided.',
    });
  }

  const codeFilePath = path.join(__dirname, 'user-code.ts');
  const testFilePath = path.join(__dirname, 'user-test-code.spec.ts');

  try {
    fs.writeFileSync(codeFilePath, codeToTest);
    fs.writeFileSync(testFilePath, testCode);

    console.log(`User code written to: ${codeFilePath}`);
    console.log(`Test code written to: ${testFilePath}`);
    const result = await execPromise('npx jest --silent --coverage=false', {
      cwd: __dirname,
    });

    console.log('Jest result stdout:', result.stdout);
    console.log('Jest result stderr:', result.stderr);
    res.json({ success: true, result: result.stdout });
  } catch (error) {
    console.error('Error running Jest:', error);

    res.status(500).json({
      success: false,
      message: 'Error running tests',
    });
  } finally {
    try {
      fs.unlinkSync(codeFilePath);
      fs.unlinkSync(testFilePath);
    } catch (err) {
      console.error('Error cleaning up files:', err);
    }
  }
});

const port = process.env['PORT'] || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
