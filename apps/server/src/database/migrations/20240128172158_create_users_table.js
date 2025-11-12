const tableName = 'users';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
    await knex.schema.createTable(tableName, function (table) {
        table.uuid('id').defaultTo(knex.fn.uuid()).primary();
        table.string('full_name', 75).notNullable();
        table.string('username', 16).notNullable().unique();
        table.string('email', 100).notNullable().unique();
        table.string('password').notNullable();
        table.timestamp('last_login').nullable();
        table.tinyint('failed_login_attempts').unsigned().defaultTo(0);
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
    await knex.schema.dropTable(tableName);
};
