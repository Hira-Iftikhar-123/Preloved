import './App.css';
import Home from './screens/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './screens/Login.js';
import Signup from './screens/Signup.js';
import { CartProvider } from './components/ContextReducer';
import '../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css'; 
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import MyOrder from './screens/MyOrder';
import About from './screens/About';
import Checkout from './screens/Checkout';
import SupportDashboard from './components/SupportDashboard';
import AdminLogin from './screens/AdminLogin';
import AdminDashboard from './screens/AdminDashboard';

function App() {
  return (
    <CartProvider>
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/myorder" element={<MyOrder />} />
          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/support" element={<SupportDashboard />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
    </CartProvider>
  );
}

export default App;
