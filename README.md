# 📐 EtiquetaPro — Gerador Múltiplo de Etiquetas Customizadas

[![PWA Ready](https://img.shields.io/badge/PWA-Ready-1a56db?style=for-the-badge&logo=pwa&logoColor=white)](./manifest.json)
[![Offline First](https://img.shields.io/badge/Offline-First-057a55?style=for-the-badge&logo=google-chrome&logoColor=white)](./sw.js)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-22272e?style=for-the-badge&logo=github&logoColor=white)](https://pages.github.com/)
[![License](https://img.shields.io/badge/License-MIT-d97706?style=for-the-badge)](./LICENSE)

> Aplicação web progressiva (PWA) de alto desempenho para criação, personalização e impressão de folhas de etiquetas autoadesivas com precisão milimétrica, compatível com os gabaritos oficiais Pimaco (A4 e Carta), instalável em dispositivos Android e desktop, com funcionamento 100% offline.

---

## 📱 Demonstração e Instalação

- **Aplicação Online (GitHub Pages)**: `https://[SEU-USUARIO].github.io/[NOME-DO-REPOSITORIO]/`
- **PWA Android**: Acesse pelo Google Chrome no celular e toque no botão **"📲 Instalar App"** no cabeçalho (ou no menu *Adicionar à tela inicial*).
- **Desktop**: Totalmente funcional no navegador ou como aplicativo de janela independente (PWA Standalone).

---

## ✨ Principais Recursos

- **📏 Precisão Milimétrica Real**: Cálculo matemático exato de larguras, alturas, margens de topo/laterais e espaçamentos (gaps X e Y), utilizando unidades físicas `mm`.
- **🏷️ Catálogo Oficial Pimaco Embutido**:
  - **11 Modelos A4**: A4056, A4054, A4060, A4062, A4063, A4051, A4261, A4264, A4265, A4268 e A4067.
  - **10 Modelos Carta**: 6080, 6081, 6082, 6083, 6084, 6087, 6089, 6095, 8096 e 8098.
  - Suporte completo a **Medidas Personalizadas (Custom)**.
- **⚡ Offline-First Real**: Service Worker configurado com estratégia *Stale-While-Revalidate* e pré-cache de 10 assets essenciais. Abra e use sem conexão com a internet.
- **📲 Experiência Mobile Adaptada (Android/iOS)**:
  - Navegação fluida por abas: **⚙️ Configurações** e **👁️ Ver Folha**.
  - **Fit-to-Screen Inteligente**: Dimensionamento proporcional da folha A4 para caber na tela do celular sem nunca alterar as medidas físicas de impressão.
  - Áreas de toque confortáveis ($\ge 44$px) e suporte a Safe Areas para celulares com entalhe/notch.
- **🎨 Customização Visual Completa**:
  - Tipografia flexível (fontes de sistema e web, alinhamento, negrito, itálico, sublinhado e sombra).
  - Paleta de cores para texto, fundo e bordas, além de temas rápidos pré-configurados.
  - Upload de logotipos ou imagens locais via `FileReader` com posicionamento em grid 3×3.
- **📄 Paginação Automática**: Distribuição contínua de múltiplos itens e quantidades em quantas folhas forem necessárias, com quebra de página precisa (`break-after: page`).
- **💾 Portabilidade de Dados**: Exportação e importação instantânea de configurações completas em formato JSON.

---

## 🛠️ Stack Tecnológica

Este projeto foi construído sem dependências externas desnecessárias, priorizando longevidade de código, velocidade de inicialização e independência arquitetural:

- **Linguagem**: JavaScript Vanilla (ES6+)
- **Estruturação**: HTML5 Semântico (`viewport-fit=cover`, SVG, Paged Media)
- **Estilização**: CSS3 Puro (CSS Grid, Flexbox, Variáveis CSS, Media Queries, `@page`, `@media print`)
- **PWA**: Web App Manifest (`manifest.json`), Service Worker API (`sw.js`), Cache API
- **Ícones**: Ícones em alta definição gerados nativamente com suporte a *Maskable Icon* para Android
- **CI/CD**: GitHub Actions (`.github/workflows/pages.yml`)
- **Hospedagem**: GitHub Pages com HTTPS automático

---

## 🏛️ Arquitetura do Software

A aplicação adota uma arquitetura limpa com separação rigorosa de responsabilidades:

```text
┌──────────────────────────────────────────────────────────────┐
│                       index.html                             │
├───────────────────────────────┬──────────────────────────────┤
│       Painel de Controles     │        Área de Prévia        │
│    - Gabaritos Pimaco         │    - Injeção dinâmica @page  │
│    - Fila de Itens            │    - Grid CSS em mm          │
│    - Tipografia & Cores       │    - Fit-to-Screen Mobile    │
│    - Upload de Logo           │    - Paginação contínua      │
├───────────────────────────────┴──────────────────────────────┤
│                 Camada PWA & Service Worker                  │
│    - manifest.json (Standalone Android)                      │
│    - sw.js (Cache Stale-While-Revalidate)                    │
│    - offline.html (Fallback gracioso)                        │
└──────────────────────────────────────────────────────────────┘
```

Para aprofundar nos detalhes de implementação, consulte a documentação técnica:
- 📖 [Arquitetura Geral](docs/ARCHITECTURE.md)
- 📲 [Especificação PWA e Service Worker](docs/PWA.md)
- 📱 [Engenharia de Responsividade Mobile](docs/MOBILE.md)
- 🖨️ [Motor de Impressão Milimétrica](docs/PRINTING.md)
- 🧪 [Plano e Relatório de Testes](docs/TESTING.md)

---

## 🖨️ Engenharia de Impressão Física

Ao contrário de geradores convencionais que trabalham em pixels imprecisos, o EtiquetaPro utiliza unidades milimétricas reais:
1. Uma regra `@page { size: ${folhaW}mm ${folhaH}mm; margin: 0; }` é injetada dinamicamente via JavaScript conforme o modelo escolhido.
2. Cada página `.pagina-a4` utiliza CSS Grid com colunas e linhas baseadas nas dimensões físicas das etiquetas e de seus afastamentos (gaps).
3. Todas as transformações visuais aplicadas no celular (como zoom ou escala proporcional) são anuladas na regra `@media print`, garantindo que a impressão física saia 100% alinhada com as folhas de etiquetas autoadesivas da impressora.

---

## 🚀 Como Publicar no GitHub Pages

1. Inicialize o repositório Git e envie para o GitHub:
   ```bash
   git add .
   git commit -m "feat: release EtiquetaPro PWA v1.0.1"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   git push -u origin main
   ```
2. No repositório no GitHub, acesse **Settings > Pages**.
3. Em **Build and deployment > Source**, selecione **GitHub Actions**.
4. O deploy será executado automaticamente pelo workflow `.github/workflows/pages.yml`.
5. Em menos de 2 minutos, o aplicativo estará disponível publicamente em HTTPS com suporte imediato a instalação PWA no celular Android!

---

## 👨‍💻 Autor

Desenvolvido por **Wallace Soares**.

Projeto concebido como demonstração prática de competências em:
- Arquitetura Front-End Vanilla de alta performance;
- Implementação de Progressive Web Apps (PWA) e Service Workers robustos;
- Resolução de problemas complexos de impressão física e CSS milimétrico;
- Design responsivo adaptativo com escala visual isolada;
- Automação de CI/CD para deploy contínuo em nuvem.
