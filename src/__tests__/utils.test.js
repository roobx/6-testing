import { getResponse } from "../utils/utils";

describe("Response utils", () => {
    it("Should be ok when get response SUCCESS", () => {
        const mockResponse = {
            ok: true,
            json: () => {
                return {
                    user: "ignat",
                };
            },
        };
        expect(getResponse(mockResponse)).toEqual({ user: "ignat" });
    });

    it("Should throw reject if FAILED", () => {
        const mockResponse = { ok: false, status: 404 };

        expect(getResponse(mockResponse)).rejects.toEqual("Ошибка: 404");
    });
});
