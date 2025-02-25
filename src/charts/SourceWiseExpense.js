import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { collection, getDocs, where } from "firebase/firestore";
import { db, auth } from "../database";

const SourceWiseExpense = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // JS months are 0-based

  const [data, setData] = useState([]);
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [analysisType, setAnalysisType] = useState("monthly"); // "monthly" or "yearly"

  useEffect(() => {
    const fetchExpenses = async () => {
      const user = auth.currentUser;
      const querySnapshot = await getDocs(collection(db, "expenses"), where("userId", "==", user.uid));
      const expenses = querySnapshot.docs.map((doc) => doc.data());

      let filteredExpenses;

      if (analysisType === "monthly") {
        filteredExpenses = expenses.filter((expense) => {
          const date = new Date(expense.createdAt.seconds * 1000);
          return date.getFullYear() === year && date.getMonth() + 1 === month;
        });
      } else {
        // Yearly Analysis: Show data for the entire selected year
        filteredExpenses = expenses.filter((expense) => {
          const date = new Date(expense.createdAt.seconds * 1000);
          return date.getFullYear() === year;
        });
      }

      // Group expenses by source
      const groupedData = filteredExpenses.reduce((acc, expense) => {
        const source = expense.source || "Unknown";
        if (!acc[source]) acc[source] = 0;
        acc[source] += expense.amount;
        return acc;
      }, {});

      // Convert to array format for Recharts
      const formattedData = Object.keys(groupedData).map((source) => ({
        source,
        amount: groupedData[source],
      }));

      setData(formattedData);
    };

    fetchExpenses();
  }, [year, month, analysisType]); // Re-run when year, month, or toggle changes

  return (
    <Card
      sx={{
        backgroundColor: "#fff",
        borderRadius: 3,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        padding: 2,
        margin: 2,
      }}
    >
      <CardContent>
        {/* Header & Toggle */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
            Source-wise Expense Breakdown
          </Typography>

          <ToggleButtonGroup
            value={analysisType}
            exclusive
            onChange={(e, newValue) => newValue && setAnalysisType(newValue)}
            size="small"
          >
            <ToggleButton value="monthly">Monthly</ToggleButton>
            <ToggleButton value="yearly">Yearly</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Filters */}
        <Box display="flex" gap={2} mb={2}>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Year</InputLabel>
            <Select value={year} onChange={(e) => setYear(e.target.value)} label="Year">
              {[...Array(5)].map((_, i) => (
                <MenuItem key={currentYear - i} value={currentYear - i}>
                  {currentYear - i}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {analysisType === "monthly" && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Month</InputLabel>
              <Select value={month} onChange={(e) => setMonth(e.target.value)} label="Month">
                {[
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December",
                ].map((name, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        {/* Chart */}
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="source" stroke="#666" tick={{ fontSize: 12 }} />
              <YAxis stroke="#666" tick={{ fontSize: 12 }} />
              <Tooltip
                wrapperStyle={{
                  backgroundColor: "#fff",
                  color: "#333",
                  borderRadius: 8,
                  padding: 10,
                }}
              />
              <Legend />
              <Bar
                dataKey="amount"
                fill="rgba(136, 132, 216, 0.6)"
                barSize={30}
                radius={[10, 10, 0, 0]} // Rounded top corners
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SourceWiseExpense;
