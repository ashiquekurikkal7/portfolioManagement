import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Box,
  InputBase,
  alpha,
  styled,
  Chip,
  Divider,
  Fade,
  Slide,
  Tooltip,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Settings,
  Logout,
  TrendingUp,
  TrendingDown,
  Refresh,
  KeyboardArrowDown
} from '@mui/icons-material';

// Styled search component with enhanced design
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 25,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  transition: 'all 0.3s ease',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(255, 255, 255, 0.8)',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '0.9rem',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.7)',
      opacity: 1,
    },
    [theme.breakpoints.up('md')]: {
      width: '45ch',
    },
  },
}));

// Styled AppBar with gradient background and full width
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #1976d2 100%)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  width: '100vw',
  left: 0,
  right: 0,
  position: 'relative',
}));

const Navbar = ({ user, onMenuClick, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [marketStatus, setMarketStatus] = useState('open');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate market status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const menuId = 'primary-search-account-menu';
  const isMenuOpen = Boolean(anchorEl);

  return (
    <StyledAppBar position="static" elevation={0}>
      <Toolbar sx={{ 
        minHeight: 70, 
        width: '100%', 
        px: { xs: 1, sm: 2, md: 3 },
        maxWidth: '100vw',
        boxSizing: 'border-box'
      }}>
        {/* Menu Toggle Button */}
        <Tooltip title="Toggle Sidebar">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={onMenuClick}
            sx={{ 
              mr: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>

        {/* Brand Logo and Title */}
        <Slide direction="right" in={true} timeout={800}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fff, #e3f2fd)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
            >
              <TrendingUp sx={{ fontSize: 20, color: '#1976d2' }} />
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                fontWeight: 700,
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                letterSpacing: '0.5px',
              }}
            >
              ABC Portfolio
            </Typography>
          </Box>
        </Slide>

        {/* Enhanced Search Bar */}
        <Fade in={true} timeout={1200}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search orders, securities, or portfolios..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
            />
          </Search>
        </Fade>

        <Box sx={{ flexGrow: 1 }} />

        {/* Market Status and Quick Stats */}
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 2, mr: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: marketStatus === 'open' ? '#4caf50' : '#f44336',
                animation: marketStatus === 'open' ? 'pulse 2s infinite' : 'none',
              }}
            />
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
              Market {marketStatus === 'open' ? 'Open' : 'Closed'}
            </Typography>
          </Box>
          
          <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp sx={{ fontSize: 16, color: '#4caf50' }} />
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              +1.2%
            </Typography>
          </Box>
        </Box>

        {/* Balance Display */}
        <Fade in={true} timeout={1400}>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                minWidth: 140,
              }}
            >
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block' }}>
                Available Balance
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                $10,000.00
              </Typography>
            </Box>
          </Box>
        </Fade>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton 
            size="large" 
            color="inherit"
            sx={{ 
              mr: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Refresh Button */}
        <Tooltip title="Refresh Data">
          <IconButton 
            size="large" 
            color="inherit"
            onClick={() => setLastUpdate(new Date())}
            sx={{ 
              mr: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'rotate(180deg)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>

        {/* User Profile */}
        <Tooltip title="Account Settings">
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{ 
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: 'secondary.main',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            >
              {user?.firstName?.charAt(0) || 'U'}
            </Avatar>
            <KeyboardArrowDown sx={{ ml: 0.5, fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Toolbar>

      {/* Enhanced Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 250,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
          }
        }}
      >
        {/* User Info Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48, 
                bgcolor: 'primary.main',
                mr: 2,
                border: '2px solid rgba(25, 118, 210, 0.2)',
              }}
            >
              {user?.firstName?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.role}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label="Online" 
            size="small" 
            color="success" 
            sx={{ fontSize: '0.7rem' }}
          />
        </Box>

        <Divider />

        {/* Menu Items */}
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
          <AccountCircle sx={{ mr: 2, color: 'primary.main' }} />
          <Typography>My Profile</Typography>
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
          <Settings sx={{ mr: 2, color: 'primary.main' }} />
          <Typography>Settings</Typography>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
          <Logout sx={{ mr: 2 }} />
          <Typography>Sign Out</Typography>
        </MenuItem>
      </Menu>

      {/* CSS Animation for pulse effect */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </StyledAppBar>
  );
};

export default Navbar; 