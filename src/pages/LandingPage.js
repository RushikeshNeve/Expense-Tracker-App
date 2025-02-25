import React, { useEffect } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { auth } from "../database"; // Ensure Firebase is configured properly
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Left Section - Login */}
      <Grid item xs={12} md={4} sx={{
        display: "flex", 
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(90deg, #2196F3 0%, #4FC3F7 100%)",
        padding: 5,
        color: "white",
        textAlign: "center",
        boxShadow: "2px 0px 10px rgba(0, 0, 0, 0.1)",
      }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom sx={{
          textTransform: "uppercase",
          letterSpacing: "1px",
          fontSize: "2rem",
        }}>
          Welcome to Expense Tracker
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, mb: 4, fontSize: "1.1rem" }}>
          Track and manage your expenses effortlessly with insightful analytics.
        </Typography>
        <Button
          variant="contained"
          startIcon={<FcGoogle />}
          onClick={handleGoogleLogin}
          sx={{
            mt: 2,
            background: "linear-gradient(45deg, #FFC107, #FF9800)",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            textTransform: "none",
            padding: "12px 24px",
            borderRadius: "50px",
            boxShadow: "0px 5px 20px rgba(255, 152, 0, 0.5)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              background: "linear-gradient(45deg, #FF9800, #F57C00)",
              boxShadow: "0px 8px 25px rgba(255, 152, 0, 0.7)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Log in with Google
        </Button>
      </Grid>

      {/* Right Section - Image */}
      <Grid item xs={12} md={8} sx={{
        backgroundImage: 'url("/loginImage3.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      </Grid>
    </Grid>
  );
};

export default Login;
