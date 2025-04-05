import React from "react";
import { Container, Grid, Paper, Typography, Box, useMediaQuery } from "@mui/material";
import CategoryWiseExpense from "../charts/CategoryWiseExpense";
import MonthlyExpenseTrend from "../charts/MonthlyExpenseTrend";
import WeeklySpendingTrend from "../charts/WeeklySpendingTrend";
import SourceWiseExpense from "../charts/SourceWiseExpense";
import TabComponent from "../components/Tabs";
import { useTheme } from "@mui/material/styles";

const ExpenseReport = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detects screens smaller than 600px (Mobile devices)

  return (
    <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 4, px: isMobile ? 1 : 3 }}>
      <TabComponent activeTab="reports"/>
      
      {/* Header Section with Gradient */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #2196F3 0%, #4FC3F7 100%)",
          color: "#fff",
          borderRadius: 2,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          py: 2,
          textAlign: "center",
          mb: 3,
        }}
      >
        <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
          Expense Report
        </Typography>
      </Box>

      <Grid container spacing={isMobile ? 2 : 3}>
        {/* Category-wise Expense */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: isMobile ? 2 : 3,
              borderRadius: 3,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="h6" align="center" fontWeight="bold" mb={2}>
              Category-wise Expense Distribution
            </Typography>
            <CategoryWiseExpense />
          </Paper>
        </Grid>

        {/* Monthly Expense Trend */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: isMobile ? 2 : 3,
              borderRadius: 3,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="h6" align="center" fontWeight="bold" mb={2}>
              Monthly Expense Trend
            </Typography>
            <MonthlyExpenseTrend />
          </Paper>
        </Grid>

        {/* Weekly Spending Trend */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: isMobile ? 2 : 3,
              borderRadius: 3,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="h6" align="center" fontWeight="bold" mb={2}>
              Weekly Spending Trend
            </Typography>
            <WeeklySpendingTrend />
          </Paper>
        </Grid>

        {/* Source-wise Expense Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: isMobile ? 2 : 3,
              borderRadius: 3,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="h6" align="center" fontWeight="bold" mb={2}>
              Source-wise Expense Breakdown
            </Typography>
            <SourceWiseExpense />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ExpenseReport;
