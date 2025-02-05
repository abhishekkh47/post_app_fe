import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignupForm } from "./components/auth/SignupForm.tsx";
import { Profile } from "./pages/Profile.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth/login" element={<App />} />
        <Route path="/auth/signup" element={<SignupForm />} />
      </Routes>
      <AuthProvider>
        <Routes>
          <Route path="/profile/:userId" element={<Profile />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
