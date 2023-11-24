import { useEffect, useState } from "react";
import Map from "react-map-gl";
import { Layer } from "react-map-gl";
import { Source } from "react-map-gl";

const JapanMap = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/yamanashi")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data); // Log the fetched data
        setData(data);
      });
  }, []);

  const layerStyle = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": 2,
      "circle-color": "#007cbf",
    },
  };

  return (
    <Map
      mapboxAccessToken="pk.eyJ1IjoibWNnaWxseSIsImEiOiJjbGgxaG5jM2ExM2V2M3JwN2VneTJ1NzV6In0.5-eUXkLBgaadlYKwktaitA"
      initialViewState={{
        longitude: 140,
        latitude: 37,
        zoom: 4,
      }}
      style={{ width: 600, height: 800 }}
      mapStyle="mapbox://styles/mapbox/dark-v9"
    >
      <Source id="my-data" type="geojson" data={data}>
        <Layer {...layerStyle} />
      </Source>
    </Map>
  );
};

export default JapanMap;
