import "./App.css";
import { Board } from "./components/board";
import { board1 } from "./boards/board1";

function App() {
  return (
    <>
      <Board board={board1} />
    </>
  );
}

export default App;
