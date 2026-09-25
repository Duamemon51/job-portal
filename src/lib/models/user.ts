import { CreationOptional, DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "@/lib/db";

export type UserRole = "user" | "admin" | "superadmin";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
  declare role: UserRole;
  declare title: CreationOptional<string | null>;
  declare phone: CreationOptional<string | null>;
  declare city: CreationOptional<string | null>;
  declare jobTypes: CreationOptional<string[] | null>;
  declare jobAreas: CreationOptional<string[] | null>;
  declare preferredLocations: CreationOptional<string[] | null>;
  declare emailProvider: CreationOptional<string | null>;
  declare autoApply: CreationOptional<boolean>;
  declare notifyNewJobs: CreationOptional<boolean>;
  declare weeklyReport: CreationOptional<boolean>;
  declare experienceLevels: CreationOptional<string[] | null>;
  declare locationMode: CreationOptional<string>;
  declare radiusMil: CreationOptional<number | null>;
  declare nationwide: CreationOptional<boolean>;
  declare resetTokenHash: CreationOptional<string | null>;
  declare resetTokenExpiresAt: CreationOptional<Date | null>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash",
    },
    role: {
      type: DataTypes.ENUM("user", "admin", "superadmin"),
      allowNull: false,
      defaultValue: "user",
    },
    title: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    jobTypes: {
      type: DataTypes.JSON,
      allowNull: true,
      field: "job_types",
    },
    jobAreas: {
      type: DataTypes.JSON,
      allowNull: true,
      field: "job_areas",
    },
    preferredLocations: {
      type: DataTypes.JSON,
      allowNull: true,
      field: "preferred_locations",
    },
    emailProvider: {
      type: DataTypes.STRING(32),
      allowNull: true,
      field: "email_provider",
    },
    autoApply: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "auto_apply",
    },
    notifyNewJobs: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "notify_new_jobs",
    },
    weeklyReport: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "weekly_report",
    },
    experienceLevels: {
      type: DataTypes.JSON,
      allowNull: true,
      field: "experience_levels",
    },
    locationMode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "ort",
      field: "location_mode",
    },
    radiusMil: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "radius_mil",
    },
    nationwide: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    resetTokenHash: {
      type: DataTypes.STRING(64),
      allowNull: true,
      field: "reset_token_hash",
    },
    resetTokenExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "reset_token_expires_at",
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    underscored: true,
  },
);