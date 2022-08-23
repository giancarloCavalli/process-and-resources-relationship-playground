import BlockProvider from "./features/BlocksBoard/context";
import Homepage from "./pages/Homepage";

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
