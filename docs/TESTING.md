# Plano e Relatório de Testes de Qualidade — EtiquetaPro

Este documento registra a estratégia de validação, os testes funcionais executados, os critérios de aprovação e os resultados obtidos no **EtiquetaPro**.

---

## 1. Critérios de Aprovação do Quality Gate

| Item | Critério de Aceitação | Status |
| :--- | :--- | :---: |
| **Aplicação Desktop** | Layout em 2 colunas preservado, sem regressões funcionais | ✅ Aprovado |
| **Experiência Mobile** | Abas táteis funcionando, layout adaptado em coluna única | ✅ Aprovado |
| **Fit-to-Screen** | Folha A4 escalada visualmente sem quebra de tela no celular | ✅ Aprovado |
| **Web App Manifest** | `manifest.json` com campos válidos, standalone e ícones | ✅ Aprovado |
| **Ícones de Aplicação** | 192px, 512px, maskable 512px e favicon gerados em alta fidelidade | ✅ Aprovado |
| **Service Worker** | Registro ativo, pré-cache de 10 assets, ativação imediata | ✅ Aprovado |
| **Modo Offline** | Aplicação inicializa e opera completamente sem conexão | ✅ Aprovado |
| **Instalação PWA** | Captura de `beforeinstallprompt`, botão "📲 Instalar App" | ✅ Aprovado |
| **Impressão A4 / Carta**| Regra `@page` dinâmica, precisão milimétrica, isolamento print | ✅ Aprovado |
| **Gabaritos Pimaco** | 11 modelos A4 e 10 modelos Carta calculados com exatidão | ✅ Aprovado |
| **Fila de Itens** | Inserção de texto, múltiplas quantidades, remoção e re-render | ✅ Aprovado |
| **Upload de Logo** | Leitura local via FileReader, posicionamento em grid 3×3 | ✅ Aprovado |
| **Exportação / Importação** | Serialização e desserialização de JSON sem perda | ✅ Aprovado |
| **GitHub Pages** | Caminhos relativos (`./`), `.nojekyll`, workflow CI/CD criado | ✅ Aprovado |

---

## 2. Testes em Resoluções Mobile (Viewports)

| Dispositivo / Resolução | Largura × Altura | Comportamento Observado | Resultado |
| :--- | :---: | :--- | :---: |
| **Padrão Android Moderno** | 390 × 844 px | Abas táteis de 48px ativas, painel 100% largura, folha A4 com auto-scale proporcional (escala ~0.46) perfeitamente legível sem overflow horizontal. | ✅ Passou |
| **Android Compacto** | 360 × 800 px | Cabeçalho recolhe botões em grid 2×2, sem corte de texto. Folha A4 perfeitamente centralizada. | ✅ Passou |
| **Android Telas Grandes** | 412 × 915 px | Navegação fluida entre abas, touch targets $\ge$ 44px, preenchimento de inputs sem zoom automático. | ✅ Passou |
| **Desktop Full HD** | 1920 × 1080 px | Barra lateral sticky de 380px à esquerda, área de prévia centralizada à direita, abas mobile ocultas. | ✅ Passou |

---

## 3. Teste de Ciclo de Vida do Service Worker e Cache

1. **Instalação**: O evento `install` interceptou e realizou pré-cache com sucesso de:
   - `./`
   - `./index.html`
   - `./Etiquetas A4.html`
   - `./manifest.json`
   - `./offline.html`
   - `./favicon.ico`
   - `./icons/icon-192.png`
   - `./icons/icon-512.png`
   - `./icons/icon-maskable-512.png`
   - `./icons/favicon.png`
2. **Ativação**: O evento `activate` assumiu o controle imediato através de `self.clients.claim()`.
3. **Interceptação Fetch**: Requisições de navegação e assets servidas instantaneamente do cache local via estratégia Stale-While-Revalidate.
4. **Log do Console Registrado**:
   ```text
   [PWA] Service Worker registrado com sucesso no escopo: http://localhost:8080/
   ```

---

## 4. Teste de Regressão das Funcionalidades Originais

- **Cálculo Pimaco**: Selecionado modelo Pimaco A4056 (63,5 × 25,4 mm, 33/folha). O sistema calculou automaticamente 3 colunas e 11 linhas com gapX de 2,6 mm e margem superior de 8,8 mm.
- **Inserção e Remoção**: Adicionado item `"ITEM TESTE NOVO"` com quantidade 12. O contador global passou de 24 para 36 etiquetas, e a quantidade de folhas aumentou proporcionalmente. Ao remover o item da fila, o estado foi restaurado instantaneamente.
- **Tipografia e Estilos**: Alterações de fontes (Arial, Segoe UI, Impact), tamanhos, negrito, itálico, sombra e cores foram refletidas em tempo real em todas as etiquetas renderizadas.
- **Impressão**: O comando `window.print()` renderizou exclusivamente as folhas físicas com dimensões milimétricas, ocultando 100% da interface do usuário (header, abas, controles e barra de zoom).
