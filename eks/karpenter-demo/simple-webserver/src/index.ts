import * as os from 'os';
import { IncomingMessage, ServerResponse, createServer, OutgoingHttpHeaders, IncomingHttpHeaders } from 'http';
const logger = require('pino-http')();

const resHeaders: OutgoingHttpHeaders = {
  content: 'text/html; charset=utf-8',
  'X-Backend-Server': os.hostname(),
};

interface ReturnProps {
  ServerHostname: string;
  Listener: string;
  Requester: string;
  Server: string;
  Uptime: number;
  Path: string | undefined;
  Headers: IncomingHttpHeaders;
}
const json = (req: IncomingMessage): ReturnProps => {
  return {
    ServerHostname: os.hostname(),
    Listener: req.connection.localAddress + ':' + req.connection.localPort,
    Requester: req.connection.remoteAddress + ':' + req.connection.remotePort,
    Server: process.title + ':' + process.version,
    Uptime: process.uptime(),
    Path: req.url,
    Headers: req.headers,
  };
};

const generateResponse = (res: ServerResponse, statusCode: number, headers: OutgoingHttpHeaders, body: string): void => {
  res.writeHead(statusCode, headers);
  res.write(body);
  res.end();
};

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  logger(req, res);
  generateResponse(res, 200, resHeaders, JSON.stringify(json(req), null, 2));
});

server.listen(9091, '0.0.0.0');
