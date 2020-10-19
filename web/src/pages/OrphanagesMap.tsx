import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import Leaflet from 'leaflet';

import api from '../services/axios';

import 'leaflet/dist/leaflet.css';

import mapMarkerImg from '../images/map-marker.svg';

import '../styles/pages/orphanages-map.css';

interface Orphanage {
  id: number,
  latitude: number,
  longitude: number,
  name: string,
}

const mapIcon = Leaflet.icon({
  iconUrl: mapMarkerImg,
  iconAnchor: [29, 68],
  iconSize: [58, 68],
  popupAnchor: [170, 2],
});

function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  useEffect(() => {
    api.get('orphanages')
      .then(response => { setOrphanages(response.data.orphanages) })
      .catch((err) => { });
  }, []);

  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarkerImg} alt="" />

          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>

        <footer>
          <strong>Toledo</strong>
          <span>Paraná</span>
        </footer>
      </aside>

      <Map
        center={[-27.21, -49.6405]}
        zoom={14.5}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {orphanages.map((orphanage, index) => (
          <Marker key={`${orphanage.id}${index}`} position={[orphanage.latitude, orphanage.longitude]} icon={mapIcon}>
            <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup" >
              {orphanage.name}
            <Link to={`/orphanages/${orphanage.id}`}>
                <FiArrowRight size={20} color="#fff" />
              </Link>
            </Popup>
          </Marker>
        ))}
      </Map>

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#fff" />
      </Link>
    </div>
  );
}

export default OrphanagesMap;