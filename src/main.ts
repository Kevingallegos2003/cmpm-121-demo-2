import "./style.css";//deno run dev

// ----- Document Variable References -----
// Document Initialization
const APP_NAME = "Kooky Sticker Sketchpad";
const app = document.querySelector<HTMLDivElement>("#app")!;
const header = document.createElement("h1");
document.title = APP_NAME;
header.innerHTML = APP_NAME;

// -- Canvas --
const canvas = document.createElement("canvas");
canvas.height = canvas.width = 256;
const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
const ctx1 = <CanvasRenderingContext2D>canvas.getContext("2d");

// -- Buttons --
const btnDiv = document.createElement("div");
// undo/redo/clear
const undoB = document.createElement("button");
const redoB = document.createElement("button");
const clearButton = document.createElement("button");
// thin/thick
const thinB = document.createElement("button");
const thickB = document.createElement("button");
// stickers
const emoji1 = document.createElement("button");
const emoji2 = document.createElement("button");
const emoji3 = document.createElement("button");
const customEmoji = document.createElement("button");
const emoArr:string[] = ["🥴","👌","🍕"];
const emojiBtnArr = [emoji1, emoji2, emoji3];
// export
const exportB = document.createElement("button");
exportB.style.width = "140px";
exportB.style.height = "60px";
exportB.style.fontSize = "20px";
// colors
const pen = document.createElement("button");
const colorz:string[] = ["black","blue","red","green"];
let currentColor = colorz[0];
const black = document.createElement("button");
const blue = document.createElement("button");
const red = document.createElement("button");
const green = document.createElement("button");
const colorBtnArr = [black, blue, red, green];

interface displays{
  display(ctx: CanvasRenderingContext2D): void;
  addPoint(x:number, y:number): void;
  setsize(s:number): void;
  setscale(s:number):void;
}

function displayObj(): displays{
  const Apoints:{x:number; y:number}[] = [];
  let linesize:number;
  let scalez:number = 1;

  function setsize(s:number){
    linesize = s;
  }

  function addPoint(x:number, y:number){
    const point = {x,y};
    Apoints.push(point);
  }

  function drawLine(line: CanvasRenderingContext2D, size: number, x1: number, y1:number, x2:number,y2:number){
    line.strokeStyle = currentColor;
    line.fillStyle = currentColor;
    line.lineWidth = size*scalez;
    line.beginPath();
    line.moveTo(x1,y1);
    line.lineTo(x2,y2);
    line.stroke();
    line.closePath();
  }

  function setscale(s:number){
    for(let i =0;i<Apoints.length;i++){
      Apoints[i].x*=s;
      Apoints[i].y*=s;
      scalez = s;
    }
  }

  function display(ctx: CanvasRenderingContext2D){

    for(let i =1;i<Apoints.length;i++){
      drawLine(ctx, linesize, Apoints[i-1].x, Apoints[i-1].y, Apoints[i].x,Apoints[i].y);
    }
  }

  return{display, addPoint, setscale, setsize}
}

interface displaySticker{
  display(ctx: CanvasRenderingContext2D): void;
  addSticker(x:number, y:number, e:string):void;
  getcords():void;
  setscale(s:number):void;
}

function stickerObj(): displaySticker{
  let Spoints:{x:number; y:number; e:string};
  let scalez:number = 1;
  const width:number = 35;

  function addSticker(x:number, y:number,e:string){
    Spoints = {x,y,e};
  }

  function getcords(){
    console.log(Spoints);
  }

  function display(ctx: CanvasRenderingContext2D){
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = scalez*width+"px serif";
    ctx.fillText(Spoints.e,Spoints.x,Spoints.y);
  }

  function setscale(s:number){
      scalez = s;
      Spoints.x*=s;
      Spoints.y*=s;
  }

  return{display, addSticker, setscale, getcords}
}

interface displaymouse{
  display(ctx: CanvasRenderingContext2D): void;
  addcords(x:number, y:number): void;
  getcords():void;
}

