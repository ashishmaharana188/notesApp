import AppRouter from "./Router/AppRouter";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";

const store = configureStore();
const jsx = <AppRouter />;

function App() {
  return <Provider store={store}>{jsx}</Provider>;
}

export default App;
