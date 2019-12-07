import {Command} from "../models";
import {border} from "./border";
import {difficulty} from "./difficulty";
import {help} from "./help";
import {info} from "./info";
import {mybest} from "./mybest";
import {ping} from "./ping";
import {profile} from "./profile";
import {rank} from "./rank";
import {register} from "./register";
import {score} from "./score";
import {songs} from "./songs";

export const commands: {[key: string]: Command} = {
    "ping": ping,

    "help": help,

    "border": border,
    "bd": border,
    "b": border,
    "ボーダー": border,

    "difficulty": difficulty,
    "dif": difficulty,

    "info": info,

    "mybest": mybest,

    "profile": profile,

    "ranking": rank,
    "rank": rank,
    "r": rank,
    "ランキング": rank,

    "register": register,

    "score": score,

    "songs": songs,
};
