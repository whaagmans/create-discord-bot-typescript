import eslint from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{ ignores: ['dist'] },
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	prettierRecommended,
	{
		languageOptions: {
			globals: globals.node,
		},
	},
);
