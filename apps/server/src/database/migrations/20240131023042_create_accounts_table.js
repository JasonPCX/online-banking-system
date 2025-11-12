const tableName = "accounts";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.uuid("id").defaultTo(knex.fn.uuid()).primary();
    table.string("account_number", 28).notNullable().unique();
    table.decimal("balance", 14, 2).notNullable().defaultTo("2000.00");
    table.enu("account_type", ["Checking account", "Savings account"]);
    table.uuid("user_id");
    table.foreign("user_id", "fk_user_id").references("users.id");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
  await knex.schema.dropTable(tableName);
};
