# Experiência Mobile e Responsividade — EtiquetaPro

Este documento detalha o sistema de navegação por abas, dimensionamento proporcional Fit-to-Screen, áreas de toque e compatibilidade com smartphones Android.

---

## 1. Desafio de Telas Pequenas no Gerador de Etiquetas

O layout original do EtiquetaPro para desktop utiliza duas colunas simultâneas:
- **Painel lateral esquerdo**: Largura fixa de 380px com dezenas de controles.
- **Área de prévia direita**: Folha A4 real com 210mm de largura (~794px a 96 DPI).

Em telas de celulares (larguras típicas de 360px a 430px), renderizar ambas as colunas causaria quebra completa da interface ou rolagem horizontal desconfortável.

---

## 2. Sistema de Abas Mobile (< 900px)

Para telas com largura inferior ou igual a 900px, o layout passa automaticamente para o modo de coluna única orientada por abas:

```text
┌──────────────────────────────────────┐
│  📐 EtiquetaPro     [🖨️ Imprimir]   │  <- Header compacto
├──────────────────┬───────────────────┤
│ ⚙️ Configurações  │ 👁️ Ver Folha (24) │  <- Abas táteis (48px)
├──────────────────┴───────────────────┤
│                                      │
│  [Conteúdo da Aba Ativa]             │
│                                      │
└──────────────────────────────────────┘
```

### Comportamento das Abas:
1. **Aba "⚙️ Configurações"**:
   - Exibe o formulário completo de parâmetros (gabarito, folha, colunas, gaps, inserção de itens, tipografia, cores, bordas e logo).
   - Ocupa 100% da largura da tela, com rolagem vertical natural.
2. **Aba "👁️ Ver Folha"**:
   - Oculta o formulário de controles e exibe a folha de etiquetas gerada.
   - Contém o contador de etiquetas atualizado em tempo real na aba.
   - Inclui barra de ferramentas rápida com botões de zoom ("📐 Ajustar à Tela" e "100% Real") e atalho direto para "🖨️ Imprimir".

---

## 3. Mecanismo de Fit-to-Screen (Ajuste Visual à Tela)

### A Regra de Ouro:
$$\text{Escala Visual no Celular} \neq \text{Dimensões Físicas de Impressão}$$

Em nenhum momento as variáveis milimétricas (`210mm`, `297mm`, `63.5mm`, etc.) são alteradas para "caber" no celular. Alterar os milímetros destruiria a precisão física ao imprimir.

Em vez disso, é aplicada uma transformação CSS estritamente visual:

```javascript
const escala = viewportLarguraPx / folhaLarguraPx;
wrapper.style.transform = `scale(${escala})`;
wrapper.style.transformOrigin = 'top center';

// Compensação de margem para evitar espaço em branco gigante pós-scale
const margemCompensacao = -((1 - escala) * wrapper.offsetHeight);
wrapper.style.marginBottom = `${margemCompensacao}px`;
```

### Isolamento Total na Impressão:
No momento da impressão (`@media print` ou chamada a `window.print()`), todas as transformações visuais são anuladas:
```css
@media print {
  #wrapper-etiquetas {
    transform: none !important;
    margin: 0 !important;
  }
}
```

---

## 4. Otimizações de Touch UX (Android)

1. **Áreas de Toque ($\ge 44\text{px}$)**:
   - Botões, campos de seleção e abas possuem altura mínima de 44px a 48px, facilitando o toque sem erros.
   - A matriz de 9 posições da logo (`.pos-btn`) foi expandida para 44×44px no mobile.
2. **Prevenção de Auto-Zoom no Android/iOS**:
   - Todos os inputs de texto e número usam tamanho de fonte base de 16px no mobile, evitando que o navegador dê zoom indesejado no foco do campo.
3. **Safe Areas**:
   - Utilização de `viewport-fit=cover` e variáveis CSS com `env(safe-area-inset-top)` e `env(safe-area-inset-bottom)` para suporte nativo a entalhes (notches) e barras de navegação por gestos do Android.
