import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('API_BASE_URL:', API_BASE_URL);

// Helper function to build full image URL
// Expects relative path like "planes/123.jpg" or "/static/planes/123.jpg"
// Returns URL like "/kitchen/static/planes/123.jpg" or "http://api/kitchen/static/planes/123.jpg"
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's an absolute filesystem path, extract just the relative part
  // e.g., "/home/user/project/kitchen/static/planes/123.jpg" -> "planes/123.jpg"
  if (imagePath.includes('/kitchen/static/')) {
    const match = imagePath.match(/\/kitchen\/static\/(.*)/);
    if (match) {
      imagePath = match[1];  // Get just the relative part after /kitchen/static/
    }
  }
  
  // Now imagePath should be like "planes/123.jpg" or "/static/planes/123.jpg"
  
  // If it starts with /static/, convert to /kitchen/static/
  if (imagePath.startsWith('/static/')) {
    imagePath = `/kitchen${imagePath}`;
  }
  
  // If it doesn't start with /, prepend /kitchen/static/
  if (!imagePath.startsWith('/')) {
    imagePath = `/kitchen/static/${imagePath}`;
  }
  
  // If using proxy (no API_BASE_URL), return relative URL
  if (!process.env.REACT_APP_API_URL) {
    return imagePath;
  }
  
  // With API_BASE_URL set, prepend it
  return `${API_BASE_URL}${imagePath}`;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const planeApi = {
  getAll: async (filters = {}, limit = null, offset = 0, order_by = null) => {
    try {
      const params = { ...filters };
      if (limit !== null) params.limit = limit;
      params.offset = offset || 0;
      if (order_by) params.order_by = order_by;
      const response = await apiClient.get('/planes/', { params });
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
      console.log('planeApi.create called with:', planeData);
      const formData = new FormData();
      formData.append('name', planeData.name);
      if (planeData.type) formData.append('drone_type_id', planeData.type);
      if (planeData.communication) formData.append('communication_id', planeData.communication);
      if (planeData.video_type_id) formData.append('video_type', planeData.video_type_id);
      if (planeData.squads && planeData.squads.length > 0) {
        planeData.squads.forEach((squadId) => {
          formData.append('squad_id', squadId);
        });
      }
      if (image) formData.append('image', image);

      // Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(`FormData: ${key} = ${value}`);
      }

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

  update: async (id, planeData, image = null) => {
    try {
      // If there's an image, use FormData; otherwise use JSON
      if (image) {
        const formData = new FormData();
        formData.append('name', planeData.name);
        if (planeData.type) formData.append('drone_type_id', planeData.type);
        if (planeData.communication) formData.append('communication_id', planeData.communication);
        if (planeData.video_type_id) formData.append('video_type', planeData.video_type_id);
        if (planeData.squads && planeData.squads.length > 0) {
          planeData.squads.forEach((squadId) => {
            formData.append('squad_id', squadId);
          });
        }
        formData.append('image', image);
        
        const response = await apiClient.put(`/planes/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      }
      
      // No image - use regular JSON
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

export const squadApi = {
  getAll: async (filters = {}, limit = null, offset = 0, order_by = null) => {
    try {
      const params = { ...filters };
      if (limit !== null) params.limit = limit;
      params.offset = offset || 0;
      if (order_by) params.order_by = order_by;
      const response = await apiClient.get('/squads/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching squads:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/squads/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching squad ${id}:`, error);
      throw error;
    }
  },

  create: async (squadData) => {
    try {
      const response = await apiClient.post('/squads/', squadData);
      return response.data;
    } catch (error) {
      console.error('Error creating squad:', error);
      throw error;
    }
  },

  update: async (id, squadData) => {
    try {
      const response = await apiClient.put(`/squads/${id}`, squadData);
      return response.data;
    } catch (error) {
      console.error(`Error updating squad ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/squads/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting squad ${id}:`, error);
      throw error;
    }
  },
};

export const communicationApi = {
  getAll: async (filters = {}, limit = null, offset = 0, order_by = null) => {
    try {
      const params = { ...filters };
      if (limit !== null) params.limit = limit;
      params.offset = offset || 0;
      if (order_by) params.order_by = order_by;
      const response = await apiClient.get('/communication-types/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching communication types:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/communication-types/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching communication type ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await apiClient.post('/communication-types/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating communication type:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/communication-types/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating communication type ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/communication-types/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting communication type ${id}:`, error);
      throw error;
    }
  },
};

export const videoTypeApi = {
  getAll: async (filters = {}, limit = null, offset = 0, order_by = null) => {
    try {
      const params = { ...filters };
      if (limit !== null) params.limit = limit;
      params.offset = offset || 0;
      if (order_by) params.order_by = order_by;
      const response = await apiClient.get('/video-types/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching video types:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/video-types/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching video type ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await apiClient.post('/video-types/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating video type:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/video-types/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating video type ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/video-types/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting video type ${id}:`, error);
      throw error;
    }
  },
};

export const droneTypeApi = {
  getAll: async (filters = {}, limit = null, offset = 0, order_by = null) => {
    try {
      const params = { ...filters };
      if (limit !== null) params.limit = limit;
      params.offset = offset || 0;
      if (order_by) params.order_by = order_by;
      const response = await apiClient.get('/drone-types/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching drone types:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/drone-types/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching drone type ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await apiClient.post('/drone-types/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating drone type:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/drone-types/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating drone type ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/drone-types/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting drone type ${id}:`, error);
      throw error;
    }
  },
};

export default apiClient;
