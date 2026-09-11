# Especificação do Progressive Web App (PWA) — EtiquetaPro

Este documento detalha o funcionamento offline, Service Worker, Web App Manifest, instalação no Android e compatibilidade com GitHub Pages do **EtiquetaPro**.

---

## 1. Web App Manifest (`manifest.json`)

O `manifest.json` fornece os metadados necessários para que os navegadores (especialmente o Google Chrome no Android) reconheçam a aplicação como instalável e configurem a inicialização standalone.

### Declarações Principais:
- **`start_url`**: `"./index.html"` — Caminho relativo para compatibilidade total com repositórios de projeto no GitHub Pages (`https://usuario.github.io/repositorio/`).
- **`scope`**: `"./"` — Garante que todo o diretório da aplicação permaneça sob o escopo do PWA.
- **`display`**: `"standalone"` — Oculta barras de navegação do browser, proporcionando experiência idêntica a aplicativo nativo.
- **`theme_color`**: `"#1a56db"` — Define a cor da barra de status do Android e cabeçalho do sistema.
- **`background_color`**: `"#f8f9fb"` — Cor de fundo suave durante o splash screen de inicialização.
- **`icons`**:
  - `icon-192.png`: Ícone 192×192 para gaveta de aplicativos e telas padrão.
  - `icon-512.png`: Ícone 512×512 para splash screen e telas de alta densidade.
  - `icon-maskable-512.png`: Ícone adaptativo com zona de segurança (safe zone) de 80%, impedindo cortes indesejados ou círculos com bordas brancas no launcher do Android.

---

## 2. Service Worker (`sw.js`)

O Service Worker implementa o ciclo de vida padrão da especificação W3C com ativação imediata e controle robusto de cache.

### Ciclo de Vida:
1. **`install`**:
   - Abre o cache versionado `etiquetapro-v1.0.1`.
   - Realiza o pré-cache dos recursos essenciais (`index.html`, `Etiquetas A4.html`, `manifest.json`, `offline.html`, `favicon.ico` e todos os ícones).
   - Executa `self.skipWaiting()` para que a nova versão assuma o controle sem esperar que abas antigas sejam fechadas.
2. **`activate`**:
   - Itera sobre todas as chaves de cache existentes.
   - Deleta qualquer cache que pertença a versões anteriores.
   - Executa `self.clients.claim()` para assumir o controle imediato de todas as abas abertas.
3. **`fetch`**:
   - Para requisições de navegação (`request.mode === 'navigate'`), emprega estratégia com verificação de cache e fallback para `./index.html` ou `./offline.html`.
   - Para requisições de assets, emprega **Stale-While-Revalidate**: responde instantaneamente a partir do cache local e atualiza em segundo plano quando houver conexão com a internet.

---

## 3. Experiência de Instalação no Android (`beforeinstallprompt`)

Em navegadores Android que suportam PWA:
1. O evento `beforeinstallprompt` é interceptado e prevenido com `e.preventDefault()`.
2. A referência do evento é armazenada na variável `deferredInstallPrompt`.
3. O botão **"📲 Instalar App"** torna-se visível no cabeçalho com destaque visual.
4. Ao clicar no botão, o método `deferredInstallPrompt.prompt()` é chamado, abrindo a folha nativa do sistema para confirmação de instalação pelo usuário.
5. Ao confirmar ou cancelar, o botão é ocultado e a variável é resetada.
6. O evento `appinstalled` é escutado para exibir uma mensagem toast de confirmação.

---

## 4. Garantia de Funcionamento 100% Offline

### Dependências Auditadas e Isolamento:
- **Fontes**: Embora importe Google Fonts online para enriquecimento estético, a pilha de fontes CSS declara alternativas locais robustas do sistema (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif` e `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace`).
- **Zero CDNs**: Não existem chamadas a jQuery, Bootstrap, FontAwesome ou bibliotecas externas que possam quebrar quando sem conexão.
- **Upload Local de Imagens**: O upload de logo usa a API nativa `FileReader`, convertendo a imagem em Data URL (`data:image/...;base64,...`) mantida na memória da sessão, sem qualquer requisição a servidores de terceiros.

---

## 5. Publicação no GitHub Pages

O GitHub Pages requer atenção a caminhos e escopo:
1. Todos os links no HTML (`manifest`, ícones, scripts) utilizam **caminhos relativos** (`./...`), evitando problemas ao rodar em subpastas (`https://usuario.github.io/nome-do-repositorio/`).
2. O arquivo `.nojekyll` presente na raiz desativa o processamento do gerador Jekyll do GitHub, garantindo que arquivos com sublinhado ou pastas estáticas sejam servidos sem alterações.
3. O workflow do GitHub Actions em `.github/workflows/pages.yml` publica os arquivos estáticos diretamente no ambiente do GitHub Pages com HTTPS automático.
