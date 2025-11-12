const tableName = 'transactions';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
    await knex.schema.createTable(tableName, function (table) {
        table.uuid('id').defaultTo(knex.fn.uuid()).primary();
        table.decimal('amount', 14, 2).notNullable();
        table.enu('transaction_type', ['Withdraw', 'Deposit', 'Transfer']);
        table.string('description', 255).nullable();
        table.uuid('from_id').nullable();
        table.foreign('from_id', 'fk_from_id').references('accounts.id');
        table.uuid('rcpt_id').nullable()
        table.foreign('rcpt_id', 'fk_rcpt_id').references('accounts.id');
        table.enu('status', ['Pending', 'Success', 'Failed', 'Blocked']);
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
