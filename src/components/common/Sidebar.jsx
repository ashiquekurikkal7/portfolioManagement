import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Chip
} from '@mui/material';
import {
  Dashboard,
  AccountBalance,
  AddCircle,
  History,
  Assessment,
  Settings,
  TrendingUp,
  PieChart
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../constants/routes';

const drawerWidth = 280;

// Icon mapping
const iconMap = {
  Dashboard: <Dashboard />,
  AccountBalance: <AccountBalance />,
  AddCircle: <AddCircle />,
  History: <History />,
  Assessment: <Assessment />,
  Settings: <Settings />,
  TrendingUp: <TrendingUp />,
  PieChart: <PieChart />
};

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
          borderRight: '1px solid #e0e0e0'
        },
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            ABC Portfolio
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Management System
          </Typography>
        </Box>

        {/* Navigation Menu */}
        <List sx={{ pt: 1 }}>
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1,
                    backgroundColor: isActive ? '#e3f2fd' : 'transparent',
                    color: isActive ? '#1976d2' : 'inherit',
                    '&:hover': {
                      backgroundColor: isActive ? '#e3f2fd' : '#f5f5f5',
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: isActive ? '#1976d2' : 'inherit',
                    minWidth: 40 
                  }}>
                    {iconMap[item.icon]}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title}
                    secondary={item.description}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 'bold' : 'normal',
                      fontSize: '0.9rem'
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.75rem',
                      color: isActive ? '#1976d2' : 'text.secondary'
                    }}
                  />
                  {isActive && (
                    <Chip 
                      label="Active" 
                      size="small" 
                      color="primary" 
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Quick Stats */}
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
            Quick Stats
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Total Value:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              $15,250.00
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Today's P&L:
            </Typography>
            <Typography variant="body2" color="success.main" fontWeight="bold">
              +$125.50
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Active Orders:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              3
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 