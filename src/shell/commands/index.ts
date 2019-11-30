import {Command} from "../models";
import {ping} from "./ping";

export const commands: {[key: string]: Command} = {
    "ping": ping
};
