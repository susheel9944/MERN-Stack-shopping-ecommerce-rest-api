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

function App() {
  const userRoute = UserRoutes();
  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-center" />
        <Header />
        <div className="container">
          <Routes>{userRoute}</Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
