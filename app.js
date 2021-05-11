//  Selectors & Vars

const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector("button.generate");
const sliders = document.querySelectorAll("input[type='range']");
const currentHexes = document.querySelectorAll(".color h2");
const pop = document.querySelector(".copy-container");
const adjustBtn = document.querySelectorAll(".adjust");
const closeAdjustBtn = document.querySelectorAll(".close-adjustment");
const lockBtn = document.querySelectorAll(".lock");
const sliderContainers = document.querySelectorAll(".sliders");
let initialColors;

// Event Listeners
generateBtn.addEventListener("click", randomColors);

sliders.forEach((slider) => {
  slider.addEventListener("input", hslCtrl);
});

colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUI(index);
  });
});

currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyToClip(hex);
  });
});
adjustBtn.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    openAdjustPanel(index);
  });
});

closeAdjustBtn.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    closeAdjustPanel(index);
  });
});

lockBtn.forEach((button, index) => {
  button.addEventListener("click", () => {
    lockColor(index);
  });
});

// Alternative approach for pop-up to close on window click

// window.addEventListener("click", (e) => {
//   e.target === pop ? pop.classList.remove("active") : false;
// });

// Removing the popup once the appearing transition has ended

pop.addEventListener("transitionend", () => {
  const popBox = pop.children[0];
  pop.classList.remove("active");
  popBox.classList.remove("active");
});

// Functions

// Color Generation
function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}
// Assinging the random colors to divs and changing innerText
function randomColors() {
  initialColors = [];
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();
    // Adding randomColors to the array
    if (div.classList.contains("lock")) {
      initialColors.push(hexText.innerText);
      return;
    } else {
      initialColors.push(chroma(randomColor).hex());
    }
    initialColors.push(chroma(randomColor).hex());
    console.log(randomColor.hex());

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
  // Refreshing the Input
  refreshInput();
  // Button Contrast
  adjustBtn.forEach((button, index) => {
    checkTxtContrast(initialColors[index], button);
    checkTxtContrast(initialColors[index], lockBtn[index]);
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
  // Saturation
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);
  // Brightness (0.5 because 0 is black, 1 is white)
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);

  // Input colors
  // Saturation
  saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(
    0
  )}, ${scaleSat(1)})`;
  brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(
    0
  )}, ${scaleBright(0.5)}, ${scaleBright(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)`;
}

function hslCtrl(e) {
  const index =
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-sat") ||
    e.target.getAttribute("data-hue");
  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  const bgColor = initialColors[index];

  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);
  colorDivs[index].style.backgroundColor = color;
  // Live sliders based on the selected value
  colorSliders(color, hue, brightness, saturation);
}

function updateTextUI(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const textHex = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");
  textHex.innerText = color.hex();
  // Checking the basckground contrast
  checkTxtContrast(color, textHex);
  for (icon of icons) {
    checkTxtContrast(color, icon);
  }
}
function refreshInput() {
  const sliders = document.querySelectorAll(".sliders input");
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = initialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if (slider.name === "brightness") {
      const brightColor = initialColors[slider.getAttribute("data-bright")];
      const brightValue = chroma(brightColor).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100;
    }
    if (slider.name === "saturation") {
      const satColor = initialColors[slider.getAttribute("data-sat")];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    }
  });
}
function copyToClip(hex) {
  // Creating textarea and getting the value
  const txtarea = document.createElement("textarea");
  txtarea.value = hex.innerText;
  document.body.appendChild(txtarea);
  // Selecting txtarea
  txtarea.select();
  // Executing the copy command
  document.execCommand("copy");
  document.body.removeChild(txtarea);
  // Animation
  const popBox = pop.children[0];
  pop.classList.add("active");
  popBox.classList.add("active");
}
function openAdjustPanel(index) {
  sliderContainers[index].classList.toggle("active");
}
function closeAdjustPanel(index) {
  sliderContainers[index].classList.remove("active");
}

function lockColor(index) {
  colorDivs[index].classList.toggle("lock");
  lockBtn[index].children[0].classList.toggle("fa-lock-open");
  lockBtn[index].children[0].classList.toggle("fa-lock");
}

randomColors();
