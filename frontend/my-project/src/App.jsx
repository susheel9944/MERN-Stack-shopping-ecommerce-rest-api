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
import UserRoutes from "./components/routes/UserRoute";
import AdminRoutes from "./components/routes/AdminRoute";
import NotFound from "./components/layout/NotFound";

function App() {
  const userRoute = UserRoutes();
  const adminRoute = AdminRoutes();
  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-center" />
        <Header />
        <div className="container">
          <Routes>
            {userRoute}
            {adminRoute}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
