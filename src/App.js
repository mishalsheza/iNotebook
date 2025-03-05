import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./components/Home";
import  About  from "./components/About";
import NoteState from "./context/Note/NoteState";

function App() {
  return (
    <div className="App">
      <NoteState>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/about" element={<About />} />
        </Routes>
      </div>
      </NoteState>
    </div>
  );
}

export default App;
