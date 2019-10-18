import {hash} from "bcrypt";
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

export function sha256(content: string) {
    return createHash("sha256")
            .update(content)
            .digest("hex");
}
