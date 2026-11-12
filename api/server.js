import { createServer } from "node:http";
import path from "node:path";
import { inviteMember, listMembers } from "../backend/members.js";

process.env.DEMO_DATA_FILE ??= path.join(import.meta.dirname, "../backend/data.json");

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:4200",
  "Access-Control-Allow-Headers": "Content-Type",
};

function send(response, status, body) {
  response.writeHead(status, headers);
  response.end(body === undefined ? "" : JSON.stringify(body));
}

async function readJson(request) {
  let text = "";
  for await (const chunk of request) text += chunk;
  return JSON.parse(text || "{}");
}

createServer(async (request, response) => {
  console.log(`${request.method} ${request.url}`);
  try {
    if (request.method === "OPTIONS") return send(response, 204);
    if (request.url === "/api/members" && request.method === "GET") return send(response, 200, await listMembers());
    if (request.url === "/api/members" && request.method === "POST") {
      const { email } = await readJson(request);
      return send(response, 201, await inviteMember(email));
    }
    send(response, 404, { error: "Not found" });
  } catch (error) {
    send(response, 400, { error: error.message });
  }
}).listen(3001, () => console.log("http://localhost:3001"));
