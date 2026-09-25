import { CreationOptional, DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "@/lib/db";

export type ApplicationStatus = "sent" | "response" | "interview" | "rejected";

export class JobApplication extends Model<InferAttributes<JobApplication>, InferCreationAttributes<JobApplication>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare jobId: string;
  declare title: string;
  declare company: string;
  declare city: CreationOptional<string | null>;
  declare category: CreationOptional<string | null>;
  declare webpageUrl: CreationOptional<string | null>;
  declare logoUrl: CreationOptional<string | null>;
  declare status: CreationOptional<ApplicationStatus>;
  declare appliedAt: CreationOptional<Date>;
}

JobApplication.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "user_id",
    },
    jobId: {
      type: DataTypes.STRING(64),
      allowNull: false,
      field: "job_id",
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
    webpageUrl: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      field: "webpage_url",
    },
    logoUrl: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      field: "logo_url",
    },
    status: {
      type: DataTypes.ENUM("sent", "response", "interview", "rejected"),
      allowNull: false,
      defaultValue: "sent",
    },
    appliedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "applied_at",
    },
  },
  {
    sequelize,
    tableName: "job_applications",
    timestamps: true,
    underscored: true,
  },
);
