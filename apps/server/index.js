import { ENV } from './src/utils/env.js';
import { logger } from './src/utils/logger.js';
import { createServer } from './src/utils/server.js';

const app = createServer();

app.listen(ENV.SERVER_PORT, () => {
    logger.info(`Server running on port ${ENV.SERVER_PORT}`);
});