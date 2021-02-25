module.exports = {
  type: "sqlite",
  database: "./src/database/database.sqlite",
  entities: ["./src/models/**.ts"],
  logging: true,
  migrations: ["./src/database/migrations/**.ts"],
  cli: {
    migrationsDir: "./src/database/migrations",
  },
};
