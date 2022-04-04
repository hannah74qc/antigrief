// ==UserScript==
// @name         Anti Grief script
// @namespace    https://github.com/hannah74qc
// @version      4
// @description  prevent griefing on our flag
// @author       Athena - original creator, hannah - moved to userscript
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL  https://github.com/hannah74qc/antigrief/raw/main/antigrief.user.js
// @updateURL    https://github.com/hannah74qc/antigrief/raw/main/antigrief.user.js
// ==/UserScript==

// ANTIGRIEF SCRIPT
//
// MANUAL USAGE:
// 	1) Navigate to https://new.reddit.com/r/place/
// 	2) Open the "Developer Tools" (CTRL+SHIFT+I)
// 	3) Make sure the context dropdown is set to: "embed" (https://i.imgur.com/YfCY4WP.png)
// 	4) Paste the code below in the console and hit enter. (https://i.imgur.com/YAHjJXP.png)
//      5) Leave window open and a pixel will be placed in the set
//         range every time your timer goes down
//
// NOTE: In the console panel in "Developer Tools", window
//       MUST be set to: hot-potato.reddit.com (embed)
// 	 Code won't work unless your source is that hot-potato iframe!!
//
// < ------- CODE BELOW ------->

let monalisaEmbed = document.querySelector("mona-lisa-embed");
let monalisaContainer = monalisaEmbed.shadowRoot.querySelector(
  "mona-lisa-share-container"
);
let camera = monalisaEmbed.camera;
let status_pill = monalisaContainer.querySelector("mona-lisa-status-pill");

let selection_xy1 = [481, 431];

let selection_xy2 = [786, 475];
let last_attempt = Date.now() - 5000;

let colors = {
  1: { hex: "#be0039", text: "dark red" },
  2: { hex: "#ff4500", text: "red" },
  3: { hex: "#ffa800", text: "orange" },
  4: { hex: "#ffd635", text: "yellow" },
  6: { hex: "#00a368", text: "dark green" },
  7: { hex: "#00cc78", text: "green" },
  8: { hex: "#7eed56", text: "light green" },
  9: { hex: "#00cc78", text: "dark teal" },
  10: { hex: "#009eaa", text: "teal" },
  12: { hex: "#2450a4", text: "dark blue" },
  13: { hex: "#3690ea", text: "blue" },
  14: { hex: "#51e9f4", text: "light blue" },
  15: { hex: "#493ac1", text: "indigo" },
  16: { hex: "#6a5Cff", text: "periwinkle" },
  18: { hex: "#811e9f", text: "dark purple" },
  19: { hex: "#b44ac0", text: "purple" },
  22: { hex: "#ff3881", text: "pink" },
  23: { hex: "#ff99aa", text: "light pink" },
  24: { hex: "#6d482f", text: "dark brown" },
  25: { hex: "#9c6926", text: "brown" },
  27: { hex: "#000000", text: "black" },
  29: { hex: "#898d90", text: "gray" },
  30: { hex: "#d4d7d9", text: "light gray" },
  31: { hex: "#ffffff", text: "white" },
};

String.prototype.convertToRGB = function () {
  let str = this.replace("#", "");
  if (str.length != 6) {
    throw "Only six-digit hex colors are allowed.";
  }
  var aRgbHex = str.match(/.{1,2}/g);
  var aRgb = [
    parseInt(aRgbHex[0], 16),
    parseInt(aRgbHex[1], 16),
    parseInt(aRgbHex[2], 16),
  ];
  return aRgb;
};

function getRnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function getColorXY(x, y) {
  let hexColor = monalisaContainer.getCanvasPixelColor({ x: x, y: y });
  return hexColor;
}

function getColorFromHex(hex) {
  for (var i in colors) {
    if (colors[i]["hex"] === hex) {
      return i;
    }
  }
  console.log(hex);
  return -1;
}

function getNextSeconds() {
  return typeof status_pill.nextTileAvailableIn == "number"
    ? status_pill.nextTileAvailableIn
    : 0;
}

