
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  CssBaseline,
  Button,
} from '@mui/material';
import { Flight as FlightIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import PlanesTable from './components/PlanesTable';
import AdminPage from './components/AdminPage';

function Navigation() {
  const location = useLocation();
  
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <FlightIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Kitchen - Warehouse Management System
        </Typography>
        <Button
          color="inherit"
          component={Link}
          to="/"
          sx={{ mr: 1 }}
          variant={location.pathname === '/' ? 'outlined' : 'text'}
        >
          Planes
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/admin"
          startIcon={<SettingsIcon />}
          variant={location.pathname === '/admin' ? 'outlined' : 'text'}
        >
          Admin
        </Button>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CssBaseline />
        
        <Navigation />

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Routes>
            <Route path="/" element={<PlanesTable />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 2,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme) => theme.palette.grey[100],
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Kitchen Warehouse System
          </Typography>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
