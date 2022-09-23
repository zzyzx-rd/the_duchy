import * as path from 'path';

require('dotenv').config();

const SnakeNamingStrategy =
  require('typeorm-naming-strategies').SnakeNamingStrategy;

let config = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: false,
  subscribers: [path.join(__dirname, '..', 'subscribers', '*.{ts,js}')],
  entities: [path.join(__dirname, '..', 'models', '*.{ts,js}')],
  migrations: [path.join(__dirname, '..', 'migrations', '*.{ts,js}')],
  cli: {
    entitiesDir: [path.join(__dirname, '..', 'models', '*.{ts,js}')],
    migrationsDir: [path.join(__dirname, '..', 'migrations', '*.{ts,js}')],
  },
  namingStrategy: new SnakeNamingStrategy(),
};

if (process.env.PLATFORM === 'heroku') {
  (config as any) = {
    ...config,
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  };
}

export = config;
