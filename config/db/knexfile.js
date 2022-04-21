// Update with your config settings.

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      connectionString:
        "postgres://hwsklhutaeyrwt:c8a06bf218adb706b2de2378daedaf3cb32cec560d78c00d4b719af6a006101d@ec2-3-230-122-20.compute-1.amazonaws.com:5432/d78qsltsh69av7",
      ssl: { rejectUnauthorized: false },
    },
  },

  local: {
    client: "postgresql",
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_user_migrations",
    },
  },
};
