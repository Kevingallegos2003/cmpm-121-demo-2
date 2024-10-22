import "./style.css";//deno run dev

const APP_NAME = "Sticker Sketchpad";
const app = document.querySelector<HTMLDivElement>("#app")!;
const header = document.createElement("h1");
const canvas = document.createElement("canvas");
const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
const undoB = document.createElement("button");
const redoB = document.createElement("button");
canvas.height = canvas.width = 256;

interface Point{
  x: number;
  y: number;
}
const lines:Point[][] = [];
const redoLines:Point[][] = [];

let currentLine:Point[]= [];
const cursor = { active: false, x: 0, y: 0 };
const drawchangEvent = new Event("drawing-changed");

document.title = APP_NAME;
header.innerHTML = APP_NAME;


canvas.addEventListener("mousedown", (e) => {
    cursor.active = true;
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
    currentLine = [];
    lines.push(currentLine);
    redoLines.splice(0, redoLines.length);
    currentLine.push({ x: cursor.x, y: cursor.y });
    canvas.dispatchEvent(drawchangEvent);
});
canvas.addEventListener("mousemove", (e) => {
    if (cursor.active) {
      cursor.x = e.offsetX;
      cursor.y = e.offsetY;
      currentLine.push({ x: cursor.x, y: cursor.y });
      canvas.dispatchEvent(drawchangEvent);
    }
});
canvas.addEventListener("mouseup", () => {
    cursor.active = false;
    currentLine = [];
    canvas.dispatchEvent(drawchangEvent);
});
const clearButton = document.createElement("button");
clearButton.innerHTML = "clear";
undoB.innerHTML = "undo";
redoB.innerHTML = "redo";

clearButton.addEventListener("click", () => {
    lines.splice(0,lines.length);
    canvas.dispatchEvent(drawchangEvent);
});
undoB.addEventListener("click",() =>{
  if(lines.length > 0){
    const lastline = lines[lines.length-1];
    lines.splice(lines.length - 1, 1);
    redoLines.push(lastline);
    canvas.dispatchEvent(drawchangEvent);
  }
});
redoB.addEventListener("click",() =>{
  if(redoLines.length > 0){
    const lastline = redoLines[redoLines.length-1];
    redoLines.splice(redoLines.length -1, 1);
    lines.push(lastline);
    canvas.dispatchEvent(drawchangEvent);
  }
});
canvas.addEventListener("drawing-changed", function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const line of lines) {
    if (line.length > 1) {
      ctx.beginPath();
      const {x, y} = line[0];
      ctx.moveTo(x, y);
      for (const { x, y } of line) {
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
});


app.append(header);
app.append(canvas);
app.append(clearButton);
app.append(undoB);
app.append(redoB);
canvas.height = canvas.width = 256;