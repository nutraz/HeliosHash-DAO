// Minimal flat ESLint config for `apps/web`.
// Start minimal to avoid mixing legacy and flat formats while Next invokes ESLint.
const fs = require('fs');
const path = require('path');

const tryRequire = (name) => {
  try {
    return require(name);
  } catch (e) {
    return null;
  }
};

const tsParserName = '@typescript-eslint/parser';
const tsParser = (() => {
  try {
    // Prefer returning the package name so ESLint can resolve it normally.
    // require.resolve may return an absolute path which some runtimes don't accept
    // as a parser identifier in the flat config, so return the package name.
    require.resolve(tsParserName);
    return tsParserName;
  } catch (e) {
    try {
      // If resolve failed but the package is require()-able, still return the name.
      if (require(tsParserName)) return tsParserName;
    } catch (e2) {
      return undefined;
    }
    return undefined;
  }
})();

const tsPlugin = tryRequire('@typescript-eslint/eslint-plugin');
const reactPlugin = tryRequire('eslint-plugin-react');
const reactHooksPlugin = tryRequire('eslint-plugin-react-hooks');
const tailwindPlugin = tryRequire('eslint-plugin-tailwindcss');
const jsxA11yPlugin = tryRequire('eslint-plugin-jsx-a11y');
const importPlugin = tryRequire('eslint-plugin-import');
const nextConfig = tryRequire('eslint-config-next');
const nextPlugin = tryRequire('@next/eslint-plugin-next');

const mergeRules = (...sources) => Object.assign({}, ...sources.map(s => (s && s.rules) ? s.rules : {}));

const collected = {};
// Do not automatically import `@typescript-eslint`'s recommended rules here because
// installed plugin versions in different environments can reference rules that
// aren't available and cause "Definition for rule ... was not found" errors.
// The project enables/relaxes specific TS rules explicitly below instead.
if (reactPlugin && reactPlugin.configs && reactPlugin.configs.recommended) Object.assign(collected, reactPlugin.configs.recommended.rules || {});
if (reactHooksPlugin && reactHooksPlugin.configs && reactHooksPlugin.configs.recommended) Object.assign(collected, reactHooksPlugin.configs.recommended.rules || {});
if (tailwindPlugin && tailwindPlugin.configs && tailwindPlugin.configs.recommended) Object.assign(collected, tailwindPlugin.configs.recommended.rules || {});
if (jsxA11yPlugin && jsxA11yPlugin.configs && jsxA11yPlugin.configs.recommended) Object.assign(collected, jsxA11yPlugin.configs.recommended.rules || {});
if (importPlugin && importPlugin.configs && importPlugin.configs.recommended) Object.assign(collected, importPlugin.configs.recommended.rules || {});
if (nextConfig && nextConfig.rules) Object.assign(collected, nextConfig.rules || {});
if (nextPlugin && nextPlugin.configs && nextPlugin.configs.recommended) Object.assign(collected, nextPlugin.configs.recommended.rules || {});

// Remove rules that may be referenced by external configs but are not
// provided by the installed plugin versions in this environment. Keeping
// them in `collected` causes "Definition for rule ... was not found" errors.
delete collected['@typescript-eslint/no-empty-object-type'];

// Split handling: TypeScript files get the TS parser + `project`, JavaScript
// files are linted without `parserOptions.project` to avoid type-aware
// checks on files not included in the TS config (which caused parsing errors).
module.exports = [
  // TypeScript targets: enable parser + project (when tsconfig exists)
  {
    files: ['**/*.{ts,tsx}', '!src/app/hiidao-fusion/**', '!src/lib/**/*.d.ts', '!src/types/**'],
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'out/**',
      'build/**',
      'canisters/**',
      'generated/**',
      'packages/**/node_modules/**'
    ],
    languageOptions: {
      parser: tsParser || undefined,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: (() => {
          try {
            const p = path.resolve(__dirname, 'tsconfig.eslint.json');
            fs.accessSync(p);
            return p;
          } catch (e) {
            return undefined;
          }
        })(),
        tsconfigRootDir: __dirname
      },
      globals: { React: 'readonly' },
      settings: {
        react: { version: 'detect' },
        'import/resolver': {
          node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
        }
      }
    },
    plugins: Object.assign({},
      tsPlugin ? { '@typescript-eslint': tsPlugin } : {},
      reactPlugin ? { react: reactPlugin } : {},
      reactHooksPlugin ? { 'react-hooks': reactHooksPlugin } : {},
      tailwindPlugin ? { tailwindcss: tailwindPlugin } : {},
      nextPlugin ? { next: nextPlugin } : {},
      jsxA11yPlugin ? { 'jsx-a11y': jsxA11yPlugin } : {},
      importPlugin ? { import: importPlugin } : {}
    ),
    rules: Object.assign({}, collected, {
      // Relax noisy / blocking rules for this monorepo
      'no-console': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Disable rules that may be missing or conflict across versions/plugins
      '@typescript-eslint/no-empty-object-type': 'off',
      'react/no-unknown-property': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'import/no-unresolved': 'off',
      // Make unused-vars non-blocking and allow `_` prefix for ignored vars
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
      'report-unused-disable-directives': 'warn'
    })
  },

  // Files that are intentionally excluded from the TS project should still be
  // linted, but *without* `parserOptions.project` (type-aware checks). This
  // avoids the "that TSConfig does not include this file" parsing errors.
  {
    files: ['src/app/hiidao-fusion/**', 'src/lib/**/*.d.ts', 'src/types/**'],
    ignores: ['node_modules/**', '.next/**'],
    languageOptions: {
      parser: tsParser || undefined,
        parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        // Intentionally do not set `project` here
        tsconfigRootDir: __dirname
      },
      globals: { React: 'readonly' }
    },
    rules: Object.assign({}, collected, {
      'no-console': 'warn'
    })
  },

  // JavaScript targets: no `project` so we avoid type-aware errors for files
  // not present in the TypeScript project. Use the TS parser only if available
  // (it can still parse JS without a project), otherwise leave parser undefined
  // to let ESLint use its default parser.
  {
    files: ['**/*.{js,jsx}'],
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'out/**',
      'build/**',
      'canisters/**',
      'generated/**',
      'packages/**/node_modules/**'
    ],
    languageOptions: {
      parser: tsParser || undefined,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        tsconfigRootDir: __dirname
      },
      globals: { React: 'readonly' },
      settings: {
        react: { version: 'detect' },
        'import/resolver': {
          node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
        }
      }
    },
    plugins: Object.assign({},
      reactPlugin ? { react: reactPlugin } : {},
      reactHooksPlugin ? { 'react-hooks': reactHooksPlugin } : {},
      tailwindPlugin ? { tailwindcss: tailwindPlugin } : {},
      nextPlugin ? { next: nextPlugin } : {},
      jsxA11yPlugin ? { 'jsx-a11y': jsxA11yPlugin } : {},
      importPlugin ? { import: importPlugin } : {}
    ),
    rules: Object.assign({}, collected, {
      'no-console': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'import/no-unresolved': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
      'report-unused-disable-directives': 'warn'
    })
  }
];

// Additional simple overrides to fully silence linting for generated/legacy folders
// and to avoid type-aware checks on non-TS files in those trees.
module.exports.push({
  files: ['canisters/**', 'generated/**', 'scripts/**', 'legacy/**'],
  ignores: ['**/*'],
  rules: {
    // ensure nothing in these folders blocks builds
    'no-console': 'off'
  }
});
