import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import CreateAccount from "./pages/CreateAccount";
import ForgotPassword from "./pages/ForgotPassword";  // ✅ Import ForgotPassword
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Calculator from "./pages/Calculator";
import GuestCalculator from "./pages/GuestCalculator";
import Profile from "./pages/Profile";
import FAQs from "./pages/FAQs";
import Results from "./pages/Results";
import { ResultsProvider } from "./context/ResultsContext";
import { AuthProvider } from "./context/AuthContext";
import GuestResults from "./pages/GuestResults";

export default function App() {
  return (
    <AuthProvider>
        <ResultsProvider>
            <Routes>
              {/* Wrap all pages inside Layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="sign-in" element={<SignIn />} />
                <Route path="create-account" element={<CreateAccount />} />
                <Route path="forgot-password" element={<ForgotPassword />} /> {/* ✅ Add Forgot Password Route */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="reports" element={<Reports />} />
                <Route path="guest-calculator" element={<GuestCalculator />} />
                <Route path="calculator" element={<Calculator />} />
                <Route path="profile" element={<Profile />} />
                <Route path="faqs" element={<FAQs />} />
                <Route path="/results/:reportId" element={<Results />} />
                <Route path="/guest-results" element={<GuestResults />} />
              </Route>
            </Routes>
    </ResultsProvider>
    </AuthProvider>   
  );
}
