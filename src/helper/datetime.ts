function format(plainString: string) {
    return ("0" + plainString).slice(-2);
}

export function getDate(): string {
    const date = new Date();
    const year = String(date.getFullYear());
    const month = format(String(date.getMonth() + 1));
    const day = format(String(date.getDate()));
    return year + "-" + month + "-" + day;
}

export function getTime(): string {
    const date = new Date();
    const hours = format(String(date.getHours()));
    const minutes = format(String(date.getMinutes()));
    const seconds = format(String(date.getSeconds()));
    return hours + ":" + minutes + ":" + seconds;
}

export function getDatetime(): string {
    return getDate() + " " + getTime();
}
