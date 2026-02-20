import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const planeApi = {
  getAll: async (filters = {}) => {
    try {
      const response = await apiClient.get('/planes/', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching planes:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/planes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching plane ${id}:`, error);
      throw error;
    }
  },

  create: async (planeData, image = null) => {
    try {
      const formData = new FormData();
      formData.append('name', planeData.name);
      if (planeData.type) formData.append('plane_type', planeData.type);
      if (planeData.communication) formData.append('communication', planeData.communication);
      if (planeData.video_type_id) formData.append('video_type', planeData.video_type_id);
      if (image) formData.append('image', image);

      const response = await apiClient.post('/planes/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating plane:', error);
      throw error;
    }
  },

  update: async (id, planeData) => {
    try {
      const response = await apiClient.put(`/planes/${id}`, planeData);
      return response.data;
    } catch (error) {
      console.error(`Error updating plane ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/planes/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting plane ${id}:`, error);
      throw error;
    }
  },
};

export default apiClient;
