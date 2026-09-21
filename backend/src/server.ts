import { createApp } from './app.js';
import { config } from './config/index.js';

const app = createApp();

const server = app.listen(config.PORT, () => {
  console.log(`🚀 Digital Heroes Backend listening on port ${config.PORT} [${config.NODE_ENV}]`);
  console.log(`📡 Health endpoint: http://localhost:${config.PORT}/api/health`);
});

// Graceful shutdown handling
const shutdown = () => {
  console.log('Stopping server gracefully...');
  server.close(() => {
    console.log('Server stopped.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
