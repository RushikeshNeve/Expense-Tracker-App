import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, Box, IconButton, Tooltip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BarChartIcon from "@mui/icons-material/BarChart";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useDrawer } from "../components/DrawerContext";
import { signOut } from "firebase/auth";
import { auth } from "../database";
import { useMediaQuery } from "@mui/material";

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowDrawer } = useDrawer();
  const [open, setOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)"); // Detect if screen is mobile-sized

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, route: "/" },
    { text: "Expenses", icon: <ReceiptIcon />, route: "/expenses" },
    { text: "Reports", icon: <BarChartIcon />, route: "/reports" },
    { text: "Quick Actions", icon: <AddIcon />, action: () => setShowDrawer(true) },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const drawerContent = (
    <Box
      sx={{
        background: "linear-gradient(90deg, #2196F3 0%, #4FC3F7 100%)",
        color: "#fff",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Box sx={{ textAlign: "center", py: 3 }}>
          {open && (
            <Typography variant="h6" fontWeight="bold" color="inherit">
              Expense Tracker
            </Typography>
          )}
        </Box>

        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <Tooltip title={open ? "" : item.text} placement="right">
                <ListItemButton
                  onClick={item.action || (() => navigate(item.route))}
                  sx={{
                    color: location.pathname === item.route ? "#1565C0" : "#fff",
                    backgroundColor: location.pathname === item.route ? "#fff" : "transparent",
                    borderRadius: 2,
                    mx: 1.5,
                    my: 0.5,
                    padding: "12px 16px",
                    "&:hover": { backgroundColor: "#fff", color: "#1565C0" },
                  }}
                >
                  <ListItemIcon sx={{ color: location.pathname === item.route ? "#1565C0" : "#fff" }}>
                    {item.icon}
                  </ListItemIcon>
                  {open && <ListItemText primary={item.text} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.4)" }} />

      <Box sx={{ pb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleSignOut}
            sx={{
              color: "#fff",
              padding: "12px 16px",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <LogoutIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Sign Out" />}
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": { width: 250 },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open={open}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: open ? 250 : 80,
              transition: "width 0.3s",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
