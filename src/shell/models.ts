export type Command = {
    name: string,
    help: string[],
    body: CommandBody
};

export type CommandBody = (parameters: string[], context: Context) => Promise<string[] | CommandError>;

export enum CommandErrorKinds {
    COMMAND_NOT_FOUND = 0,
    TOO_FEW_PARAMETERS = 1,
    TOO_MANY_PARAMETERS = 2,
    USER_INFO_IS_MISSING = 3,
    PLAYER_INFO_IS_MISSING = 4,
    GROUP_INFO_IS_MISSING = 5,
}

export type CommandError = {
    error: CommandErrorKinds
};

export type Context = {
    playerId?: string,
    groupId?: string
};
