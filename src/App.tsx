import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./components/Home";
import { BoardPage } from "./components/BoardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/board/:id" element={<BoardPage />} />
    </Routes>
  );
}

export default App;
