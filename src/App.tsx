import BlockProvider from "./context/blockContext";
import { Homepage } from "./pages/Homepage";

function App() {
  return (
    <BlockProvider>
      <div className="App">
        <Homepage />
      </div>
    </BlockProvider>
  );
}

export default App;
