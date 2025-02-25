import React, { useEffect, useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const routes = ["/", "/expenses", "/reports"];

const TabComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [tabIndex, setTabIndex] = useState(0);

    // Sync active tab with the current URL
    useEffect(() => {
        const currentIndex = routes.indexOf(location.pathname);
        if (currentIndex !== -1) {
            setTabIndex(currentIndex);
        }
    }, [location.pathname]);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
        navigate(routes[newValue]);
    };

    return (
        <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
            <Tab label="Dashboard" />
            <Tab label="Expenses" />
            <Tab label="Reports" />
        </Tabs>
    );
};

export default TabComponent;
