import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ViewProfile from "./pages/ViewProfile";
import ViewCustomer from "./pages/ViewCustomer";
import AddCustomer from "./pages/AddCustomer";
import Guide from "./pages/Guide";
import ContactUs from "./pages/ContactUs";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<ViewProfile />} />
            <Route path="/customers" element={<ViewCustomer />} />
            <Route path="/customers/new" element={<AddCustomer />} />
            <Route path="/customers/:id/edit" element={<AddCustomer />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/contact" element={<ContactUs />} />
          </Route>

          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
