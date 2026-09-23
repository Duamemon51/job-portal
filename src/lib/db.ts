import { Sequelize } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";
import { down, up } from "@/lib/migrations/001-create-users";

const globalForSequelize = globalThis as unknown as {
  sequelize?: Sequelize;
};

export const sequelize =
  globalForSequelize.sequelize ??
  new Sequelize(
    process.env.DATABASE_URL ?? "mysql://root:@127.0.0.1:3306/job_portal",
    {
      dialect: "mysql",
      logging: false,
    },
  );

if (process.env.NODE_ENV !== "production") {
  globalForSequelize.sequelize = sequelize;
}

let migrationPromise: Promise<void> | undefined;

export async function connectDatabase() {
  await sequelize.authenticate();
  migrationPromise ??= new Umzug({
    migrations: [{ name: "001-create-users", up, down }],
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: undefined,
  }).up().then(() => undefined);
  await migrationPromise;
}