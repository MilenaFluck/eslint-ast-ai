import { exec } from 'child_process';
import express from 'express';
import * as fs from 'fs';
import OpenAI from 'openai';
import * as os from 'os';
import * as path from 'path';
import { promisify } from 'util';

const app = express();
app.use(express.json());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to rule-creator-api!' });
});

// Endpoint to prompt GPT
app.post('/api/gpt', async (req, res) => {
  const { message, apiKey } = req.body;
  const client = new OpenAI({
    apiKey
  });

  const response = await client.responses.create({
    model: 'gpt-4o',
    store: true,
    instructions: 'You are a coding assistant specialized in ESLint',
    input: message,
    max_output_tokens: 1000,
  });

  // const cleanedResponse = "```json\n{\n  \"ruleEsModules\": \"import { Rule } from 'eslint';\\n\\nexport function useJestImports(context: Rule.RuleContext): Rule.RuleListener {\\n  return {\\n    ImportDeclaration(node) {\\n      const sourceValue = node.source.value;\\n      if (\\n        sourceValue === '@ngneat/spectator' &&\\n        !sourceValue.includes('jest')\\n      ) {\\n        context.report({\\n          node,\\n          message: `By default, Spectator uses Jasmine for creating spies. Please use import path @ngneat/spectator/jest in order to let Spectator create Jest-compatible spies.`,\\n          fix: function (fixer) {\\n            return fixer.replaceText(node.source, \\\"'@ngneat/spectator/jest'\\\");\\n          },\\n        });\\n      }\\n    },\\n  };\\n}\",\n  \"badExampleCode\": \"import { createComponent } from '@ngneat/spectator';\"```";

  const cleanedResponse = response.output_text.replace(/```json|```/g, '').trim();

  try {
    const parsedData =  JSON.parse(cleanedResponse);
    return res.json({ success: true, message: parsedData });
  } catch (error) {
    console.error('Invalid JSON format:', error);
    return null;
  }
});

const execAsync = promisify(exec);
app.post('/api/lint', async (req, res) => {
  const { rule, badExampleCode } = req.body;

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lint-'));
  const rulePath = path.join(tempDir, 'custom-rule.js');
  const codePath = path.join(tempDir, 'code.js');
  const pluginDir = path.join(tempDir, 'eslint-plugin-custom');
  const pluginIndex = path.join(pluginDir, 'index.js');
  const eslintConfigPath = path.join(tempDir, '.eslintrc.cjs');

  try {
    fs.writeFileSync(rulePath, rule);
    fs.writeFileSync(codePath, badExampleCode);
    fs.mkdirSync(pluginDir);

    fs.writeFileSync(pluginIndex, `
      module.exports.rules = {
        'user-rule': require('../custom-rule')
      };
    `);

    fs.writeFileSync(eslintConfigPath, `
        module.exports = [
          {
            files: ['**/*.js', '**/*.html'],
            languageOptions: {
              ecmaVersion: 2020,
              sourceType: 'module',
            },
            plugins: {
              custom: require('./eslint-plugin-custom'),
            },
            rules: {
              'no-console': 'off',
              'no-unused-vars': 'off',
              'no-undef': 'off',
              'custom/user-rule': 'error',
            },
          }
        ];
    `);

    const eslintCmd = `npx eslint "${codePath}" -c "${eslintConfigPath}" -f json`;
    console.log(`Running ESLint with: ${eslintCmd}`);

    let stdout;

    try {
      const result = await execAsync(eslintCmd, {
        cwd: tempDir,
        env: {
          ...process.env,
          NODE_PATH: tempDir,
        },
      });
      stdout = result.stdout;
    } catch (error: any) {
      if (error.stdout) {
        stdout = error.stdout;
      } else {
        console.error('Error running ESLint:', error);
        return res.status(500).json({ error: 'Could not run ESLint.' });
      }
    }

    try {
      const lintResult = JSON.parse(stdout);
      return res.json(lintResult[0].messages);
    } catch (parseErr) {
      console.error('Failed to parse ESLint output:', parseErr);
      return res.status(500).json({ error: 'Failed to parse ESLint output.' });
    }

  } catch (err: any) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Unexpected server error.', details: err.message });
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});


const port = process.env['PORT'] || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
