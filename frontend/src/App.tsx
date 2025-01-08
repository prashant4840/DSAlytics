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
import PreviewPage from "./pages/Preview";
import ScrollToTop from "./contexts/ScrollToTop";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className=" outfit">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<AboutAndPrivacy />} />
          <Route path="/preview/:userid" element={<PreviewPage />} />
          <Route
            path="/profile"
            element={
              <UserProvider>
                <ProtectedRoute>
                  <>
                    <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
                    <Profile />
                  </>
                </ProtectedRoute>
              </UserProvider>
            }
          />
          <Route
            path="/*"
            element={
              <>
                <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.5),rgba(255,255,255,0))]"></div>
                <ErrorPage />
              </>
            }
          />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
