import { DataTypes, type QueryInterface } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  const tables = await context.showAllTables();
  if (tables.includes("job_applications")) {
    return;
  }

  await context.createTable("job_applications", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    job_id: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    webpage_url: {
      type: DataTypes.STRING(1024),
      allowNull: true,
    },
    logo_url: {
      type: DataTypes.STRING(1024),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("sent", "response", "interview", "rejected"),
      allowNull: false,
      defaultValue: "sent",
    },
    applied_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  await context.addIndex("job_applications", ["user_id", "job_id"], {
    unique: true,
    name: "job_applications_user_id_job_id_unique",
  });
};

export const down: MigrationFn<QueryInterface> = async ({ context }) => {
  await context.dropTable("job_applications");
};
