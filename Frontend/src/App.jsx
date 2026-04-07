import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home.jsx';
import Navbar from './Components/Navbar/Navbar.jsx';
import Product from './Components/Product/Product.jsx';
import Working from './Components/Working/Working.jsx';
import Analyze from "./Components/Analyze/Analyze.jsx"
import Docs from "./Components/Docs/Docs.jsx"
import Footer from './Components/Footer/Footer.jsx';


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/working" element={<Working />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/docs" element={<Docs />} />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
