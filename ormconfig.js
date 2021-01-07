module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'template1',
  synchronize: true,
  logging: false,
  entities: ['build/entity/*.{js,ts}'],
  migrations: ['build/migration/*.{js,ts}'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
  },
};
