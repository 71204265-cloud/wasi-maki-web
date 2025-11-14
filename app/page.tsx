// page.tsx (o .js) - dentro de wasi-maki-web/app/
'use client'; 

import React, { useState, useEffect } from 'react'; // <--- VERIFICA ESTO
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// --- FIN Configuración de Iconos ---

export default function WasiMakiMap() {
    // Definimos el estado para guardar los negocios que vendrán del Backend
    const [negocios, setNegocios] = useState([]); // <--- ESTADO INICIAL VACÍO
    const position = [-13.5167, -71.9500]; // Coordenadas de Cusco

    useEffect(() => { // <--- FUNCIÓN PARA LLAMAR AL BACKEND
        const fetchNegocios = async () => {
            try {
                // LLAMADA AL ENDPOINT CORRECTO
                const response = await fetch('https://wasi-maki-api.onrender.com/api/negocios'); // NUEVA LÍNEA
                const data = await response.json();
                
                setNegocios(data); // ¡Actualiza el estado con los datos del Backend!
            } catch (error) {
                console.error("Error al cargar datos del Backend:", error);
            }
        };

        fetchNegocios();
    }, []); 

    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            <MapContainer 
                center={position} 
                zoom={14} 
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                {/* Capa base del mapa */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Renderiza los marcadores que ahora vienen de tu Base de Datos */}
                {negocios.map((negocio, index) => (
                    // Asegúrate de que 'lat' y 'lng' son los nombres de las columnas
                    <Marker key={index} position={[negocio.lat, negocio.lng]}>
                        <Popup>
                            <h3>{negocio.nombre}</h3>
                            <p>Categoría: **{negocio.categoria}**</p>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}