function placePixelAntiGrief(xy1) {
  let x = getRnd(0, x_length);
  let y = getRnd(0, y_length);
  let toHex = plan[y][x];
  let fromHex = getColorXY(x + xy1[0], y + xy1[1]);
  // look for places randomly and find one that is off template
  from = getColorFromHex(fromHex);
  fix = getColorFromHex(toHex);
  while (toHex === fromHex || fix === -1) {
    x = getRnd(0, x_length);
    y = getRnd(0, y_length);
    toHex = plan[y][x];
    fromHex = getColorXY(x + xy1[0], y + xy1[1]);
	from = getColorFromHex(fromHex);
    fix = getColorFromHex(toHex);
  }
  try {
    monalisaEmbed.setFullScreen(true);
    monalisaEmbed.showColorPicker = true;
    monalisaEmbed.selectedColor = parseInt(fix);
    camera.applyPosition({ x: x + xy1[0], y: y + xy1[1], zoom: 50 });

    setTimeout(() => {
      let pixel = monalisaContainer.querySelector("mona-lisa-color-picker");
      pixel.confirmPixel();
      setTimeout(() => {
        monalisaEmbed.showColorPicker = false;
      }, 100);
    }, 200);
  } catch (error) {
    console.log("Error: placePixelAntiGrief", error);
  }
  // success message
  console.log(`Placed: ${colors[fix].text} (${[toHex]})`);
  console.log(`Replaced: ${colors[from].text} (${[fromHex]})`);
  console.log(`coordinates: [${x + selection_xy1[0]},${y + selection_xy1[1]}]`);
}

function debug(xy1) {
  let x = getRnd(0, x_length);
  let y = getRnd(0, y_length);
  let toHex = plan[y][x];
  let fromHex = getColorXY(x + xy1[0], y + xy1[1]);

  // look for places randomly and find one that is off template
  from = getColorFromHex(fromHex);
  fix = getColorFromHex(toHex);
  while (toHex === fromHex || fix === -1) {
    x = getRnd(0, x_length);
    y = getRnd(0, y_length);
    toHex = plan[y][x];
    fromHex = getColorXY(x + xy1[0], y + xy1[1]);
	from = getColorFromHex(fromHex);
    fix = getColorFromHex(toHex);
  }
  try {
    camera.applyPosition({
      x: x + selection_xy1[0],
      y: y + selection_xy1[1],
      zoom: 50,
    });
  } catch (error) {
    console.log("Error: placePixelAntiGrief", error);
  }
  // success message
  console.log(`Placed: ${colors[fix].text} (${[toHex]})`);
  console.log(`Replaced: ${colors[from].text} (${[fromHex]})`);
  console.log(`coordinates: [${x + selection_xy1[0]},${y + selection_xy1[1]}]`);
}

function getPixel(canvas, x, y) {
  return canvas.getContext("2d").getImageData(x, y, 1, 1).data;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function pixelToHex(pixel) {
  return rgbToHex(pixel[0], pixel[1], pixel[2]);
}

var x_rs = 1444;
var x_re = 2361;

var y_rs = 1294;
var y_re = 1431;

var x_length = parseInt((x_re - x_rs) / 3);
var y_length = parseInt((y_re - y_rs) / 3);

var plan = new Array(y_length);

for (var y = 0; y < y_length; y++) {
  plan[y] = new Array(x_length);
}

var canvas = document.createElement("canvas");
canvas.id = "canvas";
document.body.append(canvas);
var img = new Image();

function refresh() {
  img.src =
    "https://raw.githubusercontent.com/Ender0112/Transgender-Flag-Template/main/place.png";
  img.crossOrigin = "Anonymous";
  return img;
}

function reload() {
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
  for (var y = 0; y < y_length; y++) {
    for (var x = 0; x < x_length; x++) {
      plan[y][x] = pixelToHex(getPixel(canvas, x_rs + x * 3, y_rs + y * 3));
    }
  }

  placePixelAntiGrief(selection_xy1, selection_xy2);
}

img.addEventListener("load", reload);

async function Main() {
  while (true) {
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    monalisaEmbed.wakeUp();
    if (getNextSeconds() <= 1 && Date.now() - last_attempt > 5000) {
      sleep(getRnd(1000, 10000));
      last_attempt = Date.now();
      img = refresh();
    }
  }
}

Main();
