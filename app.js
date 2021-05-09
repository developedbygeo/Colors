//  Selectors & Vars

const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector("button.generate");
const sliders = document.querySelectorAll("input[type='range']");
const currentHexes = document.querySelectorAll(".color h2");
let initialColors;

// Functions

// Color Generation
function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}
// Assinging the random colors to divs and changing innerText
function randomColors() {
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();
    // Adding color to the background
    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;
    // check for contrast;
    checkTxtContrast(randomColor, hexText);
    // Slider Color Config
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    colorSliders(color, hue, brightness, saturation);
  });
}
function checkTxtContrast(color, text) {
  const lumin = chroma(color).luminance();
  if (lumin > 0.5) {
    text.style.color = "#22292d";
  } else {
    text.style.color = "#f5ebe1";
  }
}
function colorSliders(color, hue, brightness, saturation) {
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);

  // Input colors
  saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(
    0
  )}, ${scaleSat(1)})`;
}

randomColors();