function mouseObj():displaymouse{
  let cordx:number;
  let cordy:number;

  function display(ctx: CanvasRenderingContext2D){
    ctx.save();
    ctx.beginPath();
    ctx.arc(cordx, cordy, CurrSize, 0, Math.PI * 2);
    ctx.fillStyle = currentColor;
    ctx.fill();
    ctx.restore();
  }

  function addcords(x:number, y:number){
    cordx = x;
    cordy = y;
  }
  
  function getcords(){
    return {x:cordx, y:cordy};
  }

  return{display, addcords, getcords};
}


// ----- App State Tracking Variables-----
let linez:displays[] = [];
let Spoints:displaySticker[] = [];
let stickerz:boolean = false;
let emoji:string = "";
let redoLinez:displays[] = [];
let redoSticker:displaySticker[] = [];
let drawing = false;
let CurrSize = 2;
let CurrLine: displays;
const drawchangEvent = new Event("drawing-changed");
const mouseEvent = new Event("tool-moved");
const mousePos = mouseObj();
let stickers:displaySticker;
mousePos.addcords(-1,-1);
mousePos.display(ctx1);

// Handles dropping a sticker or starting a line
canvas.addEventListener("mousedown", (e) => {
    CurrLine = displayObj();
    stickers = stickerObj();
  if(!stickerz){
    CurrLine.setsize(CurrSize);
    CurrLine.addPoint(e.offsetX, e.offsetY);
    linez.push(CurrLine);
    drawing=true;
  }
  else{
    stickers.addSticker(e.offsetX,e.offsetY,emoji);
    Spoints.push(stickers);
    stickers.getcords();
    drawing=true;
  }
});

// Handles continuing to draw a line
canvas.addEventListener("mousemove", (e) => {
  mousePos.addcords(e.offsetX,e.offsetY);
  if(drawing){
    CurrLine.addPoint(e.offsetX, e.offsetY);
    canvas.dispatchEvent(drawchangEvent);
    mousePos.display(ctx1);
  }
  else{
    canvas.dispatchEvent(mouseEvent);
  }
});

// Stop drawing
canvas.addEventListener("mouseup", (e) => {
 if(drawing){
  CurrLine.addPoint(e.offsetX, e.offsetY);
  drawing = false;
  canvas.dispatchEvent(drawchangEvent);
  redoLinez =[];
  CurrLine = displayObj();
 }
});

// Set button HTMLs
clearButton.innerHTML = "clear";
undoB.innerHTML = "undo";
redoB.innerHTML = "redo";
thinB.innerHTML = "Thin Line";
thickB.innerHTML = "Thick Line";
customEmoji.innerHTML = "CUSTOM";
exportB.innerHTML = "EXPORT";
pen.innerHTML = "✏️";
black.innerHTML = "⬛";
blue.innerHTML = "🟦";
red.innerHTML = "🟥";
green.innerHTML = "🟩";

// Set emoji button innerHTMLs
// On click, set sticker mode true and emoji to corresponding one in emoArr
for (let i = 0; i < emoArr.length; i++){
  emojiBtnArr[i].innerHTML = emoArr[i];
  emojiBtnArr[i].addEventListener("click",() =>{
    stickerz = true;
    emoji = emoArr[i];
  });
}

// Set custom emoji to user input
customEmoji.addEventListener("click",() =>{
  const sign = prompt("What's your sign?");
  if (sign) {
    emoArr.push(sign);
    stickerz = true;
    emoji=sign;
  } else {
    stickerz = false;
  }
});

// Disables sticker mode
pen.addEventListener("click",() =>{
  stickerz = false;
});

