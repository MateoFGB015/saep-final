import { createContext, useEffect, useState } from "react";
import { obtenerEventos } from "../api/AgendamientoAPI";

const EventosContext = createContext();

export function EventosProvider({ children }) {
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        obtenerEventos().then(setEventos);
    }, []);

    return (
        <EventosContext.Provider value={{ eventos, setEventos }}>
            {children}
        </EventosContext.Provider>
    );
}

export default EventosContext;