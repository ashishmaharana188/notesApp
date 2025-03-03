import { addNote } from "./actions/AddNote";
import AppRouter from "./Router/AppRouter";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";

const store = configureStore();

store.dispatch(
  addNote({
    title: "NOTE1",
    noteSnippet: "GOOD STUFF",
    date: 1738079643538,
  })
);

const jsx = <AppRouter />;

function App() {
  return (
    <Provider store={store}>
      {jsx}
      <p className="text-red-500">If this text is red, Tailwind is working.</p>
    </Provider>
  );
}

export default App;
