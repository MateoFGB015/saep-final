//esta es la pagina general del modulo usuarios donde se juntan todos los componentes del modulo y que funcionen.

import React, { useState } from "react";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useUsers from "./hooks/UseUsers";
import UsersTable from "./components/UsersTable";
import SearchBar from "./components/SearchBar";
import UserModal from "./components/ModalEditarUsuario";
import ModalCrearUsuario from "./components/ModalCrearUsuario";

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
        {modalCreateOpen && <ModalCrearUsuario onClose={() => { setModalCreateOpen(false); fetchUsers(); }} />}
      </main>
    </div>
  );
};

export default UsersPage;
