import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './components/home/Home';
import Record from './components/record/Record';
import Contact from './components/contact/Contact';
import Login from './components/login/Login';
import ShoppingCart from './components/shopping-cart/ShoppingCart';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/services" element={<Record />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/shopping-cart" element={<ShoppingCart />} />
          <Route path="/record" element={<Record />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
