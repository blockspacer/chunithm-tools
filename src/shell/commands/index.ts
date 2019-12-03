import {Command} from "../models";
import {border} from "./border";
import {difficulty} from "./difficulty";
import {help} from "./help";
import {info} from "./info";
import {ping} from "./ping";

export const commands: {[key: string]: Command} = {
    "ping": ping,

    "help": help,

    "border": border,
    "bd": border,
    "b": border,
    "ボーダー": border,

    "difficulty": difficulty,
    "dif": difficulty,

    "info": info
};
