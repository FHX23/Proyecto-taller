import axios from "./root.service.js";
import { formatUserData } from "@helpers/formatData.js";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

export async function getUsers() {
  try {
    const { data } = await axios.get("/user/");
    const formattedData = data.data.map(formatUserData);
    return formattedData;
  } catch (error) {
    return error.response.data;
  }
}


export async function deleteUser(id) {
  try {
    const response = await axios.delete(`/user/detail/?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    // Lanzar solo el mensaje del error, no como objeto, solo el string
    throw (
      error.response?.data?.message ||
      "Hubo un problema al cargar los usuarios."
    );
  }
}

export async function GetUsersFilter(filters) {
  try {
    const params = new URLSearchParams();

    // Realizar la solicitud GET a la API con los parámetros vacios
    const response = await axios.get(
      `${API_URL}/user/getUsersFilter?${params.toString()}`
    );

    return response.data.data; // Devuelve solo el array de usuarios, asumiendo que la respuesta tiene esta estructura
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    // Lanzar solo el mensaje del error, no como objeto, solo el string
    throw (
      error.response?.data?.message ||
      "Hubo un problema al cargar los usuarios."
    );
  }
}

export async function updateUser(id, updateData) {
  try {
    // Realizar la solicitud PUT a la API
    const response = await axios.put(
      `${API_URL}/user/updateUser/${id}`,
      updateData
    );

    return response.data;
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    // Lanzar solo el mensaje de error, no el objeto de error completo
    throw (
      error.response?.data?.message ||
      "Hubo un problema al actualizar el usuario."
    );
  }
}