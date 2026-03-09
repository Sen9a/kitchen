import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
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
  filterModel,
  onFilterModelChange,
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

      <Box sx={{ height: 'calc(100vh - 220px)', width: '100%', minHeight: 400 }}>
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
          filterMode="server"
          filterModel={filterModel}
          onFilterModelChange={onFilterModelChange}
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
        />
      </Box>
    </Box>
  );
};

export default DataTable;
