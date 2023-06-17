import { register } from "../utils/auth-api";
import { AUTH_SERVER_URL } from "../utils/constants";

describe("register request api", () => {
    beforeEach(() => {
        jest.spyOn(global, "fetch").mockResolvedValue({
            json: () => ({ result: "ok", token: 12345 }),
            ok: true,
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("Should be successful", async () => {
        const regResult = await register("email", "password");
        expect(regResult).toEqual({ result: "ok", token: 12345 });
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("Should reject with error", async () => {
        fetch.mockImplementationOnce(() => {
            return Promise.resolve({
                ok: false,
                json: () => {
                    return {
                        error: "error",
                        success: false,
                    };
                },
                status: 500,
            });
        });

        expect(register("email", "password")).rejects.toEqual("Ошибка: 500");
        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledWith(`https://auth.nomoreparties.co/signup`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: "email", password: "password" }),
        });
    });
});
