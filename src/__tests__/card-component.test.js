import { create } from "react-test-renderer";
import Card from "../components/Card";
import { Provider } from "react-redux";
import store from "../store/store";

const mockCard = {
    likes: [],
    _id: "1",
    name: "Deer",
    link: "https://images.unsplash.com/",
    owner: {
        name: "John",
        about: "Web-developer",
        avatar: "https://images.unsplash.com/",
        _id: "1",
        cohort: "cohort-21",
    },
    createdAt: "2021-10-24T19:41:51.239Z",
};

describe("Check Card component", () => {
    test("Should render card", () => {
        const renderedCard = create(
            <Provider store={store}>
                <Card card={mockCard} onDelete={jest.fn()} onImageClick={jest.fn()} />
            </Provider>
        );

        expect(renderedCard).toMatchSnapshot();
    });
});
