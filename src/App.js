import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import ExpensesPage from "./pages/ExpensesPage";
import ExpenseReport from "./pages/ExpenseReports";
import Dashboard from "./pages/Dashboard";
import AddExpenseDrawer from "./pages/AddExpense";
import { DrawerProvider, useDrawer } from "./components/DrawerContext";
import { AuthProvider, useAuth } from "./components/AuthContext"; // Import Auth Context
import LandingPage from "./pages/LandingPage";

const MainContent = () => {
  const { showDrawer, setShowDrawer } = useDrawer();
  const { user, loading } = useAuth(); // Get user data

  if (loading) return <div>Loading...</div>; // Show loading until Firebase loads user status
  if (!user) return <Navigate to="/login" replace />; // Redirect to login if not authenticated

  return (
    <div style={{ flexGrow: 1, padding: "20px" }}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/reports" element={<ExpenseReport />} />
      </Routes>
      <AddExpenseDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <DrawerProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LandingPage />} />
            <Route
              path="/*"
              element={
                <div style={{ display: "flex" }}>
                  <Sidebar />
                  <MainContent />
                </div>
              }
            />
          </Routes>
        </Router>
      </DrawerProvider>
    </AuthProvider>
  );
};

export default App;
