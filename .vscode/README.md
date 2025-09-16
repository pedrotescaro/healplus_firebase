# Configuração do VS Code para Heal+

Este diretório contém configurações específicas do VS Code para o projeto Heal+.

## Arquivos de Configuração

### `settings.json`
- Configurações do workspace para ignorar avisos de CSS linter
- Configurações do Tailwind CSS para melhor IntelliSense
- Configurações de sugestões para strings

### `css_custom_data.json`
- Definições customizadas para diretivas CSS do Tailwind
- Reconhece `@tailwind`, `@apply`, `@layer`, `@config`
- Remove avisos de "Unknown at rule" no CSS

### `extensions.json`
- Extensões recomendadas para o projeto
- Inclui Tailwind CSS IntelliSense, Prettier, TypeScript, etc.

## Como Usar

1. Abra o projeto no VS Code
2. Aceite a instalação das extensões recomendadas quando solicitado
3. Os avisos de CSS sobre diretivas do Tailwind serão automaticamente ignorados
4. Você terá IntelliSense completo para classes do Tailwind CSS

## Solução de Problemas

Se ainda vir avisos sobre `@tailwind` ou `@apply`:

1. Certifique-se de que a extensão "Tailwind CSS IntelliSense" está instalada
2. Reinicie o VS Code
3. Verifique se o arquivo `css_custom_data.json` está sendo carregado nas configurações

## Configurações Adicionais

O projeto também inclui:
- `stylelint.config.js` - Configuração do Stylelint para Tailwind
- `postcss.config.mjs` - Configuração do PostCSS
- `tailwind.config.ts` - Configuração do Tailwind CSS
