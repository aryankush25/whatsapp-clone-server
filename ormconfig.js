module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'aryankush25',
  password: 'aryankush25',
  database: 'whatsapp_clone_database',
  synchronize: true,
  logging: false,
  entities: ['build/entity/*.{js,ts}'],
  migrations: ['build/migration/*.{js,ts}'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
  },
};
