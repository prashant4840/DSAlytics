import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Profile } from "./pages/Profile";
import "./index.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

import AboutAndPrivacy from "./pages/About";
import { UserProvider } from "./contexts/Context";
import ProtectedRoute from "./components/ProtectedRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <div className=" outfit">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<AboutAndPrivacy />} />
          <Route
            path="/profile"
            element={
              <UserProvider>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </UserProvider>
            }
          />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
