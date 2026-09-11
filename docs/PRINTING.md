# Motor de Impressão Milimétrica — EtiquetaPro

Este documento detalha o sistema de impressão física, controle milimétrico, injeção dinâmica de CSS `@page`, compatibilidade A4/Carta e gabaritos Pimaco do **EtiquetaPro**.

---

## 1. Precisão Física e Unidades Milimétricas

O EtiquetaPro trabalha diretamente com a unidade `mm` (milímetros) suportada pela especificação CSS Paged Media.

Em folhas de etiquetas autoadesivas, desvios de frações de milímetro acumulam-se entre linhas e colunas, fazendo com que o texto seja impresso fora da etiqueta após a 3ª ou 4ª linha. Por essa razão, a geometria da página e de cada etiqueta é calculada rigorosamente.

### Variáveis CSS Injetadas por Folha:
```css
.pagina-a4 {
  width: var(--folha-w, 210mm);
  height: var(--folha-h, 297mm);
  display: grid;
  grid-template-columns: repeat(var(--cols, 3), var(--w, 63.5mm));
  grid-auto-rows: var(--h, 25.4mm);
  column-gap: var(--gap-x, 2.6mm);
  row-gap: var(--gap-y, 0mm);
  padding-top: var(--mt, 8.8mm);
  padding-bottom: var(--mt, 8.8mm);
  padding-left: var(--ml, 7.2mm);
  padding-right: var(--ml, 7.2mm);
  align-content: start;
  justify-content: start;
  overflow: hidden;
  page-break-after: always;
  break-after: page;
}
```

---

## 2. Injeção Dinâmica de `@page`

Para garantir que a impressora receba a ordem exata do tamanho de papel escolhido (seja A4 ou Carta), a função `gerar()` injeta dinamicamente uma tag `<style id="dynamic-page-css">`:

```javascript
stylePage.innerHTML = `@media print { @page { size: ${folhaW}mm ${folhaH}mm; margin: 0; } }`;
```

A propriedade `margin: 0` na regra `@page` elimina as margens automáticas impostas por drivers de navegadores, permitindo que as margens milimétricas reais do gabarito (`mt`, `ml`) posicionem perfeitamente o grid sobre as etiquetas físicas.

---

## 3. Isolamento da Impressão (`@media print`)

Durante a impressão física ou exportação para PDF pelo navegador (`window.print()`):
1. **Ocultação de Elementos de Interface**: Cabeçalho, botões de ação, painel de controles, abas mobile, barra de estatísticas, toasts e modais recebem `display: none !important;`.
2. **Eliminação de Decorações**: Sombras de caixa (`box-shadow`), cores de fundo do body e linhas guia de corte (`.etiqueta-num`) são ocultadas para que apenas a arte da etiqueta seja impressa.
3. **Desativação de Transformações Mobile**: Qualquer `scale()` aplicado para visualização em celular é redefinido para `transform: none !important;` e margens para zero.

---

## 4. Tabela de Gabaritos Pimaco Homologados

### Modelos A4 (210 × 297 mm)
| Código Pimaco | Dimensão da Etiqueta | Colunas | Linhas | Total/Folha | Margem Topo | Margem Lat. | Gap X | Gap Y |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **A4056 / A4256 / A4356** | 63,5 × 25,4 mm | 3 | 11 | 33 | 8,8 mm | 7,2 mm | 2,6 mm | 0,0 mm |
| **A4054 / A4254 / A4354** | 99,0 × 25,4 mm | 2 | 11 | 22 | 8,8 mm | 4,7 mm | 2,6 mm | 0,0 mm |
| **A4060 / A4260 / A4360** | 63,5 × 38,1 mm | 3 | 7 | 21 | 15,2 mm | 7,2 mm | 2,6 mm | 0,0 mm |
| **A4062 / A4262 / A4362** | 99,0 × 33,9 mm | 2 | 8 | 16 | 12,9 mm | 4,7 mm | 2,6 mm | 0,0 mm |
| **A4063 / A4263 / A4363** | 99,0 × 38,1 mm | 2 | 7 | 14 | 15,2 mm | 4,7 mm | 2,6 mm | 0,0 mm |
| **A4051 / A4251 / A4351** | 38,2 × 21,2 mm | 5 | 13 | 65 | 10,7 mm | 4,5 mm | 2,5 mm | 0,0 mm |
| **A4261 / A4361** | 63,5 × 46,5 mm | 3 | 6 | 18 | 9,1 mm | 7,2 mm | 2,6 mm | 0,0 mm |
| **A4264 / A4364** | 63,5 × 71,9 mm | 3 | 4 | 12 | 4,7 mm | 7,2 mm | 2,6 mm | 0,0 mm |
| **A4265 / A4365** | 99,0 × 67,8 mm | 2 | 4 | 8 | 13,0 mm | 4,7 mm | 2,6 mm | 0,0 mm |
| **A4268 / A4368** | 199,9 × 143,4 mm | 1 | 2 | 2 | 5,1 mm | 5,1 mm | 0,0 mm | 0,0 mm |
| **A4067 / A4267 / A4367** | 200,0 × 288,5 mm | 1 | 1 | 1 | 4,3 mm | 5,0 mm | 0,0 mm | 0,0 mm |

### Modelos Carta (215,9 × 279,4 mm)
| Código Pimaco | Dimensão da Etiqueta | Colunas | Linhas | Total/Folha | Margem Topo | Margem Lat. | Gap X | Gap Y |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **6080 / 6180 / 6280** | 66,7 × 25,4 mm | 3 | 10 | 30 | 12,7 mm | 4,8 mm | 3,1 mm | 0,0 mm |
| **6081 / 6181 / 6281** | 101,6 × 25,4 mm | 2 | 10 | 20 | 12,7 mm | 4,0 mm | 5,2 mm | 0,0 mm |
| **6082 / 6182 / 6282** | 101,6 × 33,9 mm | 2 | 7 | 14 | 21,2 mm | 4,0 mm | 5,2 mm | 0,0 mm |
| **6083 / 6183 / 6283** | 101,6 × 50,8 mm | 2 | 5 | 10 | 12,7 mm | 4,0 mm | 5,2 mm | 0,0 mm |
| **6084 / 6184 / 6284** | 101,6 × 84,7 mm | 2 | 3 | 6 | 12,7 mm | 4,0 mm | 5,2 mm | 0,0 mm |
| **6087 / 6187 / 6287** | 44,4 × 12,7 mm | 4 | 20 | 80 | 12,7 mm | 14,5 mm | 3,1 mm | 0,0 mm |
| **6089** | 44,4 × 16,9 mm | 4 | 15 | 60 | 12,7 mm | 14,5 mm | 3,1 mm | 0,0 mm |
| **6095** | 85,7 × 59,3 mm | 2 | 4 | 8 | 21,2 mm | 17,0 mm | 10,6 mm | 0,0 mm |
| **8096** | 69,8 × 69,8 mm | 3 | 3 | 9 | 12,7 mm | 3,2 mm | 0,0 mm | 6,4 mm |
| **8098** | 88,9 × 42,3 mm | 2 | 6 | 12 | 12,7 mm | 12,7 mm | 12,7 mm | 0,0 mm |
