import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import Header from "../components/Header";
import store from "../store/store";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";

describe("Header component", () => {
    afterEach(cleanup);

    it("Should render logo", () => {
        const altText = "Логотип проекта Mesto";
        const headerWrapperId = "header-wrapper-element";
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <Provider store={store}>
                    <Header />
                </Provider>
            </Router>
        );

        const img = screen.getByAltText(altText);
        expect(img).toHaveClass("logo");

        const loginWrapper = screen.getByTestId(headerWrapperId);
        expect(loginWrapper).toHaveClass("header__wrapper");
    });

    it("Should render logo", async () => {
        const history = createMemoryHistory();

        history.push("/signin");

        render(
            <Router history={history}>
                <Provider store={store}>
                    <Header />
                </Provider>
            </Router>
        );

        expect(screen.getByTestId("link-signup-element")).toHaveTextContent("Регистрация");
        expect(history.location.pathname).not.toEqual("/login");
        expect(history.location.pathname).toEqual("/signin");

        await userEvent.click(screen.getByTestId("link-signup-element"));

        expect(screen.getByTestId("link-signin-element")).toHaveTextContent("Войти");
        expect(history.location.pathname).toEqual("/signup");
    });

    it("Should render logo", async () => {
        const history = createMemoryHistory();

        const { asFragment } = render(
            <Router history={history}>
                <Provider store={store}>
                    <Header />
                </Provider>
            </Router>
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
