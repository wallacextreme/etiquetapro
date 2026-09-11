# Changelog — EtiquetaPro

Todas as modificações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [1.0.1] - 2026-09-11

### Adicionado
- **Progressive Web App (PWA)**:
  - Criação do `manifest.json` com especificações completas para Android (modo standalone, tema, cores de fundo e escopo relativo).
  - Criação do `sw.js` com pré-cache de recursos vitais e estratégia de cache Stale-While-Revalidate para funcionamento 100% offline.
  - Criação de página de fallback offline dedicada (`offline.html`).
  - Criação de ícones oficiais em alta resolução (`icon-192.png`, `icon-512.png`, `icon-maskable-512.png` e `favicon.ico`).
  - Suporte à instalação nativa com captura de `beforeinstallprompt` e botão estilizado `📲 Instalar App`.
- **Experiência Mobile**:
  - Sistema de abas no celular (`⚙️ Configurações` e `👁️ Ver Folha`) para viewports $\le$ 900px.
  - Mecanismo inteligente de **Fit-to-Screen** com cálculo automático de escala visual proporcional para folhas A4 e Carta em telas pequenas sem alterar os milímetros físicos de impressão.
  - Controles de zoom visual na prévia com alternador entre `📐 Ajustar à Tela` e `100% Real`.
  - Áreas de toque otimizadas ($\ge 44$px) e suporte a Safe Areas (`env(safe-area-inset-*)`).
  - Cabeçalho responsivo com grid adaptativo para telas inferiores a 600px.
- **CI/CD e GitHub Pages**:
  - Adicionado workflow oficial do GitHub Actions (`.github/workflows/pages.yml`) para publicação automática.
  - Adicionado arquivo `.nojekyll` para compatibilidade com o deploy estático do GitHub Pages.
  - Normalização de todos os caminhos para links relativos (`./`).
- **Documentação de Engenharia**:
  - `docs/ARCHITECTURE.md`: Arquitetura, fluxo de dados e catálogo de gabaritos.
  - `docs/PWA.md`: Especificação PWA, Service Worker e ciclo de vida.
  - `docs/MOBILE.md`: Responsividade, abas e algoritmo de fit-to-screen.
  - `docs/PRINTING.md`: Precisão milimétrica, regras `@page` dinâmicas e isolamento de impressão.
  - `docs/TESTING.md`: Matriz de testes funcionais, viewports e critérios de aceitação.

### Preservado
- 100% dos cálculos matemáticos milimétricos de colunas, linhas, margens e gaps.
- 100% do catálogo oficial de gabaritos Pimaco (11 modelos A4 e 10 modelos Carta).
- 100% da precisão de impressão via `window.print()` e injeção dinâmica de `@page`.
- Sistema de upload de logo via FileReader e posicionamento em grid 3×3.
- Sistema de exportação e importação de parâmetros via JSON.
- Compatibilidade e visual original em telas desktop.
