import "./style.css";//deno run dev

const APP_NAME = "Kooky Sticker Sketchpad";
const app = document.querySelector<HTMLDivElement>("#app")!;
const header = document.createElement("h1");
const canvas = document.createElement("canvas");
const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
const ctx1 = <CanvasRenderingContext2D>canvas.getContext("2d");
const undoB = document.createElement("button");
const redoB = document.createElement("button");
const thinB = document.createElement("button");
const thickB = document.createElement("button");
const emoji1 = document.createElement("button");
const emoji2 = document.createElement("button");
const emoji3 = document.createElement("button");
const pen = document.createElement("button");
const emoArr:string[] = ["","🥴","👌","🍕"];


canvas.height = canvas.width = 256;
interface displays{
  display(ctx: CanvasRenderingContext2D): void;
  addPoint(x:number, y:number): void;
  setsize(s:number): void;
}
function displayObj(): displays{
  const Apoints:{x:number; y:number}[] = [];
  let linesize:number;

  function setsize(s:number){
    linesize = s;
  }
  function addPoint(x:number, y:number){
    const point = {x,y};
    Apoints.push(point);
  }
  function drawLine(line: CanvasRenderingContext2D, size: number, x1: number, y1:number, x2:number,y2:number){
    line.lineWidth = size;
    line.beginPath();
    line.moveTo(x1,y1);
    line.lineTo(x2,y2);
    line.stroke();
    line.closePath();
  }
  function display(ctx: CanvasRenderingContext2D){
    for(let i =1;i<Apoints.length;i++){
      drawLine(ctx, linesize, Apoints[i-1].x, Apoints[i-1].y, Apoints[i].x,Apoints[i].y);
    }
  }
  return{display, addPoint, setsize}
}
interface displaySticker{
  display(ctx: CanvasRenderingContext2D): void;
  addSticker(x:number, y:number, e:number):void;
  getcords():void;
}
function stickerObj(): displaySticker{
  let Spoints:{x:number; y:number; e:number};
  function addSticker(x:number, y:number,e:number){
    Spoints = {x,y,e};
  }
  function getcords(){
    console.log(Spoints);
  }
  function display(ctx: CanvasRenderingContext2D){
    ctx.fillText(emoArr[Spoints.e],Spoints.x,Spoints.y);
  }
  return{display, addSticker, getcords}
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
    ctx.font = "32px monospace";
    ctx.fillText("*",cordx-8,cordy+16);
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
let linez:displays[] = [];
let Spoints:displaySticker[] = [];
let stickerz:boolean = false;
let emoji:number = 0;
let redoLinez:displays[] = [];
let redoSticker:displaySticker[] = [];
let drawing = false;
let CurrSize = 2;
let CurrLine: displays;
const drawchangEvent = new Event("drawing-changed");
const mouseEvent = new Event("tool-moved");

document.title = APP_NAME;
header.innerHTML = APP_NAME;

const mousePos = mouseObj();
let stickers:displaySticker;
mousePos.addcords(-1,-1);
mousePos.display(ctx1);
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
canvas.addEventListener("mouseup", (e) => {
 if(drawing){
  CurrLine.addPoint(e.offsetX, e.offsetY);
  drawing = false;
  canvas.dispatchEvent(drawchangEvent);
  redoLinez =[];
 }
});
const clearButton = document.createElement("button");
clearButton.innerHTML = "clear";
undoB.innerHTML = "undo";
redoB.innerHTML = "redo";
thinB.innerHTML = "Thin Line";
thickB.innerHTML = "Thick Line";
emoji1.innerHTML = "🥴";
emoji2.innerHTML = "👌";
emoji3.innerHTML = "🍕";
pen.innerHTML = "✏️";


clearButton.addEventListener("click", () => {
    stickerz = false;
    linez = [];
    Spoints = [];
    redoSticker = [];
    redoLinez = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
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
thinB.addEventListener("click",() =>{
  stickerz = false;
  if(CurrSize > 1){
    CurrLine.setsize(CurrSize--);
  }

});
thickB.addEventListener("click",() =>{
  stickerz = false;
  if(CurrSize < 30){
    CurrLine.setsize(CurrSize++);
  }

});
emoji1.addEventListener("click",() =>{
  console.log("🥴");
  stickerz = true;emoji=1;

});
emoji2.addEventListener("click",() =>{
  console.log("👌");
  stickerz = true;emoji=2;

});
emoji3.addEventListener("click",() =>{
  console.log("🍕");
  stickerz = true;emoji=3;

});
pen.addEventListener("click",() =>{
  console.log("Pen used");
  stickerz = false;emoji=0;

});


canvas.addEventListener("mouseout", ()=>{
  canvas.dispatchEvent(drawchangEvent);

});
canvas.addEventListener("drawing-changed", function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(let i=0;i<linez.length;i++){
    linez[i].display(ctx);
  }
  for(let i=0;i<Spoints.length;i++){
    Spoints[i].display(ctx);
  }
});
canvas.addEventListener("tool-moved", function(){
  canvas.dispatchEvent(drawchangEvent);
  mousePos.display(ctx1);
});


app.append(header);
app.append(canvas);
app.append(pen);
app.append(thinB);
app.append(thickB);
app.append(emoji1);
app.append(emoji2);
app.append(emoji3);
app.append(undoB);
app.append(redoB);
app.append(clearButton);