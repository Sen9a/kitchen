import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Tooltip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { planeApi, getImageUrl } from '../services/api';

const PlanesTable = () => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planeToDelete, setPlaneToDelete] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState([{ field: 'id', sort: 'asc' }]);

  const handleSortModelChange = (newSortModel) => {
    // If user tries to clear sort (third click), keep the field and toggle direction
    if (!newSortModel || newSortModel.length === 0) {
      const currentField = sortModel[0]?.field || 'id';
      const currentSort = sortModel[0]?.sort || 'asc';
      // Toggle between asc and desc only (no unsorted state)
      const newSort = currentSort === 'asc' ? 'desc' : 'asc';
      setSortModel([{ field: currentField, sort: newSort }]);
    } else {
      setSortModel(newSortModel);
    }
  };

  const fetchPlanes = async (page = 0, pageSize = 10, sort = sortModel) => {
    setLoading(true);
    setError(null);
    try {
      const safePage = page || 0;
      const safePageSize = pageSize || 10;
      const limit = safePageSize;
      const offset = safePage * safePageSize;
      
      // Build ordering string from sort model (format: field.asc or field.desc)
      let ordering = null;
      if (sort && sort.length > 0) {
        const { field, sort: direction } = sort[0];
        ordering = `${field}.${direction}`;
      }
      
      const data = await planeApi.getAll({}, limit, offset, ordering);
      // Handle both paginated response formats: { results: [], count: number } or plain array
      if (data && Array.isArray(data.results)) {
        setPlanes(data.results);
        setRowCount(data.count || data.results.length);
      } else if (Array.isArray(data)) {
        setPlanes(data);
        setRowCount(data.length);
      } else {
        setPlanes([]);
        setRowCount(0);
      }
    } catch (err) {
      setError('Failed to fetch planes. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanes(paginationModel.page, paginationModel.pageSize, sortModel);
  }, [paginationModel, sortModel]);

  const handleDeleteClick = (id) => {
    setPlaneToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (planeToDelete) {
      try {
        await planeApi.delete(planeToDelete);
        setPlanes(planes.filter((plane) => plane.id !== planeToDelete));
      } catch (err) {
        setError('Failed to delete plane. Please try again.');
      }
    }
    setDeleteDialogOpen(false);
    setPlaneToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPlaneToDelete(null);
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      type: 'number',
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'image_url',
      headerName: 'Image',
      width: 100,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const imageUrl = getImageUrl(params.value);
        return (
          <Avatar
            src={imageUrl}
            alt={params.row.name || 'Plane'}
            variant="rounded"
            sx={{ width: 60, height: 60 }}
          >
            {!imageUrl && <span role="img" aria-label="plane">✈️</span>}
          </Avatar>
        );
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body1" fontWeight={500}>
          {params.value || 'Unnamed Plane'}
        </Typography>
      ),
    },
    {
      field: 'drone_type',
      headerName: 'Drone Type',
      width: 150,
      renderCell: (params) => (
        params.value ? (
          <Chip 
            label={params.value.name} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        ) : (
          <Chip label="N/A" size="small" variant="outlined" disabled />
        )
      ),
    },
    {
      field: 'communication_type',
      headerName: 'Communication',
      width: 150,
      renderCell: (params) => (
        params.value ? (
          <Chip 
            label={params.value.name} 
            size="small" 
            color="secondary" 
            variant="outlined"
          />
        ) : (
          <Chip label="N/A" size="small" variant="outlined" disabled />
        )
      ),
    },
    {
      field: 'video_type',
      headerName: 'Video Type',
      width: 150,
      renderCell: (params) => (
        params.value ? (
          <Chip 
            label={params.value.name} 
            size="small" 
            color="info" 
            variant="outlined"
          />
        ) : (
          <Chip label="N/A" size="small" variant="outlined" disabled />
        )
      ),
    },
    {
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
          onClick={() => console.log('Edit', params.id)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Delete">
              <DeleteIcon color="error" />
            </Tooltip>
          }
          label="Delete"
          onClick={() => handleDeleteClick(params.id)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1" gutterBottom>
            ✈️ Planes Management
          </Typography>
          <Box>
            <Tooltip title="Refresh">
              <IconButton onClick={() => fetchPlanes(paginationModel.page, paginationModel.pageSize)} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add New Plane">
              <IconButton color="primary" onClick={() => console.log('Add new plane')}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={planes}
            columns={columns}
            loading={loading}
            rowCount={rowCount}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortingMode="server"
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            pageSizeOptions={[5, 10, 25, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            slots={{
              loadingOverlay: () => (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress />
                </Box>
              ),
            }}
            sx={{
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
            }}
          />
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete plane #{planeToDelete}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlanesTable;
