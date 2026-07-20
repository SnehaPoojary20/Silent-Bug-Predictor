import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Components/Home/Home.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Product from "./Components/Product/Product.jsx";
import Working from "./Components/Working/Working.jsx";
import Analyze from "./Components/Analyze/Analyze.jsx";
import Docs from "./Components/Docs/Docs.jsx";
import Login from "./Components/Login/Login.jsx";
import Register from "./Components/Register/Register.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Profile from "./Components/Profile/Profile.jsx";
import { isLoggedIn } from "./api/auth.js";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/working" element={<Working />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={isLoggedIn() ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="*"
          element={<Navigate to={isLoggedIn() ? "/home" : "/login"} replace />}
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
