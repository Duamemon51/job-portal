import { DataTypes, type QueryInterface } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  const table = await context.describeTable("users");

  if (!table.reset_token_hash) {
    await context.addColumn("users", "reset_token_hash", {
      type: DataTypes.STRING(64),
      allowNull: true,
    });
  }
  if (!table.reset_token_expires_at) {
    await context.addColumn("users", "reset_token_expires_at", {
      type: DataTypes.DATE,
      allowNull: true,
    });
  }
};

export const down: MigrationFn<QueryInterface> = async ({ context }) => {
  await context.removeColumn("users", "reset_token_hash");
  await context.removeColumn("users", "reset_token_expires_at");
};
