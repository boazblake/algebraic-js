import express from "express";
import { renderPage } from "./render.js";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
// serve compiled JS assets
app.use("/browser", express.static(path.join(__dirname, "../browser")));
app.use("/model", express.static(path.join(__dirname, "../model")));
app.use("/shared", express.static(path.join(__dirname, "../shared")));
app.use("/node_modules", express.static("node_modules"));
app.get("{*splat}", async (_req, res) => {
    const html = await renderPage();
    res.send(html);
});
app.listen(3000, () => {
    console.log("SSR server running on http://localhost:3000");
});
