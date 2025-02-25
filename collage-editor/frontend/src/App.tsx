import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import LayoutSelection from "./pages/LayoutSelection";
import Editor from "./pages/Editor";
import Profile from "./pages/Profile";
import Preview from "./pages/Preview";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/layouts" element={<LayoutSelection />} />
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/preview" element={<Preview />} />
      </Routes>
    </>
  );
}

export default App;
