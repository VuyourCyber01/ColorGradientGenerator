const rs = document.querySelector(":root");
const body = document.querySelector("body");
const container = document.querySelector(".container");
const btnsContainer = document.querySelector(".btns");
const cssres = document.querySelector('.css-res');
const generateBtn = document.querySelector('.generate');
const blendMode = document.querySelector('.blend-mode');
const noirBtn = document.querySelector('.noir-btn');

const baseCSS = `
:root {\n  --d1: 320.54deg;\n  --d2: 58.72deg;\n  --d3: 121.28deg;\n  --d4: 180deg;\n  --d5: 52.23deg;\n  --d6: 121.28deg;\n  --d7: 50% 72.12% at 50% 50%;\n  --d8: 72.37%;\n  --p1: 0%;\n  --p2: 100%;\n  --p3: .5%;\n  --blend-one: screen, color-dodge, color-burn, screen, overlay, difference, color-dodge;\n  --blend-two: screen, color-dodge, color-burn, screen, overlay, difference;\n  --no-blend: inherit;\n
`;
const gradientStr = `linear-gradient(var(--d1), var(--c1) var(--p1), var(--c11) var(--d8)),\n    linear-gradient(var(--d2), var(--c2) var(--p1), var(--c12) var(--p2)),\n    linear-gradient(var(--d3), var(--c3) var(--p1), var(--c13) var(--p2)),\n    linear-gradient(var(--d3), var(--c4) var(--p1), var(--c14) var(--p2)),\n    linear-gradient(var(--d4),var(--c5) var(--p1), var(--c15) var(--p3),var(--c17) var(--p2)),\n    linear-gradient(var(--d5), var(--c6) var(--p1), var(--c16) var(--p2)),\n    linear-gradient(var(--d6), var(--c7) var(--p1), var(--c10) var(--p2)),\n    radial-gradient(var(--d7), var(--c8) var(--p1), var(--c9) var(--p2));`;
const [heightStr, widthStr] = ['height:100vh;\n', 'width:100%;\n'];
const getBackdropFilterStr = () => `backdrop-filter: ${noirBtn.checked ? 'grayscale(100%) contrast(1.3)' : 'none'};\n`;
const getBackgroundBlendModeStr = () => `background-blend-mode: var(--${blendMode.value});\n`;

const generateRandomColor = (i) => {
  const color = '#' + Array.from({ length: 6 }).map(() => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]).join('');
  rs.style.setProperty(`--c${i}`, color);
  return color;
};

const generateCSS = () => {
  let css = baseCSS, resBG = '';
  for (let i = 1; i <= 20; i++) {
    css += `  --c${i}: ${generateRandomColor(i)};\n`;
    resBG += `var(--c${i}) var(--p1), `;
  }
  body.style.background = gradientStr;
  body.style.backgroundBlendMode = `var(--${blendMode.value})`;
  body.style.backdropFilter = noirBtn.checked ? 'grayscale(100%) contrast(1.3)' : 'none';
  cssres.innerText = css + '}' + '\n\n' + `body {\n  background:\n  ${gradientStr}\n  ${getBackgroundBlendModeStr()}  ${heightStr}  ${widthStr}  ${getBackdropFilterStr()}}`;
  css = '';
};

const handleCopy = (e) => {
  if (e.target.innerText === "Copied!") return;
  const text = cssres.innerText;
  if (text) {
    navigator.clipboard.writeText(text);
    e.target.innerText = "Copied!";
    setTimeout(() => e.target.innerText = "Copy CSS", 1000);
  }
};

const getTextColor = (colorString) => {
  const convertHexToRGB = hex => {
    const hexValue = hex.replace('#', '');
    const r = parseInt(hexValue.substring(0, 2), 16);
    const g = parseInt(hexValue.substring(2, 4), 16);
    const b = parseInt(hexValue.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };
  colorString = convertHexToRGB(colorString);

  let match = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) { return 'white'; }
  const [nr, ng, nb] = [match[1], match[2], match[3]].map(n => parseInt(n, 10));
  return (nr * 299 + ng * 587 + nb * 114) / 1000 > 128 ? 'black' : 'white';
};

const handleNoir = () => {
  const bfRes = noirBtn.checked ? 'grayscale(100%) contrast(1.3)' : 'none';
  body.style.backdropFilter = bfRes;
  const regex = /backdrop-filter: (.*?);/g;
  cssres.innerHTML = cssres.innerHTML.replace(regex, `backdrop-filter: ${bfRes};`);
};

const handleBlendMode = (e) => {
  const newBlendMode = `var(--${e.target.value})`;
  body.style.backgroundBlendMode = newBlendMode;
  const regex = /background-blend-mode: (.*?);/g;
  cssres.innerHTML = cssres.innerHTML.replace(regex, `background-blend-mode: ${newBlendMode};`);
};

const handleBtns = (e) => {
  const generate = e.target.closest('.generate');
  const show = e.target.closest('.show');
  const copy = e.target.closest('.copy');
  const noir = e.target.closest('.noir-btn');
  if (generate) {
    generateCSS();
    const c3 = window.getComputedStyle(rs).getPropertyValue('--c3');
    generateBtn.style.color = getTextColor(c3);
  }
  if (show) {
    container.classList.toggle('hide-container');
    show.innerText = show.innerText === 'Show CSS' ? 'Hide CSS' : 'Show CSS';
  }
  if (copy) { handleCopy(e); }
  if (noir) { handleNoir(); }
};

document.querySelector('.noir-btn').checked = false;
btnsContainer.addEventListener('click', handleBtns);
blendMode.addEventListener('change', handleBlendMode);
const setExampleOutput = () => {
  let exampleCSS = baseCSS;
  exampleCSS += `\n  --c1: #AF1015;\n  --c2: #E03CDE;\n  --c3: #8149D3;\n  --c4: #2A257C;\n  --c5: #E7F02D;\n  --c6: #D65462;\n  --c7: #2FF264;\n  --c8: #4E6FB5;\n  --c9: #B8771A;\n  --c10: #F9DD63;\n  --c11: #8294A6;\n  --c12: #DB9175;\n  --c13: #972465;\n  --c14: #E8C7ED;\n  --c15: #5E08A7;\n  --c16: #F35EEE;\n  --c17: #8CB64E;\n  --c18: #2D7D19;\n  --c19: #9BF7FF;\n  --c20: #6637D4;\n}`;
  exampleCSS += `\nbody{\n  background:\n  ${gradientStr}\n  ${getBackgroundBlendModeStr()}  ${heightStr}  ${widthStr}  ${getBackdropFilterStr()}}`;
  cssres.innerText = exampleCSS;
};
setExampleOutput();