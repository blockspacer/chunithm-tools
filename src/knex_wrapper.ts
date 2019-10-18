import * as Knex from "knex";
import * as settings from "../knexfile";

export const knex = Knex(settings.development);
