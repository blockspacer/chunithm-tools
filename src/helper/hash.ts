import {compare, hash} from "bcrypt";
import {createHash} from "crypto";

export async function bcrypt(content: string) {
    return await new Promise<string>((resolve, reject) => {
        hash(content, 10, async (err, hashedContent) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(hashedContent);
        });
    });
}

export async function compareBcrypt(data: string, encrypted: string) {
    return await new Promise<boolean>((resolve, reject) => {
        compare(data, encrypted, (err, result) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(result);
        });
    });
}

export function sha256(content: string) {
    return createHash("sha256")
            .update(content)
            .digest("hex");
}
