import Knex from 'knex';

import configs from '../../knexfile.js';
import { ENV } from '../utils/env.js';

export const db = Knex(configs[ENV.NODE_ENV]);