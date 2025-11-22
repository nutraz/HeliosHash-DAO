// Minimal legacy ESLint config to satisfy Next's plugin detection and parsing.
// The canonical (flat) config remains in `eslint.config.cjs` for rule definitions,
// but Next's programmatic lint step expects plugin detection from legacy config.
module.exports = {
	root: true,
	parser: require.resolve('@typescript-eslint/parser'),
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
		ecmaFeatures: { jsx: true },
		tsconfigRootDir: __dirname
	},
	plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y', 'tailwindcss', 'import', '@next/next'],
	extends: [],
	rules: {
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'off',
		'no-console': 'warn',
        // Disable rules that can be version-sensitive or block builds
        '@typescript-eslint/no-empty-object-type': 'off',
        'react/no-unknown-property': 'off',
        'react/no-unescaped-entities': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-inferrable-types': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'import/no-unresolved': 'off',
		'@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }]
	}
};

// Only enable `parserOptions.project` (type-aware rules) for TypeScript files.
// This avoids ESLint trying to type-check JS files or other files not included
// in the project's tsconfig, which previously caused parsing errors.
module.exports.overrides = [
	{
		files: ['**/*.ts', '**/*.tsx'],
		parserOptions: {
			project: (() => {
				try {
					const p = require('path').resolve(__dirname, 'tsconfig.eslint.json');
					require('fs').accessSync(p);
					return p;
				} catch (e) {
					return undefined;
				}
			})()
		}
	}
,
    {
        files: ['src/app/hiidao-fusion/**', 'src/lib/**/*.d.ts', 'src/types/**'],
        // Don't enable type-aware rules for these files since the project's
        // tsconfig explicitly excludes them.
        parserOptions: {}
    }
];
