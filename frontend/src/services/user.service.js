import axios from "./root.service.js";
import { formatUserData } from "@/helpers/formatData.js";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

export async function getUsers() {
  try {
    const { data } = await axios.get(`/user/getUsers`);
    return data.data.map(formatUserData);
  } catch (error) {
    if (error.response?.data?.details && Object.keys(error.response.data.details).length > 0) {
      throw error.response.data.details;
    }
    throw error.response?.data?.message || "Hubo un problema al cargar los usuarios.";
  }
}

export async function getUser(id) {
  try {
    const { data } = await axios.get(`/user/getUser/${id}`);
    return formatUserData(data.data);
  } catch (error) {
    if (error.response?.data?.details && Object.keys(error.response.data.details).length > 0) {
      throw error.response.data.details;
    }
    throw error.response?.data?.message || "Hubo un problema al cargar el usuario.";
  }
}

export async function updateUser(id, updateData) {
  try {
    const { data } = await axios.put(`/user/updateUser/${id}`, updateData);
    return data;
  } catch (error) {
    if (error.response?.data?.details && Object.keys(error.response.data.details).length > 0) {
      throw error.response.data.details;
    }
    throw error.response?.data?.message || "Hubo un problema al actualizar el usuario.";
  }
}

export async function deactivateUser(id) {
  try {
    const { data } = await axios.patch(`/user/deactivateUser/${id}`);
    return data;
  } catch (error) {
    if (error.response?.data?.details && Object.keys(error.response.data.details).length > 0) {
      throw error.response.data.details;
    }
    throw error.response?.data?.message || "Hubo un problema al desactivar el usuario.";
  }
}

export async function deactivateUsers(ids) {
  try {
    const { data } = await axios.patch(`/user/deactivateUsers`, { ids });
    return data;
  } catch (error) {
    if (error.response?.data?.details && Object.keys(error.response.data.details).length > 0) {
      throw error.response.data.details;
    }
    throw error.response?.data?.message || "Hubo un problema al desactivar los usuarios.";
  }
}

export async function activateUser(id) {
  try {
    const { data } = await axios.patch(`/user/activateUser/${id}`);
    return data;
  } catch (error) {
    if (error.response?.data?.details && Object.keys(error.response.data.details).length > 0) {
      throw error.response.data.details;
    }
    throw error.response?.data?.message || "Hubo un problema al activar el usuario.";
  }
}

export async function activateUsers(ids) {
  try {
    const { data } = await axios.patch(`/user/activateUsers`, { ids });
    return data;
  } catch (error) {
    if (error.response?.data?.details && Object.keys(error.response.data.details).length > 0) {
      throw error.response.data.details;
    }
    throw error.response?.data?.message || "Hubo un problema al activar los usuarios.";
  }
}

export async function getUsersWithFilters(filters = {}) {
  try {
    const params = new URLSearchParams(filters).toString();
    const { data } = await axios.get(`/user/getUsersFilter?${params}`);
    return data.data.map(formatUserData);
  } catch (error) {
    if (error.response?.data?.details && Object.keys(error.response.data.details).length > 0) {
      throw error.response.data.details;
    }
    throw error.response?.data?.message || "Hubo un problema al filtrar los usuarios.";
  }
}