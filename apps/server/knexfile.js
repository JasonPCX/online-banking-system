import { environments } from './src/contants/constants.js';
import { ENV } from './src/utils/env.js';

const configs = {
  client: 'pg',
  connection: {
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
  },
  pools: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: 'src/database/migrations',
  },
  seeds: {
    directory: 'src/database/seeds',
  }
}

export default Object.fromEntries(environments.map((env) => [env, configs]));