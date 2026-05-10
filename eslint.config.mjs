import eslintConfigPrettier from 'eslint-config-prettier/flat';
import prettierPlugin from 'eslint-plugin-prettier';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';

export default [
  ...pluginVue.configs['flat/essential'],
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: ['.nuxt/', '.output/', '.storybook/', '*.mjs', 'vitest.config.ts'],
  },
  {
    files: ['**/*.{ts,vue}'],
    plugins: { prettier: prettierPlugin },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        projectService: true,
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      'vue/attributes-order': [
        'error',
        {
          // Правило упорядочивания атрибутов компонентов
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            ['UNIQUE', 'SLOT'],
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT',
          ],
          alphabetical: false,
        },
      ],
      'vue/max-attributes-per-line': [
        'error',
        {
          //  Проверка на максимальное количество атрибутов в строке:
          singleline: {
            max: 1,
          },
          multiline: {
            max: 1,
          },
        },
      ],
      'vue/html-self-closing': 'off',
      'vue/html-indent': [
        // Проверка последовательного отступа в шаблоне <template>:
        'warn',
        2,
        {
          attribute: 1, // множитель отступа для атрибутов. Значение по умолчанию 1.
          baseIndent: 1, //  множитель отступа для операторов верхнего уровня. Значение по умолчанию 1.
          closeBracket: 1, //  множитель отступа для правых скобок. Значение по умолчанию 0.
          alignAttributesVertically: true, // условие того, должны ли атрибуты выравниваться по вертикали с первым атрибутом в многострочном случае или нет
          ignores: [], // селектор для игнорирования узлов.
        },
      ],
      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never', // Для однострочных тегов: <div class="...">
          multiline: 'never', // Для многострочных тегов: <div \n class="...">
        },
      ],
      'vue/no-async-in-computed-properties': 'error',
      'vue/no-child-content': 'error',
      'vue/no-dupe-keys': 'error',
      'vue/no-duplicate-attributes': 'error',

      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      'no-console': ['warn', { allow: ['error'] }],
      'no-debugger': 'warn', // без debugger
      'vue/multi-word-component-names': 'off',
      'vue/html-indent': 'off',
      // 'object-curly-spacing': ['error', 'always'], // пробелы внутри { }
    },
  },
  {
    files: ['pages/**/*.vue', 'layouts/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
];
