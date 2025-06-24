import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // ✅ Necesario
import { useAuth } from "../../context/AuthProvider";
import NotificacionesFlotantes from "../notificaciones/NotificacionesFlotantes";
import Badge from '@mui/material/Badge';
import UserInfoModal from "../../components/ui/UserInfoModal";
import { useAuthActions } from "../../api/useAuthActions";
import Sena from "../../assets/imgs/logoSena.png";
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
  Equalizer as EqualizerIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";

const drawerWidth = 250;
const collapsedWidth = 60;
const API_URL = process.env.REACT_APP_BACKEND_API_URL;

const Navbar = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [cantidadNoLeidas, setCantidadNoLeidas] = useState(0);
  const { user, token } = useAuth(); // ✅ Traemos el token directamente aquí
  const { logout } = useAuthActions();
  const theme = useTheme();
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserModal, setOpenUserModal] = useState(false);

  const toggleDrawer = () => setOpen(!open);
  const handleVerUsuario = (usuario) => {
    setSelectedUser(usuario);
    setOpenUserModal(true);
  };

  const menuItems = [
    { text: "Inicio", icon: <HomeIcon />, route: "/inicio", roles: ["Administrador", "Instructor", "aprendiz"] },
    { text: "Usuarios", icon: <PeopleIcon />, route: "/usuarios", roles: ["Administrador"] },
    { text: "Fichas", icon: <AssignmentIcon />, route: "/fichas", roles: ["Administrador", "Instructor"] },
    { text: "Agendamientos", icon: <CalendarIcon />, route: "/agendamientos", roles: ["Instructor", "aprendiz"] },
    { text: "Agendamientos", icon: <CalendarIcon />, route: "/agendamientos/listaIntructores", roles: ["Administrador"] },
    { text: "Seguimiento y control", icon: <EqualizerIcon />, route: "/seguimiento", roles: ["aprendiz"] },
  ];

  // ✅ Solo obtenemos el conteo de notificaciones, no las notificaciones completas
  useEffect(() => {
    const obtenerCantidadNoLeidas = async () => {
      try {
        const res = await axios.get(`${API_URL}/notificacion/ver`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const noLeidas = res.data.notificaciones.filter(n => n.estado === "NoLeida").length;
        setCantidadNoLeidas(noLeidas);
      } catch (error) {
        console.error("❌ Error al obtener cantidad de no leídas:", error);
      }
    };

    if (token) obtenerCantidadNoLeidas();
  }, [token]);

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#71277a",
          zIndex: theme.zIndex.drawer + 1,
          width: "100%",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ position: "relative", zIndex: theme.zIndex.drawer + 2 }}>
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", ml: 4, flexGrow: 1, gap: 2 }}>
            <img src={Sena} alt="Logo SENA" style={{ height: 32 }} />
            <Typography variant="h6" sx={{ fontSize: "1rem" }}>SISTEMA SAEP</Typography>
          </Box>

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
            <Badge
              badgeContent={cantidadNoLeidas > 0 ? cantidadNoLeidas : null}
              color="error"
              overlap="circular"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>

        {mostrarNotificaciones && (
          <NotificacionesFlotantes
            onClose={() => setMostrarNotificaciones(false)}
            setCantidadNoLeidas={setCantidadNoLeidas} // ✅ Para actualizar el contador desde el flotante
          />
        )}
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          whiteSpace: "nowrap",
          boxSizing: "border-box",
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : collapsedWidth,
            backgroundColor: "#71277a",
            color: "white",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: "hidden",
          },
        }}
      >
        <Box
          sx={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "space-between" : "center",
            px: 1,
          }}
        >
          <IconButton onClick={toggleDrawer} sx={{ color: "white" }}>
            <MenuIcon />
          </IconButton>
          {open && (
            <Typography variant="subtitle1" sx={{ color: "white", fontWeight: "bold" }}>
              {user?.rol || "Rol"}
            </Typography>
          )}
        </Box>

        <List sx={{ mt: 2 }}>
          {menuItems
            .filter((item) => item.roles.includes(user?.rol))
            .map(({ text, icon, route }) => (
              <ListItemButton
                key={text}
                component={Link}
                to={route}
                sx={{
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  py: 1.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "white",
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {icon}
                </ListItemIcon>
                {open && <ListItemText primary={text} />}
              </ListItemButton>
            ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pl: "5%",
          pr: "5%",
          mt: 13,
          width: "100%",
          minHeight: "100vh",
          pb: 10,
          overflowY: "auto",
        }}
      >
        {children}
      </Box>

      <UserInfoModal open={openUserModal} onClose={() => setOpenUserModal(false)} user={selectedUser} />
    </Box>
  );
};

export default Navbar;
