import {Command} from "../models";

export const ping: Command = {
    name: "ping",
    help: ["pong!およびパラメーターを表示します。"],
    body: async (params) => ["pong", ...params]
};
