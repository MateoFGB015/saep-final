import React, { useState } from "react";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useUsers from "./hooks/UseUsers";
import UsersTable from "./components/UsersTable";
import SearchBar from "./components/SearchBar";
import UserModal from "./components/ModalEditarUsuario";
import ModalCrearUsuario from "./components/ModalCrearUsuario";
import usersAPI from "../../api/UsersAPI";
import { useAuth } from "../../context/AuthProvider";

const UsersPage = () => {
  const {
    usuarios,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    fetchUsers,
    handleSearch,
    currentPage,
    setCurrentPage,
  } = useUsers();

  const { token } = useAuth();
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalCreateOpen, setModalCreateOpen] = useState(false);

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setModalEditOpen(true);
  };

  const handleCloseEditModal = () => {
    setModalEditOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = async (idUsuario) => {
    try {
      const response = await usersAPI.eliminarUsuario(idUsuario, token);
      if (response.message === "Usuario desactivado correctamente") {
        fetchUsers();           // 🔁 Refrescar usuarios
        setSearchTerm("");      // 🧹 Limpiar búsqueda
        setFilterType("nombre");
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <div>
      <main>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          onSearch={handleSearch}
        />
        <UsersTable 
          usuarios={usuarios} 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          onEdit={handleOpenEditModal}
          onDelete={handleDelete} // ✅ Se pasa desde aquí
        />
        <UserModal 
          open={modalEditOpen} 
          onClose={handleCloseEditModal} 
          user={selectedUser} 
          onSave={fetchUsers}
        />
        <Fab 
          color="primary" 
          sx={{ 
            position: "fixed", 
            bottom: 20, 
            right: 20, 
            backgroundColor: "#71277a", 
            "&:hover": { backgroundColor: "#5e2062" } 
          }} 
          onClick={() => setModalCreateOpen(true)}
        >
          <AddIcon />
        </Fab>
        {modalCreateOpen && (
          <ModalCrearUsuario 
            onClose={() => {
              setModalCreateOpen(false);
              fetchUsers(); // ✅ Actualizar al crear
            }} 
          />
        )}
      </main>
    </div>
  );
};

export default UsersPage;
