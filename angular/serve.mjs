import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

// Serves the built files the way a static host such as S3 and CloudFront does: the files, and index.html for any other route.
const root = path.join(import.meta.dirname, "dist/angular/browser");
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".ico": "image/x-icon" };

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  let file = path.join(root, pathname);
  if (!file.startsWith(root)) file = path.join(root, "index.html");
  let body;
  try {
    body = await readFile(file);
  } catch {
    file = path.join(root, "index.html");
    body = await readFile(file);
  }
  response.writeHead(200, { "Content-Type": types[path.extname(file)] ?? "application/octet-stream" });
  response.end(body);
}).listen(4200, () => console.log("http://localhost:4200"));
