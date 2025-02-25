import React, { useState, useEffect } from "react";
import { Drawer, Box, Typography, TextField, Button, IconButton, MenuItem } from "@mui/material";
import { Close } from "@mui/icons-material";
import { db } from "../database"; // Import your database instance
import { collection, getDocs } from "firebase/firestore";

const FilterDrawer = ({ open, onClose, filter, setFilter, applyFilters, resetFilters }) => {
  // Local filter state
  const [localFilter, setLocalFilter] = useState(filter);
  const [categories, setCategories] = useState([]); // Store categories from DB

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoryList = querySnapshot.docs.map((doc) => doc.data().categoryName);
        setCategories(["ALL", ...categoryList]); // Default as "ALL"
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setLocalFilter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Apply filters and close drawer
  const handleApplyFilters = () => {
    setFilter(localFilter);
    applyFilters(localFilter);
    onClose();
  };

  // Reset filters and close drawer
  const handleResetFilters = () => {
    const defaultFilter = { category: "ALL", minAmount: "", maxAmount: "", date: "", month: "" };
    setLocalFilter(defaultFilter);
    setFilter(defaultFilter);
    resetFilters();
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 320, p: 3, position: "relative" }}>
        
        {/* Close Button */}
        <IconButton sx={{ position: "absolute", top: 10, right: 10 }} onClick={onClose}>
          <Close />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 2 }}>Filter Expenses</Typography>

        {/* Category Filter */}
        <TextField
          label="Category"
          name="category"
          fullWidth
          select
          value={localFilter.category}
          onChange={handleChange}
          margin="normal"
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>

        {/* Min & Max Amount */}
        <TextField
          label="Min Amount"
          name="minAmount"
          type="number"
          fullWidth
          value={localFilter.minAmount}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="Max Amount"
          name="maxAmount"
          type="number"
          fullWidth
          value={localFilter.maxAmount}
          onChange={handleChange}
          margin="normal"
        />

        {/* Date Filter */}
        <TextField
          label="Date"
          name="date"
          type="date"
          fullWidth
          value={localFilter.date}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        {/* Month Filter */}
        <TextField
          label="Month"
          name="month"
          type="month"
          fullWidth
          value={localFilter.month}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        {/* Buttons */}
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button onClick={handleResetFilters} variant="outlined" color="secondary">
            Reset
          </Button>
          <Button onClick={handleApplyFilters} variant="contained" color="primary">
            Apply
          </Button>
        </Box>

      </Box>
    </Drawer>
  );
};

export default FilterDrawer;
