import DevDatabaseConfig from './database';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: DevDatabaseConfig,
  keys: {
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'),
    publicKey: process.env.PUBLIC_KEY.replace(/\\n/gm, '\n'),
  },
});
