import thunk from "redux-thunk";
import { ActionTypes, register } from "../store/auth/actions";
import reducer from "../store/auth/reducer";
import mestoApi from "../utils/mesto-api";
import * as authApi from "../utils/auth-api";
import configureMockStore from "redux-mock-store";
import { useDispatch } from "react-redux";

describe("redux", () => {
    beforeEach(() => {
        jest.spyOn(global, "fetch").mockResolvedValue({
            json: () => ({ result: "ok", token: 12345 }),
            ok: true,
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("Should create initial store state", () => {
        expect(reducer(undefined, {})).toEqual({
            data: null,
            authChecking: true,
            registerSending: false,
            registerError: "",
            loginSending: false,
            loginError: undefined,
        });
    });

    it("Should work with error", () => {
        const errorMessage = "Who are you?";

        expect(
            reducer(undefined, {
                type: ActionTypes.SET_LOGIN_SEND_ERROR,
                payload: errorMessage,
            })
        ).toEqual({
            data: null,
            authChecking: true,
            registerSending: false,
            registerError: "",
            loginSending: false,
            loginError: errorMessage,
        });
    });

    it("should trigger dispatches", () => {
        const middlewares = [thunk.withExtraArgument({ mestoApi, authApi })];
        const mockStore = configureMockStore(middlewares);
        const store = mockStore({ data: null });

        const expectedActions = [
            { type: ActionTypes.SET_REGISTER_SENDING, payload: true },
            { type: ActionTypes.SET_REGISTER_SEND_ERROR, payload: "" },
            { type: ActionTypes.SET_REGISTER_SENDING, payload: false },
        ];

        return store.dispatch(register({ email: "email", password: "password" })).then(() => {
            return expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it("should trigger error", () => {
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

        const middlewares = [thunk.withExtraArgument({ mestoApi, authApi })];
        const mockStore = configureMockStore(middlewares);
        const store = mockStore({ data: null });

        const expectedActions = [
            { type: ActionTypes.SET_REGISTER_SENDING, payload: true },
            { type: ActionTypes.SET_REGISTER_SEND_ERROR, payload: "" },
            { type: ActionTypes.SET_REGISTER_SEND_ERROR, payload: "Ошибка: 500" },
            { type: ActionTypes.SET_REGISTER_SENDING, payload: false },
        ];

        return store.dispatch(register({ email: "email", password: "password" })).catch((error) => {
            expect(error).toEqual("Ошибка: 500");
            return expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
