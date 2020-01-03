import axios from "axios";

export default async function request(url: string, data: any) {
    try {
        const response = await axios.post(url, data);

        try {
            return JSON.parse(response.data);
        } catch {
            return response.data;
        }
    } catch (err) {
        const message = "結構大変なエラーが起きてます。Twitter(@chunithmtools)に連絡してくれると助かります。";
        const reason = err?.response?.status || "Unknown";
        alert(`${message}\n${reason}`);
        throw new Error();
    }
}
