import "./style.css";

const APP_NAME = "Sticker Sketchpad";
const app = document.querySelector<HTMLDivElement>("#app")!;
const header = document.createElement("h1");
const canvas = document.createElement("canvas");

canvas.height = canvas.width = 256;


document.title = APP_NAME;
header.innerHTML = APP_NAME;
app.append(header);
app.append(canvas);
canvas.height = canvas.width = 256;