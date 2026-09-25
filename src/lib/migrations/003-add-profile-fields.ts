import { DataTypes, type QueryInterface } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  const table = await context.describeTable("users");

  if (!table.title) {
    await context.addColumn("users", "title", {
      type: DataTypes.STRING(120),
      allowNull: true,
    });
  }
  if (!table.phone) {
    await context.addColumn("users", "phone", {
      type: DataTypes.STRING(40),
      allowNull: true,
    });
  }
  if (!table.city) {
    await context.addColumn("users", "city", {
      type: DataTypes.STRING(120),
      allowNull: true,
    });
  }
  if (!table.job_types) {
    await context.addColumn("users", "job_types", {
      type: DataTypes.JSON,
      allowNull: true,
    });
  }
  if (!table.job_areas) {
    await context.addColumn("users", "job_areas", {
      type: DataTypes.JSON,
      allowNull: true,
    });
  }
  if (!table.preferred_locations) {
    await context.addColumn("users", "preferred_locations", {
      type: DataTypes.JSON,
      allowNull: true,
    });
  }
  if (!table.email_provider) {
    await context.addColumn("users", "email_provider", {
      type: DataTypes.STRING(32),
      allowNull: true,
    });
  }
  if (!table.auto_apply) {
    await context.addColumn("users", "auto_apply", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  }
  if (!table.notify_new_jobs) {
    await context.addColumn("users", "notify_new_jobs", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  }
  if (!table.weekly_report) {
    await context.addColumn("users", "weekly_report", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  }
};

export const down: MigrationFn<QueryInterface> = async ({ context }) => {
  const table = await context.describeTable("users");

  if (table.title) await context.removeColumn("users", "title");
  if (table.phone) await context.removeColumn("users", "phone");
  if (table.city) await context.removeColumn("users", "city");
  if (table.job_types) await context.removeColumn("users", "job_types");
  if (table.job_areas) await context.removeColumn("users", "job_areas");
  if (table.preferred_locations) await context.removeColumn("users", "preferred_locations");
  if (table.email_provider) await context.removeColumn("users", "email_provider");
  if (table.auto_apply) await context.removeColumn("users", "auto_apply");
  if (table.notify_new_jobs) await context.removeColumn("users", "notify_new_jobs");
  if (table.weekly_report) await context.removeColumn("users", "weekly_report");
};
