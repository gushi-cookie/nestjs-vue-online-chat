import js from '@eslint/js';
import ts from 'typescript-eslint';

export default ts.config(
  {
    ignores: ['dist/**']
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    }
  }
);