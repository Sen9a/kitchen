import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Typography,
} from '@mui/material';
import { getImageUrl } from '../../services/api';

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
      const value = event.target.value;
      console.log(`Field ${field} changed to:`, value);
      setFormData({ ...formData, [field]: value });
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
              ) : field.select ? (
                <FormControl 
                  fullWidth 
                  margin="dense" 
                  required={field.required}
                  sx={{ mt: 1 }}
                >
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={formData[field.name] || (field.multiple ? [] : '')}
                    onChange={handleChange(field.name)}
                    multiple={field.multiple}
                    label={field.label}
                    renderValue={field.multiple ? (selected) => {
                      if (!selected || selected.length === 0) return '';
                      const selectedLabels = field.options
                        .filter(opt => selected.includes(opt.value))
                        .map(opt => opt.label);
                      return selectedLabels.join(', ');
                    } : undefined}
                  >
                    {field.options?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {field.multiple && (
                          <Checkbox checked={(formData[field.name] || []).includes(option.value)} />
                        )}
                        <ListItemText primary={option.label} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                />
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

export default FormDialog;
