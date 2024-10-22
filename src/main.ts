import "./style.css";//deno run dev

const APP_NAME = "Sticker Sketchpad";
const app = document.querySelector<HTMLDivElement>("#app")!;
const header = document.createElement("h1");
const canvas = document.createElement("canvas");
const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
const undoB = document.createElement("button");
const redoB = document.createElement("button");
const thinB = document.createElement("button");
const thickB = document.createElement("button");
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
let linez:displays[] = [];
let redoLinez:displays[] = [];
let drawing = false;
let CurrSize = 2;
let CurrLine: displays;
const drawchangEvent = new Event("drawing-changed");

document.title = APP_NAME;
header.innerHTML = APP_NAME;


canvas.addEventListener("mousedown", (e) => {
  CurrLine = displayObj();
  CurrLine.setsize(CurrSize);
  CurrLine.addPoint(e.offsetX, e.offsetY);
  linez.push(CurrLine);
  drawing=true;

});
canvas.addEventListener("mousemove", (e) => {
  if(drawing){
    CurrLine.addPoint(e.offsetX, e.offsetY);
    canvas.dispatchEvent(drawchangEvent);
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

clearButton.addEventListener("click", () => {
    linez = [];
    redoLinez = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
undoB.addEventListener("click",() =>{
  if(linez.length){
    redoLinez.push(linez.pop()!);
    canvas.dispatchEvent(drawchangEvent);
  }
});
redoB.addEventListener("click",() =>{

  if(redoLinez.length){
    linez.push(redoLinez.pop()!);
    canvas.dispatchEvent(drawchangEvent);
  }
});
thinB.addEventListener("click",() =>{
  if(CurrSize > 1){
    CurrLine.setsize(CurrSize--);
  }

});
thickB.addEventListener("click",() =>{
  if(CurrSize < 30){
    CurrLine.setsize(CurrSize++);
  }

});
canvas.addEventListener("drawing-changed", function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(let i=0;i<linez.length;i++){
    linez[i].display(ctx);
  }
});


app.append(header);
app.append(canvas);
app.append(clearButton);
app.append(undoB);
app.append(redoB);
app.append(thinB);
app.append(thickB);