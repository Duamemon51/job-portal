import { Sequelize } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";
import * as createUsers from "@/lib/migrations/001-create-users";
import * as addPasswordResetFields from "@/lib/migrations/002-add-password-reset-fields";
import * as addProfileFields from "@/lib/migrations/003-add-profile-fields";
import * as createJobApplications from "@/lib/migrations/004-create-job-applications";
import * as addJobPreferenceFields from "@/lib/migrations/005-add-job-preference-fields";

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
    migrations: [
      { name: "001-create-users", ...createUsers },
      { name: "002-add-password-reset-fields", ...addPasswordResetFields },
      { name: "003-add-profile-fields", ...addProfileFields },
      { name: "004-create-job-applications", ...createJobApplications },
      { name: "005-add-job-preference-fields", ...addJobPreferenceFields },
    ],
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: undefined,
  }).up().then(() => undefined);
  await migrationPromise;
}