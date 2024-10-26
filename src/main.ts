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
const emoji4 = document.createElement("button");
const exportB = document.createElement("button");
const pen = document.createElement("button");
const emoArr:string[] = ["","🥴","👌","🍕"];
exportB.style.width = "140px";
exportB.style.height = "60px";
exportB.style.fontSize = "20px";

canvas.height = canvas.width = 256;
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
  addSticker(x:number, y:number, e:number):void;
  getcords():void;
  setscale(s:number):void;
}
function stickerObj(): displaySticker{
  let Spoints:{x:number; y:number; e:number};
  let scalez:number = 1;
  const width:number = 35;
  function addSticker(x:number, y:number,e:number){
    Spoints = {x,y,e};
  }
  function getcords(){
    console.log(Spoints);
  }
  function display(ctx: CanvasRenderingContext2D){
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = scalez*width+"px serif";
    ctx.fillText(emoArr[Spoints.e],Spoints.x,Spoints.y);
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
    ctx.font = "32px monospace";
    ctx.fillText("*",cordx-7,cordy+16);
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
emoji4.innerHTML = "CUSTOM";
exportB.innerHTML = "EXPORT";
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
  stickerz = true;emoji=1;

});
emoji2.addEventListener("click",() =>{
  stickerz = true;emoji=2;

});
emoji3.addEventListener("click",() =>{
  stickerz = true;emoji=3;

});
emoji4.addEventListener("click",() =>{
  const sign = prompt("What's your sign?");
  emoArr.push(sign!);
  stickerz = true;emoji=emoArr.length-1;
});
pen.addEventListener("click",() =>{
  stickerz = false;emoji=0;

});
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
header.append(exportB);
app.append(canvas);
app.append(pen);
app.append(thinB);
app.append(thickB);
app.append(emoji1);
app.append(emoji2);
app.append(emoji3);
app.append(emoji4);
app.append(undoB);
app.append(redoB);
app.append(clearButton);