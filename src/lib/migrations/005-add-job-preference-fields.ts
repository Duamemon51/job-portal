import { DataTypes, type QueryInterface } from "sequelize";
import type { MigrationFn } from "umzug";

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  const table = await context.describeTable("users");

  if (!table.experience_levels) {
    await context.addColumn("users", "experience_levels", {
      type: DataTypes.JSON,
      allowNull: true,
    });
  }
  if (!table.location_mode) {
    await context.addColumn("users", "location_mode", {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "ort",
    });
  }
  if (!table.radius_mil) {
    await context.addColumn("users", "radius_mil", {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
  }
  if (!table.nationwide) {
    await context.addColumn("users", "nationwide", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  }
};

export const down: MigrationFn<QueryInterface> = async ({ context }) => {
  const table = await context.describeTable("users");

  if (table.experience_levels) await context.removeColumn("users", "experience_levels");
  if (table.location_mode) await context.removeColumn("users", "location_mode");
  if (table.radius_mil) await context.removeColumn("users", "radius_mil");
  if (table.nationwide) await context.removeColumn("users", "nationwide");
};
