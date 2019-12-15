class BaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = new.target.name;
    }
}

export class ControllerError extends BaseError {}
