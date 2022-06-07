import { DraggableBlock } from "./components/DraggableBlock";

function App() {
  return (
    <div className="App">
      <DraggableBlock type="PROCESS" />
      <DraggableBlock type="RESOURCE" />
    </div>
  );
}

export default App;
