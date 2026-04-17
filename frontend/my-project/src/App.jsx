import Home from "./components/Home";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import ProductDetail from "./components/product/ProductDetail";
import Login from "./components/auth/login";
import Register from "./components/auth/Register";
import Profile from "./components/user/Profile";
import UpdateProfile from "./components/user/UpdateProfile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UploadAvatar from "./components/user/UploadAvatar";
import UpdatePassword from "./components/user/UpdatePassword";

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-center" />
        <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/me/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/me/update-profile"
              element={
                <ProtectedRoute>
                  <UpdateProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/me/upload-avatar"
              element={
                <ProtectedRoute>
                  <UploadAvatar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/me/update-password"
              element={
                <ProtectedRoute>
                  <UpdatePassword />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