// Clears all data arrays and canvas
clearButton.addEventListener("click", () => {
    stickerz = false;
    linez = [];
    Spoints = [];
    redoSticker = [];
    redoLinez = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// TODO: FIX UNDO/REDO BUG
// undo/redo works on both lines and stickers at the same time.
// Need to keep track of which one you need to push/pop from at a given moment.
// Or better yet, put both lines and stickers into the same array.

// Undos/pops from lines and sticker array into redo
undoB.addEventListener("click",() =>{
  if(linez.length){
    redoLinez.push(linez.pop()!);
    canvas.dispatchEvent(drawchangEvent);
  }
  if(Spoints.length){
    redoSticker.push(Spoints.pop()!);
    canvas.dispatchEvent(drawchangEvent);
  }
});

// Redos/pushes from redo arrays into lines and sticker
redoB.addEventListener("click",() =>{
  if(redoLinez.length){
    linez.push(redoLinez.pop()!);
    canvas.dispatchEvent(drawchangEvent);
  }
  if(redoSticker.length){
    Spoints.push(redoSticker.pop()!);
    canvas.dispatchEvent(drawchangEvent);
  }
});

// Decreases pen size
thinB.addEventListener("click",() =>{
  stickerz = false;
  if(CurrSize > 1){
    CurrLine.setsize(CurrSize--);
  }
});

// Increases pen size
thickB.addEventListener("click",() =>{
  stickerz = false;
  if(CurrSize < 30){
    CurrLine.setsize(CurrSize++);
  }
});

// TODO: COLOR UPDATING AT INCORRECT TIMES
// When changing color, it changes it for all previous lines,
// this is because previous lines do not have their color saved.
// Need to make it so each displayable line keeps track of what
// color they are.

// Create click event for color buttons to change color
// colorz array corresponds with colorBtnArr
for (let i = 0; i < colorz.length; i++){
  colorBtnArr[i].addEventListener("click",() =>{
    if(!stickerz){
      currentColor = colorz[i];
    }
  });
}

// TODO: FIX EXPORT SIZE BUG
// This bugs out and makes everything large when returning
// to drawing.
// Make a deep copy of the arrays instead of a (copyArr = originalArray;)
// shallow copy that references the original
// (create new objects with the same values in a for loop)

// Redraws everything onto a larger canvas and downloads
exportB.addEventListener("click",() =>{
  const scaledCanvas = document.createElement("canvas");
  scaledCanvas.width = canvas.width * 4;
  scaledCanvas.height = canvas.height * 4;
  const ctx2 = scaledCanvas.getContext("2d");
  const copyStick:displaySticker[] = Spoints;
  const copyLinez:displays[] = linez;
  for(let i=0;i<copyLinez.length;i++){
    copyLinez[i].setscale(4);
    copyLinez[i].display(ctx2!);
  }
  for(let i=0;i<copyStick.length;i++){
    copyStick[i].setscale(4);
    copyStick[i].getcords();
    copyStick[i].display(ctx2!);
  }
  console.log("export");
  const anchor = document.createElement("a");
  anchor.href = scaledCanvas.toDataURL("image/png");
  anchor.download = "KookyDrawing.png";
  anchor.click();
});

// When mouse leaves the canvas, update the canvas
canvas.addEventListener("mouseout", ()=>{
  canvas.dispatchEvent(drawchangEvent);
});

// Refreash the canvas and redraw every object
canvas.addEventListener("drawing-changed", function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(let i=0;i<linez.length;i++){
    linez[i].display(ctx);
  }
  for(let i=0;i<Spoints.length;i++){
    Spoints[i].display(ctx);
  }
});

// Show preview/cursor
canvas.addEventListener("tool-moved", function(){
  canvas.dispatchEvent(drawchangEvent);
  mousePos.display(ctx1);
});

// ----- Append all objects to the page -----
app.append(header);
header.append(exportB);
app.append(canvas);
app.append(btnDiv);
btnDiv.append(pen);
for (let i = 0; i < colorBtnArr.length; i++) btnDiv.append(colorBtnArr[i]);
btnDiv.append(green);
btnDiv.append(thinB);
btnDiv.append(thickB);
btnDiv.append(undoB);
btnDiv.append(redoB);
app.append(emoji1);
app.append(emoji2);
app.append(emoji3);
app.append(customEmoji);
app.append(clearButton);