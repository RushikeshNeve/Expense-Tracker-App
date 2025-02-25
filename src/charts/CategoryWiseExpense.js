import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { db } from "../database";
import { collection, getDocs } from "firebase/firestore";

const CategoryWiseExpense = ({ hideAnalysisToggle = false }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [data, setData] = useState([]);
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [analysisType, setAnalysisType] = useState("monthly");

  useEffect(() => {
    const fetchExpenses = async () => {
      const querySnapshot = await getDocs(collection(db, "expenses"));
      let filteredExpenses;

      if (hideAnalysisToggle) {
        // Fetch only current month's data when hideAnalysisToggle is true
        filteredExpenses = querySnapshot.docs.filter((doc) => {
          const expense = doc.data();
          const date = new Date(expense.createdAt.seconds * 1000);
          return date.getFullYear() === currentYear && date.getMonth() + 1 === currentMonth;
        });
      } else {
        // Fetch based on selected filters
        filteredExpenses = querySnapshot.docs.filter((doc) => {
          const expense = doc.data();
          const date = new Date(expense.createdAt.seconds * 1000);
          if (analysisType === "monthly") {
            return date.getFullYear() === year && date.getMonth() + 1 === month;
          } else {
            return date.getFullYear() === year;
          }
        });
      }

      const categoryMap = {};
      filteredExpenses.forEach((doc) => {
        const { category, amount } = doc.data();
        categoryMap[category] = (categoryMap[category] || 0) + amount;
      });

      setData(
        Object.keys(categoryMap).map((key) => ({
          name: key,
          value: categoryMap[key],
        }))
      );
    };

    fetchExpenses();
  }, [year, month, analysisType, hideAnalysisToggle]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" mb={2} px={2}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
          Category-wise Expense Breakdown
        </Typography>

        {/* Hide toggle buttons when hideAnalysisToggle is true */}
        {!hideAnalysisToggle && (
          <ToggleButtonGroup
            value={analysisType}
            exclusive
            onChange={(e, newValue) => newValue && setAnalysisType(newValue)}
            size="small"
            sx={{ backgroundColor: "#fff", borderRadius: 2 }}
          >
            <ToggleButton value="monthly">Monthly</ToggleButton>
            <ToggleButton value="yearly">Yearly</ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>

      {/* Filters (Hide when hideAnalysisToggle is true) */}
      {!hideAnalysisToggle && (
        <Box display="flex" gap={2} width="100%" justifyContent="center" mb={2}>
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
      )}

      {/* Chart */}
      <Box sx={{ width: "100%", height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
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
              dataKey="value"
              fill="rgba(136, 132, 216, 0.6)"
              barSize={30}
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default CategoryWiseExpense;
