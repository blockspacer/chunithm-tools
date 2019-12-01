import {Command} from "../models";
import {border} from "./border";
import {ping} from "./ping";

export const commands: {[key: string]: Command} = {
    "ping": ping,

    "border": border,
    "bd": border,
    "b": border,
    "ボーダー": border
};
