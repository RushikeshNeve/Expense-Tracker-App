import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import ExpensesPage from "./pages/ExpensesPage";
import ExpenseReport from "./pages/ExpenseReports";
import Dashboard from "./pages/Dashboard";
import AddExpenseDrawer from "./pages/AddExpense";
import { DrawerProvider, useDrawer } from "./components/DrawerContext";
import { AuthProvider, useAuth } from "./components/AuthContext";
import LandingPage from "./pages/LandingPage";
import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const App = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AuthProvider>
      <DrawerProvider>
        <Router>
          <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerToggle}
                    edge="start"
                    sx={{ display: { sm: "none" } }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Expense Tracker 
                  </Typography>
                </Toolbar>
              </AppBar>
              <Toolbar /> {/* This is needed to push content below the AppBar */}
              <Box sx={{ flexGrow: 1, overflow: 'auto', padding: 3 }}>
                <Routes>
                  <Route path="/login" element={<LandingPage />} />
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/expenses" element={<ExpensesPage />} />
                  <Route path="/reports" element={<ExpenseReport />} />
                </Routes>
              </Box>
            </Box>
          </div>
        </Router>
      </DrawerProvider>
    </AuthProvider>
  );
};

export default App;
