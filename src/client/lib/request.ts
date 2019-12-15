import axios from "axios";

export default async function request(url: string, data: any) {
    try {
        const response = await axios.post(url, data);

        try {
            return JSON.parse(response.data);
        } catch {
            return response.data;
        }
    } catch {
        alert("結構大変なエラーが起きてます。Twitter(@chunithmtools)に連絡してくれると助かります。");
        throw new Error();
    }
}
