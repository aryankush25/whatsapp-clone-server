module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'template1',
  synchronize: true,
  logging: false,
  entities: ['build/database/entity/*.js'],
  migrations: ['build/database/migration/*.js'],
  cli: {
    entitiesDir: 'database/entity',
    migrationsDir: 'database/migration',
  },
};
