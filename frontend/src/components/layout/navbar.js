import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import NotificacionesFlotantes from "../notificaciones/NotificacionesFlotantes";
import UserInfoModal from "../../components/ui/UserInfoModal";
import { useAuthActions } from "../../api/useAuthActions";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  Equalizer as EqualizerIcon, // ✅ Aquí está la importación correcta
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  ChecklistRtl as ChecklistRtlIcon,
} from "@mui/icons-material";

const drawerWidth = 250;

const Navbar = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const { user } = useAuth();
  const { logout } = useAuthActions();
  const theme = useTheme();
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserModal, setOpenUserModal] = useState(false);

  const handleVerUsuario = (usuario) => {
    setSelectedUser(usuario);
    setOpenUserModal(true);
  };
  


  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: "Inicio", icon: <HomeIcon />, route: "/inicio", roles: ["Administrador", "Instructor", "Aprendiz"] },
    { text: "Usuarios", icon: <PeopleIcon />, route: "/usuarios", roles: ["Administrador"] },
    { text: "Fichas", icon: <AssignmentIcon />, route: "/fichas", roles: ["Administrador", "Instructor"] },
    { text: "Agendamientos", icon: <CalendarIcon />, route: "/agendamientos", roles: [ "Instructor", "aprendiz"] },
    { text: "Agendamientos", icon: <CalendarIcon />, route: "/agendamientos/listaIntructores", roles: [ "Administrador"] },
    { text: "Seguimiento y control", icon: <EqualizerIcon />, route: "/seguimiento", roles: ["Administrador", "Instructor", "aprendiz"] },
    { text: "Reporte", icon:<ChecklistRtlIcon/>, route:"/reporte", roles:["Administrador", "Instructor"],}
  ];

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#71277a",
          zIndex: open ? theme.zIndex.drawer - 1 : theme.zIndex.drawer + 1,
          width: "100%",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer}
            sx={{ position: "relative", zIndex: theme.zIndex.drawer + 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: "1rem", ml: 1 }}>
            SISTEMA SAEP
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: "0.90rem",
              mr: 1,
              textAlign: "end",
              display: { xs: "none", sm: "block" },
            }}
          >
            {user?.nombre || "Nombre de usuario"}
          </Typography>

          <IconButton color="inherit" onClick={() => handleVerUsuario(user)}>
            <AccountCircleIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}>
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
        {mostrarNotificaciones && (
          <NotificacionesFlotantes onClose={() => setMostrarNotificaciones(false)} />
        )}
      </AppBar>

      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#71277a",
            overflowX: "hidden",
            position: "fixed",
          },
        }}
      >
        <Box sx={{ width: drawerWidth, height: "100%", color: "white" }}>
          <Box
            sx={{
              ml: 2,
              width: "85%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 1px",
              borderBottom: "2px solid white",
            }}
          >
            <IconButton onClick={toggleDrawer} sx={{ color: "white" }}>
              <MenuIcon />
            </IconButton>

            <Typography
              variant="subtitle1"
              sx={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                mr: 5,
                flexGrow: 1,
              }}
            >
              {user?.rol || "Rol"}
            </Typography>
          </Box>

          <List>
            {menuItems
              .filter((item) => item.roles.includes(user?.rol))
              .map(({ text, icon, route }) => (
                <ListItemButton key={text} component={Link} to={route}>
                  <ListItemIcon sx={{ color: "white", minWidth: "40px" }}>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pl: "5%",
          pr: "5%",
          mt: 13,
          width: "100%",
        }}
      >
        {children}
      </Box>
      <UserInfoModal
       open={openUserModal}
       onClose={() => setOpenUserModal(false)}
       user={selectedUser}
      />

    </Box>
  );
};

export default Navbar;