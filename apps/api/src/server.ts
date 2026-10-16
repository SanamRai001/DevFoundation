import { createApp } from './app.js';
import { loadConfig } from './config.js';

const config = loadConfig();
const server = createApp().listen(config.PORT, config.HOST, () => {
  console.info(
    JSON.stringify({
      level: 'info',
      event: 'api_started',
      host: config.HOST,
      port: config.PORT,
    }),
  );
});

server.on('error', (error) => {
  console.error(JSON.stringify({ level: 'error', event: 'server_error', message: error.message }));
  process.exitCode = 1;
});

let shuttingDown = false;
function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.info(JSON.stringify({ level: 'info', event: 'shutdown', signal }));
  server.close((error) => {
    if (error) {
      console.error(JSON.stringify({ level: 'error', event: 'shutdown_failed', message: error.message }));
      process.exitCode = 1;
    }
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
