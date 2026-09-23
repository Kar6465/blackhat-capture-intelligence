import http from "node:http";
import worker from "../dist/server/index.js";

const port = Number(process.env.PORT || 4173);
const server = http.createServer(async (incoming, outgoing) => {
  const chunks = [];
  for await (const chunk of incoming) chunks.push(chunk);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;
  const request = new Request(`http://127.0.0.1:${port}${incoming.url}`, {
    method: incoming.method,
    headers: incoming.headers,
    body: ["GET", "HEAD"].includes(incoming.method) ? undefined : body,
  });
  const response = await worker.fetch(request, { SAM_API_KEY: process.env.SAM_API_KEY });
  outgoing.writeHead(response.status, Object.fromEntries(response.headers));
  outgoing.end(Buffer.from(await response.arrayBuffer()));
});

server.listen(port, "127.0.0.1", () => console.log(`Local: http://127.0.0.1:${port}/`));
