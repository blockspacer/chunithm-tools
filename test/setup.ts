import {knex} from "../src/knex_wrapper";

afterAll(() => {
    knex.destroy();
});
