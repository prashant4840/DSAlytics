import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Profile } from "./pages/Profile";
import "./index.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoutes";
import AboutAndPrivacy from "./pages/About";
import { useState } from "react";
import { User } from "./lib/types";

const App = () => {
  const [user, setUser] = useState<User | null>(null);

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
              <ProtectedRoute setUser={setUser}>
                <Profile user={user} setUser={setUser} />
              </ProtectedRoute>
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
