const ormConfigs = {
  url: process.env.DATABASE_URL,
  type: process.env.ORM_CONFIG_TYPE,
  synchronize: JSON.parse(process.env.ORM_CONFIG_SYNCHRONIZE),
  logging: JSON.parse(process.env.ORM_CONFIG_LOGGING),
  extra: {
    ssl: JSON.parse(process.env.ORM_CONFIG_SSL),
  },
};

module.exports = {
  ...ormConfigs,
  entities: ['build/database/entity/*.js'],
  migrations: ['build/database/migration/*.js'],
  cli: {
    entitiesDir: 'src/database/entity',
    migrationsDir: 'src/database/migration',
  },
};
