const ormConfigs = {
  type: process.env.ORM_CONFIG_TYPE,
  host: process.env.ORM_CONFIG_HOST,
  port: Number(process.env.ORM_CONFIG_PORT),
  username: process.env.ORM_CONFIG_USERNAME,
  password: process.env.ORM_CONFIG_PASSWORD,
  database: process.env.ORM_CONFIG_DATABASE,
  synchronize: JSON.parse(process.env.ORM_CONFIG_SYNCHRONIZE),
  logging: JSON.parse(process.env.ORM_CONFIG_LOGGING),
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
