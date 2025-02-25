import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BarChartIcon from "@mui/icons-material/BarChart";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";
import { useDrawer } from "../components/DrawerContext";
import { signOut } from "firebase/auth"; // Import signOut function
import { auth } from "../database"; // Import Firebase auth instance

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowDrawer } = useDrawer();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, route: "/" },
    { text: "Expenses", icon: <ReceiptIcon />, route: "/expenses" },
    { text: "Reports", icon: <BarChartIcon />, route: "/reports" },
    { text: "Quick Actions", icon: <AddIcon />, action: () => setShowDrawer(true) },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Drawer
      variant="permanent"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      sx={{
        width: open ? 250 : 90,
        transition: "width 0.3s ease-in-out",
        "& .MuiDrawer-paper": {
          width: open ? 250 : 90,
          transition: "width 0.3s ease-in-out",
          boxSizing: "border-box",
          background: "linear-gradient(90deg, #2196F3 0%, #4FC3F7 100%)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflowX: "hidden",
          borderRight: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: open ? "4px 0 10px rgba(0, 0, 0, 0.1)" : "none",
        },
      }}
    >
      <Box sx={{ textAlign: "center", py: 3 }}>
        {open && (
          <Typography variant="h6" fontWeight="bold" color="inherit">
            Expense Tracker
          </Typography>
        )}
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={item.action || (() => navigate(item.route))}
                sx={{
                  color: location.pathname === item.route ? "#1565C0" : "#fff",
                  backgroundColor: location.pathname === item.route ? "#fff" : "transparent",
                  borderRadius: 2,
                  mx: 1.5,
                  my: 0.5,
                  padding: "12px 16px",
                  transition: "background-color 0.2s ease, color 0.2s ease",
                  "&:hover": { backgroundColor: "#fff", color: "#1565C0" },
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.route ? "#1565C0" : "#fff", transition: "color 0.2s ease" }}>
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.text} sx={{ fontWeight: 500 }} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.4)", my: 2 }} />

      <Box sx={{ pb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleSignOut}
            sx={{
              mx: 1.5,
              color: "#fff",
              padding: "12px 16px",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <LogoutIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Sign Out" sx={{ fontWeight: 500 }} />}
          </ListItemButton>
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
