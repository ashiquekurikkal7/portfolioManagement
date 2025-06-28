import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Fade,
  Slide,
  Container
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  AccountCircle,
  TrendingUp,
  Security,
  Speed
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }


    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (formData.email === 'admin@abc.com' && formData.password === 'password123') {
        const user = {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: formData.email,
          role: 'Portfolio Manager',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        onLogin(user);
        navigate('/');
      } else {
        setError('Invalid email or password. Use admin@abc.com / password123');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        }
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
            alignItems: 'center',
            minHeight: '100vh',
            py: 4
          }}
        >
          {/* Left Side - Branding */}
          <Slide direction="right" in={true} timeout={1000}>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'white',
                p: 4
              }}
            >
              <Fade in={true} timeout={1500}>
                <Box>
                  <TrendingUp sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 700,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                      mb: 2
                    }}
                  >
                    ABC Portfolio
                  </Typography>
                  <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 300,
                      opacity: 0.9,
                      mb: 3
                    }}
                  >
                    Management System
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      opacity: 0.8,
                      maxWidth: 400,
                      lineHeight: 1.6
                    }}
                  >
                    Professional portfolio management and trading platform for modern investors
                  </Typography>

                  {/* Feature highlights */}
                  <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Security sx={{ fontSize: 24, opacity: 0.8 }} />
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        Secure & Reliable Trading
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <TrendingUp sx={{ fontSize: 24, opacity: 0.8 }} />
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        Real-time Portfolio Analytics
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Speed sx={{ fontSize: 24, opacity: 0.8 }} />
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        High-Performance Platform
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Fade>
            </Box>
          </Slide>

          {/* Right Side - Login Form */}
          <Slide direction="left" in={true} timeout={1000}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2
              }}
            >
              <Paper
                elevation={24}
                sx={{
                  p: 4,
                  width: '100%',
                  maxWidth: 450,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  }
                }}
              >
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    <AccountCircle sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Welcome Back
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign in to access your portfolio dashboard
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  {error && (
                    <Fade in={true}>
                      <Alert 
                        severity="error" 
                        sx={{ 
                          mb: 3,
                          borderRadius: 2,
                          '& .MuiAlert-icon': {
                            fontSize: 20
                          }
                        }}
                      >
                        {error}
                      </Alert>
                    </Fade>
                  )}

                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePassword}
                            edge="end"
                            sx={{ color: 'primary.main' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
                        boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <Box 
                  sx={{ 
                    mt: 4, 
                    p: 3, 
                    bgcolor: 'grey.50', 
                    borderRadius: 2,
                    border: '1px solid rgba(0,0,0,0.1)'
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    <strong>Demo Credentials:</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email: admin@abc.com
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Password: password123
                  </Typography>
                </Box>

                {/* Footer */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    © 2024 ABC Portfolio Management System
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Slide>
        </Box>
      </Container>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default Login; 