import React, { useState, useEffect, useCallback } from 'react';
import { Box, Avatar, Tooltip } from '@mui/material';
import { planeApi, squadApi, communicationApi, videoTypeApi, droneTypeApi, getImageUrl } from '../../services/api';
import DataTable from './DataTable';
import FormDialog from './FormDialog';
import DeleteDialog from './DeleteDialog';

const getColumns = (droneTypes, communicationTypes, videoTypes) => [
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
  { 
    field: 'name', 
    headerName: 'Name', 
    width: 200, 
    flex: 1,
    filterable: true,
  },
  {
    field: 'drone_type',
    headerName: 'Drone Type',
    width: 150,
    valueGetter: (params) => params.row?.drone_type?.name || 'N/A',
    filterable: true,
    filterOperators: ['contains', 'equals'],
  },
  {
    field: 'communication_type',
    headerName: 'Communication',
    width: 150,
    valueGetter: (params) => params.row?.communication_type?.name || 'N/A',
    filterable: true,
    filterOperators: ['contains', 'equals'],
  },
  {
    field: 'video_type',
    headerName: 'Video Type',
    width: 150,
    valueGetter: (params) => params.row?.video_type?.name || 'N/A',
    filterable: true,
    filterOperators: ['contains', 'equals'],
  },
  {
    field: 'squads',
    headerName: 'Squads',
    width: 200,
    filterable: false,
    renderCell: (params) => {
      const squads = params.value || [];
      if (squads.length === 0) {
        return 'N/A';
      }
      return (
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 0.5, 
            flexWrap: 'wrap',
            maxHeight: 50,
            overflow: 'auto',
            alignItems: 'center',
            py: 0.5,
          }}
        >
          {squads.map((squad) => (
            <Tooltip key={squad.id} title={squad.name}>
              <Avatar
                sx={{ width: 32, height: 32, fontSize: 14, bgcolor: 'primary.main', flexShrink: 0 }}
              >
                {squad.name.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          ))}
        </Box>
      );
    },
  },
];

// Convert MUI filter model to API filter params
const buildFilters = (filterModel) => {
  const filters = {};
  
  if (!filterModel || !filterModel.items || filterModel.items.length === 0) {
    return filters;
  }
  
  // Map frontend field names to backend filter names
  const fieldMapping = {
    'drone_type': 'drone_type_name',
    'communication_type': 'communication_name',
    'video_type': 'video_type_name',
    'name': 'name',
  };
  
  filterModel.items.forEach((filter) => {
    const { field, operator, value } = filter;
    if (!value && value !== '') return;
    
    const backendField = fieldMapping[field] || field;
    
    switch (operator) {
      case 'contains':
        // Use _ilike for name fields, __icontains for others
        if (backendField === 'name' || backendField.endsWith('_name')) {
          filters[`${backendField}_ilike`] = value;
        } else {
          filters[`${backendField}__icontains`] = value;
        }
        break;
      case 'equals':
        filters[`${backendField}__iexact`] = value;
        break;
      case 'startsWith':
        filters[`${backendField}__istartswith`] = value;
        break;
      case 'endsWith':
        filters[`${backendField}__iendswith`] = value;
        break;
      default:
        filters[backendField] = value;
    }
  });
  
  return filters;
};

const PlanesTab = ({ isActive }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState([{ field: 'drone_type', sort: 'asc' }]);
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [, setError] = useState(null);

  // Reference data for dropdowns
  const [squads, setSquads] = useState([]);
  const [communicationTypes, setCommunicationTypes] = useState([]);
  const [videoTypes, setVideoTypes] = useState([]);
  const [droneTypes, setDroneTypes] = useState([]);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const fetchReferenceData = useCallback(async () => {
    try {
      const [squadsRes, commRes, videoRes, droneRes] = await Promise.all([
        squadApi.getAll({}, 100, 0),
        communicationApi.getAll({}, 100, 0),
        videoTypeApi.getAll({}, 100, 0),
        droneTypeApi.getAll({}, 100, 0),
      ]);

      setSquads(squadsRes.results || squadsRes || []);
      setCommunicationTypes(commRes.results || commRes || []);
      setVideoTypes(videoRes.results || videoRes || []);
      setDroneTypes(droneRes.results || droneRes || []);
    } catch (err) {
      console.error('Error fetching reference data:', err);
    }
  }, []);

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
        const fieldMapping = {
          'drone_type': 'drone_type_name',
          'communication_type': 'communication_name',
          'video_type': 'video_type_name',
          'name': 'name',
        };
        const backendField = fieldMapping[field] || field;
        ordering = `${backendField}.${direction}`;
      }

      const filters = buildFilters(filterModel);

      const response = await planeApi.getAll(filters, limit, offset, ordering);

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

  // Fetch reference data once on mount
  useEffect(() => {
    fetchReferenceData();
  }, [fetchReferenceData]);

  // Fetch data when pagination/sort/filter changes or when tab becomes active
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setSelectedItem(null);
    setFormErrors({});
    setFormOpen(true);
  };

  const handleEdit = (item) => {
    const formData = {
      ...item,
      type: item.drone_type?.id || '',
      communication: item.communication_type?.id || '',
      video_type_id: item.video_type?.id || '',
      squads: item.squads?.map(s => s.id) || [],
    };
    
    setSelectedItem(formData);
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

      const planeData = {
        name: formData.name,
        type: formData.type ? parseInt(formData.type) : undefined,
        communication: formData.communication ? parseInt(formData.communication) : undefined,
        video_type_id: formData.video_type_id ? parseInt(formData.video_type_id) : undefined,
        squads: formData.squads || [],
      };
      
      const imageFile = formData.image instanceof File ? formData.image : null;
      
      if (selectedItem) {
        await planeApi.update(selectedItem.id, planeData, imageFile);
      } else {
        await planeApi.create(planeData, imageFile);
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
      await planeApi.delete(selectedItem.id);
      setDeleteOpen(false);
      fetchData();
    } catch (err) {
      setError('Failed to delete. Please try again.');
    }
  };

  const formFields = [
    { name: 'name', label: 'Name', required: true },
    { name: 'image', label: 'Image', type: 'file' },
    {
      name: 'type',
      label: 'Drone Type',
      select: true,
      options: droneTypes.map((t) => ({ value: t.id, label: t.name })),
    },
    {
      name: 'communication',
      label: 'Communication Type',
      select: true,
      options: communicationTypes.map((t) => ({ value: t.id, label: t.name })),
    },
    {
      name: 'video_type_id',
      label: 'Video Type',
      select: true,
      options: videoTypes.map((t) => ({ value: t.id, label: t.name })),
    },
    {
      name: 'squads',
      label: 'Squads',
      select: true,
      multiple: true,
      options: squads.map((s) => ({ value: s.id, label: s.name })),
    },
  ];

  return (
    <Box>
      <DataTable
        title="Planes"
        columns={getColumns(droneTypes, communicationTypes, videoTypes)}
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
        title={`${selectedItem ? 'Edit' : 'Add'} Plane`}
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

export default PlanesTab;
