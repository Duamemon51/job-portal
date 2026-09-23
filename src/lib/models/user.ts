import { CreationOptional, DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "@/lib/db";

export type UserRole = "user" | "admin" | "superadmin";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
  declare role: UserRole;
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