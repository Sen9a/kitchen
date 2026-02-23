import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  planeApi,
  squadApi,
  communicationApi,
  videoTypeApi,
  droneTypeApi,
  getImageUrl,
} from '../services/api';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

// Generic Data Table Component
const DataTable = ({
  title,
  columns,
  rows,
  loading,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  onRefresh,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const handleSortModelChange = (newSortModel) => {
    if (!newSortModel || newSortModel.length === 0) {
      const currentField = sortModel[0]?.field || columns[0]?.field || 'id';
      const currentSort = sortModel[0]?.sort || 'asc';
      const newSort = currentSort === 'asc' ? 'desc' : 'asc';
      onSortModelChange([{ field: currentField, sort: newSort }]);
    } else {
      onSortModelChange(newSortModel);
    }
  };

  const actionsColumn = {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 120,
    getActions: (params) => [
      <GridActionsCellItem
        icon={
          <Tooltip title="Edit">
            <EditIcon />
          </Tooltip>
        }
        label="Edit"
        onClick={() => onEdit(params.row)}
        showInMenu={false}
      />,
      <GridActionsCellItem
        icon={
          <Tooltip title="Delete">
            <DeleteIcon color="error" />
          </Tooltip>
        }
        label="Delete"
        onClick={() => onDelete(params.row)}
        showInMenu={false}
      />,
    ],
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <Box>
          <Tooltip title="Refresh">
            <IconButton onClick={onRefresh} disabled={loading} sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAdd}
            disabled={loading}
          >
            Add {title}
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={[...columns, actionsColumn]}
          loading={loading}
          rowCount={rowCount}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          slots={{
            loadingOverlay: () => (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

// Generic Form Dialog Component
const FormDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  fields,
  initialData,
  errors,
}) => {
  const [formData, setFormData] = useState(initialData || {});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setFormData(initialData || {});
    // Set initial image preview if exists
    if (initialData?.image_url) {
      setImagePreview(getImageUrl(initialData.image_url));
    } else {
      setImagePreview(null);
    }
  }, [initialData, open]);

  const handleChange = (field) => (event) => {
    if (event.target.type === 'file') {
      const file = event.target.files[0];
      if (file) {
        setFormData({ ...formData, [field]: file });
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      }
    } else {
      setFormData({ ...formData, [field]: event.target.value });
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {fields.map((field) => (
            <Box key={field.name}>
              {field.type === 'file' ? (
                <Box sx={{ mb: 2 }}>
                  {imagePreview && (
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                      <Avatar
                        src={imagePreview}
                        alt="Preview"
                        variant="rounded"
                        sx={{ width: 120, height: 120, margin: '0 auto' }}
                      />
                    </Box>
                  )}
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ mb: 1 }}
                  >
                    {formData[field.name] ? 'Change Image' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleChange(field.name)}
                    />
                  </Button>
                  {formData[field.name] && (
                    <Typography variant="caption" color="text.secondary">
                      Selected: {formData[field.name].name || 'Current image'}
                    </Typography>
                  )}
                  {!!errors?.[field.name] && (
                    <Typography variant="caption" color="error">
                      {errors[field.name]}
                    </Typography>
                  )}
                </Box>
              ) : (
                <TextField
                  margin="dense"
                  label={field.label}
                  type={field.type || 'text'}
                  fullWidth
                  multiline={field.multiline}
                  rows={field.rows}
                  value={formData[field.name] || ''}
                  onChange={handleChange(field.name)}
                  error={!!errors?.[field.name]}
                  helperText={errors?.[field.name]}
                  required={field.required}
                  select={field.select}
                  SelectProps={field.select ? { 
                    native: true,
                  } : undefined}
                  InputLabelProps={field.select ? {
                    shrink: true
                  } : undefined}
                >
                  {field.select && field.options?.length === 0 && (
                    <option value="" disabled style={{ color: 'white' }}>&nbsp;</option>
                  )}
                  {field.select &&
                    field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </TextField>
              )}
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Delete Confirmation Dialog
const DeleteDialog = ({ open, onClose, onConfirm, itemName }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

// Main Admin Page Component
const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);

  // Common state for all tables
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState([{ field: 'id', sort: 'asc' }]);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Reference data for dropdowns
  const [squads, setSquads] = useState([]);
  const [communicationTypes, setCommunicationTypes] = useState([]);
  const [videoTypes, setVideoTypes] = useState([]);
  const [droneTypes, setDroneTypes] = useState([]);
  const [refDataLoading, setRefDataLoading] = useState(false);

  const fetchReferenceData = async () => {
    if (refDataLoading) return; // Prevent duplicate calls
    setRefDataLoading(true);
    try {
      console.log('Fetching reference data...');
      const [squadsRes, commRes, videoRes, droneRes] = await Promise.all([
        squadApi.getAll({}, 100, 0),
        communicationApi.getAll({}, 100, 0),
        videoTypeApi.getAll({}, 100, 0),
        droneTypeApi.getAll({}, 100, 0),
      ]);

      const squadsData = squadsRes.results || squadsRes || [];
      const commData = commRes.results || commRes || [];
      const videoData = videoRes.results || videoRes || [];
      const droneData = droneRes.results || droneRes || [];

      console.log('Reference data loaded:', {
        squads: squadsData.length,
        communicationTypes: commData.length,
        videoTypes: videoData.length,
        droneTypes: droneData.length,
      });

      setSquads(squadsData);
      setCommunicationTypes(commData);
      setVideoTypes(videoData);
      setDroneTypes(droneData);
    } catch (err) {
      console.error('Error fetching reference data:', err);
      setError('Failed to load reference data. Please refresh the page.');
    } finally {
      setRefDataLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const safePage = paginationModel.page || 0;
      const safePageSize = paginationModel.pageSize || 10;
      const limit = safePageSize;
      const offset = safePage * safePageSize;

      let ordering = null;
      if (sortModel && sortModel.length > 0) {
        const { field, sort: direction } = sortModel[0];
        ordering = `${field}.${direction}`;
      }

      let response;
      switch (activeTab) {
        case 0: // Planes
          response = await planeApi.getAll({}, limit, offset, ordering);
          break;
        case 1: // Squads
          response = await squadApi.getAll({}, limit, offset, ordering);
          break;
        case 2: // Communication Types
          response = await communicationApi.getAll({}, limit, offset, ordering);
          break;
        case 3: // Video Types
          response = await videoTypeApi.getAll({}, limit, offset, ordering);
          break;
        case 4: // Drone Types
          response = await droneTypeApi.getAll({}, limit, offset, ordering);
          break;
        default:
          response = { results: [], count: 0 };
      }

      if (response && Array.isArray(response.results)) {
        setRows(response.results);
        setRowCount(response.count || response.results.length);
      } else if (Array.isArray(response)) {
        setRows(response);
        setRowCount(response.length);
      } else {
        setRows([]);
        setRowCount(0);
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reference data on mount
  useEffect(() => {
    fetchReferenceData();
  }, []);

  // Fetch data when tab or pagination/sort changes
  useEffect(() => {
    fetchData();
  }, [activeTab, paginationModel, sortModel]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPaginationModel({ page: 0, pageSize: 10 });
    setSortModel([{ field: 'id', sort: 'asc' }]);
    setError(null);
  };

  const handleAdd = async () => {
    setSelectedItem(null);
    setFormErrors({});
    
    // Fetch reference data if not loaded yet
    if (droneTypes.length === 0 || communicationTypes.length === 0 || 
        videoTypes.length === 0 || squads.length === 0) {
      console.log('Fetching reference data before opening form...');
      await fetchReferenceData();
    }
    
    console.log('Opening form with reference data:', {
      droneTypes: droneTypes.length,
      communicationTypes: communicationTypes.length,
      videoTypes: videoTypes.length,
      squads: squads.length,
    });
    
    setFormOpen(true);
  };

  const handleEdit = async (item) => {
    setSelectedItem(item);
    setFormErrors({});
    
    // Fetch reference data if not loaded yet
    if (droneTypes.length === 0 || communicationTypes.length === 0 || 
        videoTypes.length === 0 || squads.length === 0) {
      await fetchReferenceData();
    }
    
    setFormOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormErrors({});

      switch (activeTab) {
        case 0: // Planes
          // Prepare plane data
          const planeData = {
            name: formData.name,
            type: formData.drone_type || undefined,
            communication: formData.communication_type || undefined,
            video_type_id: formData.video_type || undefined,
            squad: formData.squad || undefined,
          };
          
          // Handle image file if present
          const imageFile = formData.image instanceof File ? formData.image : null;
          
          if (selectedItem) {
            await planeApi.update(selectedItem.id, planeData, imageFile);
          } else {
            await planeApi.create(planeData, imageFile);
          }
          break;
        case 1: // Squads
          if (selectedItem) {
            await squadApi.update(selectedItem.id, formData);
          } else {
            await squadApi.create(formData);
          }
          break;
        case 2: // Communication Types
          if (selectedItem) {
            await communicationApi.update(selectedItem.id, formData);
          } else {
            await communicationApi.create(formData);
          }
          break;
        case 3: // Video Types
          if (selectedItem) {
            await videoTypeApi.update(selectedItem.id, formData);
          } else {
            await videoTypeApi.create(formData);
          }
          break;
        case 4: // Drone Types
          if (selectedItem) {
            await droneTypeApi.update(selectedItem.id, formData);
          } else {
            await droneTypeApi.create(formData);
          }
          break;
        default:
          break;
      }

      setFormOpen(false);
      fetchData();
    } catch (err) {
      if (err.response?.data) {
        setFormErrors(err.response.data);
      } else {
        setError('Failed to save. Please try again.');
      }
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      switch (activeTab) {
        case 0:
          await planeApi.delete(selectedItem.id);
          break;
        case 1:
          await squadApi.delete(selectedItem.id);
          break;
        case 2:
          await communicationApi.delete(selectedItem.id);
          break;
        case 3:
          await videoTypeApi.delete(selectedItem.id);
          break;
        case 4:
          await droneTypeApi.delete(selectedItem.id);
          break;
        default:
          break;
      }
      setDeleteOpen(false);
      fetchData();
    } catch (err) {
      setError('Failed to delete. Please try again.');
    }
  };

  // Define columns and fields for each tab
  const getColumns = () => {
    switch (activeTab) {
      case 0: // Planes
        return [
          { field: 'id', headerName: 'ID', width: 70 },
          {
            field: 'image_url',
            headerName: 'Image',
            width: 80,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
              const imageUrl = getImageUrl(params.value);
              return (
                <Avatar
                  src={imageUrl}
                  alt={params.row.name || 'Plane'}
                  variant="rounded"
                  sx={{ width: 50, height: 50 }}
                >
                  {!imageUrl && <span role="img" aria-label="plane">✈️</span>}
                </Avatar>
              );
            },
          },
          { field: 'name', headerName: 'Name', width: 200, flex: 1 },
          {
            field: 'drone_type',
            headerName: 'Drone Type',
            width: 150,
            valueGetter: (params) => params.row?.drone_type?.name || 'N/A',
          },
          {
            field: 'communication_type',
            headerName: 'Communication',
            width: 150,
            valueGetter: (params) => params.row?.communication_type?.name || 'N/A',
          },
          {
            field: 'video_type',
            headerName: 'Video Type',
            width: 150,
            valueGetter: (params) => params.row?.video_type?.name || 'N/A',
          },
          {
            field: 'squad',
            headerName: 'Squad',
            width: 150,
            valueGetter: (params) => params.row?.squad?.name || 'N/A',
          },
        ];
      case 1: // Squads
        return [
          { field: 'id', headerName: 'ID', width: 70 },
          { field: 'name', headerName: 'Name', width: 200, flex: 1 },
          { field: 'description', headerName: 'Description', width: 300, flex: 2 },
        ];
      case 2: // Communication Types
        return [
          { field: 'id', headerName: 'ID', width: 70 },
          { field: 'name', headerName: 'Name', width: 200, flex: 1 },
          { field: 'description', headerName: 'Description', width: 300, flex: 2 },
        ];
      case 3: // Video Types
        return [
          { field: 'id', headerName: 'ID', width: 70 },
          { field: 'name', headerName: 'Name', width: 200, flex: 1 },
          { field: 'description', headerName: 'Description', width: 300, flex: 2 },
        ];
      case 4: // Drone Types
        return [
          { field: 'id', headerName: 'ID', width: 70 },
          { field: 'name', headerName: 'Name', width: 200, flex: 1 },
          { field: 'description', headerName: 'Description', width: 300, flex: 2 },
        ];
      default:
        return [];
    }
  };

  const getFormFields = () => {
    switch (activeTab) {
      case 0: // Planes
        return [
          { name: 'name', label: 'Name', required: true },
          { name: 'image', label: 'Image', type: 'file' },
          {
            name: 'drone_type',
            label: 'Drone Type',
            select: true,
            options: droneTypes.map((t) => ({ value: t.id, label: t.name })),
          },
          {
            name: 'communication_type',
            label: 'Communication Type',
            select: true,
            options: communicationTypes.map((t) => ({ value: t.id, label: t.name })),
          },
          {
            name: 'video_type',
            label: 'Video Type',
            select: true,
            options: videoTypes.map((t) => ({ value: t.id, label: t.name })),
          },
          {
            name: 'squad',
            label: 'Squad',
            select: true,
            options: squads.map((s) => ({ value: s.id, label: s.name })),
          },
        ];
      case 1: // Squads
        return [
          { name: 'name', label: 'Name', required: true },
          { name: 'description', label: 'Description', multiline: true, rows: 3 },
        ];
      case 2: // Communication Types
        return [
          { name: 'name', label: 'Name', required: true },
          { name: 'description', label: 'Description', multiline: true, rows: 3 },
        ];
      case 3: // Video Types
        return [
          { name: 'name', label: 'Name', required: true },
          { name: 'description', label: 'Description', multiline: true, rows: 3 },
        ];
      case 4: // Drone Types
        return [
          { name: 'name', label: 'Name', required: true },
          { name: 'description', label: 'Description', multiline: true, rows: 3 },
        ];
      default:
        return [];
    }
  };

  const getTabTitle = () => {
    const titles = ['Plane', 'Squad', 'Communication Type', 'Video Type', 'Drone Type'];
    return titles[activeTab] || 'Item';
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={2}>
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
          <DataTable
            title="Planes"
            columns={getColumns()}
            rows={activeTab === 0 ? rows : []}
            loading={activeTab === 0 && loading}
            rowCount={activeTab === 0 ? rowCount : 0}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            onRefresh={fetchData}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <DataTable
            title="Squads"
            columns={getColumns()}
            rows={activeTab === 1 ? rows : []}
            loading={activeTab === 1 && loading}
            rowCount={activeTab === 1 ? rowCount : 0}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            onRefresh={fetchData}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <DataTable
            title="Communication Types"
            columns={getColumns()}
            rows={activeTab === 2 ? rows : []}
            loading={activeTab === 2 && loading}
            rowCount={activeTab === 2 ? rowCount : 0}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            onRefresh={fetchData}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <DataTable
            title="Video Types"
            columns={getColumns()}
            rows={activeTab === 3 ? rows : []}
            loading={activeTab === 3 && loading}
            rowCount={activeTab === 3 ? rowCount : 0}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            onRefresh={fetchData}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          <DataTable
            title="Drone Types"
            columns={getColumns()}
            rows={activeTab === 4 ? rows : []}
            loading={activeTab === 4 && loading}
            rowCount={activeTab === 4 ? rowCount : 0}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            onRefresh={fetchData}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabPanel>
      </Paper>

      <FormDialog
        key={`form-${activeTab}-${droneTypes.length}-${communicationTypes.length}-${videoTypes.length}-${squads.length}`}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        title={`${selectedItem ? 'Edit' : 'Add'} ${getTabTitle()}`}
        fields={getFormFields()}
        initialData={selectedItem}
        errors={formErrors}
      />

      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedItem?.name || `ID: ${selectedItem?.id}`}
      />
    </Box>
  );
};

export default AdminPage;
