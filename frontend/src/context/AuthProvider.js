//este contexto es para compartir datos entre componentes (es muy importante)

import { createContext, useContext, useState, useEffect } from "react";
import authAPI from "../api/AuthAPI";

// Crear el contexto
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);



// Función para obtener el usuario desde el backend
const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const userData = await authAPI.getUserData(token);
            setUser(userData);
        } catch (error) {
            console.error("Error obteniendo usuario:", error);
            localStorage.removeItem("token");
            setUser(null);
        }
    }
    setLoading(false);
};



// Cargar usuario al iniciar la app
useEffect(() => {
    fetchUser();
    }, []);

return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
        {children}
    </AuthContext.Provider>
    );
}


export function useAuth() {
    return useContext(AuthContext);
}