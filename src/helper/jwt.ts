import {randomBytes} from "crypto";
import {readFile, writeFile} from "fs";
import {sign, verify} from "jsonwebtoken";

async function readFileAsync(filename: string) {
    return await new Promise<string>((resolve, reject) => {
        readFile(filename, async (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(data.toString("utf-8"));
        });
    });
}

async function writeFileAsync(filename: string, content: string) {
    return await new Promise<void>((resolve, reject) => {
        writeFile(filename, content, async (err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
}

async function generateSecret() {
    return await new Promise<string>((resolve, reject) => {
        randomBytes(64, (err, buf) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(buf.toString("hex"));
        });
    });
}

const getSecret = (() => {
    let secret: string | null = null;

    return async () => {
        if (!secret) {
            const filename = process.cwd() + "/config/jwtsecret";
            try {
                secret = await readFileAsync(filename);
            } catch {
                secret = await generateSecret();
                await writeFileAsync(filename, secret);
            }
        }

        return secret;
    };
})();

export async function encodeJWT(content: string) {
    return await new Promise<string>(async (resolve, reject) => {
        sign(content, await getSecret(), (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(data);
        });
    });
}

export async function decodeJWT(content: string) {
    return await new Promise<string>(async (resolve, reject) => {
        verify(content, await getSecret(), (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            if (typeof data !== "string") {
                reject(new Error("不正なトークンです。"));
                return;
            }

            resolve(data);
        });
    });
}
