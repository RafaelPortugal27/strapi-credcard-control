module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'postgres',
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'credcardcontrol'),
        username: env('DATABASE_USERNAME', 'rafael'),
        password: env('DATABASE_PASSWORD', 'portugal'),
        ssl: env.bool('DATABASE_SSL', false),
      },
      options: {}
    },
  },
});
