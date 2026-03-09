import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { droneTypeApi } from '../../services/api';
import DataTable from './DataTable';
import FormDialog from './FormDialog';
import DeleteDialog from './DeleteDialog';

const columns = [
  { 
    field: 'name', 
    headerName: 'Name', 
    width: 200, 
    flex: 1,
    filterable: true,
  },
  { 
    field: 'description', 
    headerName: 'Description', 
    width: 300, 
    flex: 2,
    filterable: true,
  },
];

const formFields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'description', label: 'Description', multiline: true, rows: 3 },
];

// Convert MUI filter model to API filter params
const buildFilters = (filterModel) => {
  const filters = {};
  
  if (!filterModel || !filterModel.items || filterModel.items.length === 0) {
    return filters;
  }
  
  filterModel.items.forEach((filter) => {
    const { field, operator, value } = filter;
    if (!value && value !== '') return;
    
    switch (operator) {
      case 'contains':
        // Use _ilike for name field
        if (field === 'name') {
          filters[`${field}_ilike`] = value;
        } else {
          filters[`${field}__icontains`] = value;
        }
        break;
      case 'equals':
        filters[`${field}__iexact`] = value;
        break;
      case 'startsWith':
        filters[`${field}__istartswith`] = value;
        break;
      case 'endsWith':
        filters[`${field}__iendswith`] = value;
        break;
      default:
        filters[field] = value;
    }
  });
  
  return filters;
};

const DroneTypesTab = ({ isActive }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState([{ field: 'name', sort: 'asc' }]);
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const fetchData = useCallback(async () => {
    if (!isActive) return;
    
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

      const filters = buildFilters(filterModel);

      const response = await droneTypeApi.getAll(filters, limit, offset, ordering);

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
  }, [isActive, paginationModel, sortModel, filterModel]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setSelectedItem(null);
    setFormErrors({});
    setFormOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormErrors({});
    setFormOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormErrors({});
      
      if (selectedItem) {
        await droneTypeApi.update(selectedItem.id, formData);
      } else {
        await droneTypeApi.create(formData);
      }

      setFormOpen(false);
      fetchData();
    } catch (err) {
      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.detail && Array.isArray(errorData.detail)) {
          const fieldErrors = {};
          errorData.detail.forEach((item) => {
            const fieldName = Object.keys(item)[0];
            const errorMessage = item[fieldName];
            fieldErrors[fieldName] = errorMessage;
          });
          setFormErrors(fieldErrors);
        } else {
          setFormErrors(errorData);
        }
      } else {
        setError('Failed to save. Please try again.');
      }
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await droneTypeApi.delete(selectedItem.id);
      setDeleteOpen(false);
      fetchData();
    } catch (err) {
      setError('Failed to delete. Please try again.');
    }
  };

  return (
    <Box>
      <DataTable
        title="Drone Types"
        columns={columns}
        rows={rows}
        loading={loading}
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        onRefresh={fetchData}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        title={`${selectedItem ? 'Edit' : 'Add'} Drone Type`}
        fields={formFields}
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

export default DroneTypesTab;
