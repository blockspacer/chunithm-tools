import * as Knex from "knex";
import * as settings from "../knexfile";

export const knex = Knex(
    process.env.NODE_ENV === "production" ? settings.production : settings.development);

export function onDuplicateKey(
    tableName: string,
    insert: {[key: string]: any},
    update: {[key: string]: any},
    trx?: Knex.Transaction
) {
    const keys = Object.keys(update);

    if (trx) {
        return trx.raw(
            knex(tableName)
                .insert(Object.assign(insert, update))
                .toQuery()
            + " on duplicate key "
            + knex.raw("update " + keys.map((key) => key + "=?").join(","),
                        keys.map((key) => update[key]))
                  .toQuery()
        );
    }

    return knex.raw(
        knex(tableName)
            .insert(Object.assign(insert, update))
            .toQuery()
        + " on duplicate key "
        + knex.raw("update " + keys.map((key) => key + "=?").join(","),
                    keys.map((key) => update[key]))
              .toQuery()
    );
}
