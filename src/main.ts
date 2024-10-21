import "./style.css";//deno run dev

const APP_NAME = "Sticker Sketchpad";
const app = document.querySelector<HTMLDivElement>("#app")!;
const header = document.createElement("h1");
const canvas = document.createElement("canvas");

canvas.height = canvas.width = 256;


document.title = APP_NAME;
header.innerHTML = APP_NAME;
const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");

const cursor = { active: false, x: 0, y: 0 };
canvas.addEventListener("mousedown", (e) => {
    cursor.active = true;
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
});
canvas.addEventListener("mousemove", (e) => {
    if (cursor.active) {
        ctx.beginPath();
        ctx.moveTo(cursor.x, cursor.y);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        cursor.x = e.offsetX;
        cursor.y = e.offsetY;
    }
});
canvas.addEventListener("mouseup", (e) => {
    cursor.active = false;
});
const clearButton = document.createElement("button");
clearButton.innerHTML = "clear";

clearButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

app.append(header);
app.append(canvas);
app.append(clearButton);
canvas.height = canvas.width = 256;