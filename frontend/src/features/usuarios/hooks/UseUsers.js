//aqui se manejan todos los estados especificamente del modulo usuarios

import { useState, useEffect, useCallback } from "react";
import usersAPI from "../../../api/UsersAPI";
import { useNavigate } from "react-router-dom";

const useUsers = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // 🔹 Lista filtrada
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("nombre");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchUsers = useCallback(async () => {
    if (!token) {
      navigate("/");
      return;
    }
    try {
      const data = await usersAPI.getUsers(token);
      setUsuarios(data);
      setFilteredUsers(data); // 🔹 Inicialmente, todos los usuarios
    } catch (error) {
      console.error("❌ Error al obtener usuarios:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 🔹 FILTRADO SOLO AL PRESIONAR "BUSCAR"
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(usuarios); // Si no hay búsqueda, mostrar todos los usuarios
      setCurrentPage(0); // 🔹 Volver a la primera página
      return;
    }
  
    const termLower = searchTerm.toLowerCase();
  
    const filtered = usuarios.filter((user) => {
      const fieldValue = String(user[filterType] || "").toLowerCase();
      return fieldValue.startsWith(termLower); // 🔹 Solo coincidir si empieza con la búsqueda
    });
  
    setCurrentPage(0); // 🔹 Resetear la paginación primero
    setTimeout(() => setFilteredUsers(filtered), 0); // 🔹 Forzar un re-render antes de actualizar la tabla
  };
  
  

  return { 
    usuarios: filteredUsers, // 🔹 Retorna la lista filtrada
    setUsuarios,
    loading,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    currentPage,
    setCurrentPage,
    pageSize,
    fetchUsers,
    handleSearch, // 🔹 Se exporta para que `UsersPage` lo llame
  };
};

export default useUsers;
