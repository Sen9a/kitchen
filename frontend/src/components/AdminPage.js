import React, { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import {
  PlanesTab,
  SquadsTab,
  CommunicationTypesTab,
  VideoTypesTab,
  DroneTypesTab,
} from './admin';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      style={{ height: value === index ? '100%' : 0, display: value === index ? 'block' : 'none' }}
      {...other}
    >
      {value === index && <Box sx={{ p: 2, height: '100%' }}>{children}</Box>}
    </div>
  );
}

// Main Admin Page Component
const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError(null);
  };

  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={2} sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Planes" />
          <Tab label="Squads" />
          <Tab label="Communication Types" />
          <Tab label="Video Types" />
          <Tab label="Drone Types" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ m: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <TabPanel value={activeTab} index={0}>
          <PlanesTab isActive={activeTab === 0} />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <SquadsTab isActive={activeTab === 1} />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <CommunicationTypesTab isActive={activeTab === 2} />
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <VideoTypesTab isActive={activeTab === 3} />
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          <DroneTypesTab isActive={activeTab === 4} />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default AdminPage;
