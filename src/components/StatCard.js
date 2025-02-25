import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const StatCard = ({ title, value, change, color }) => {
  return (
    <Card sx={{ background: color, color: "#fff", borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {change}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
