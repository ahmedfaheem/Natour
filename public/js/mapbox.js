/* eslint-disable */
export const displayMap = (locations, mapBoxToken) => {
  if (!mapBoxToken) {
    console.error('Missing MAPBOX_ACCESS_TOKEN in config.env');
  }

  const map = new mapboxgl.Map({
    accessToken: mapBoxToken,
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // Use the standard style for the map
    center: [-118.2437, 34.0522], // Set the initial center of the map to the first location
    zoom: 10, // Set the initial zoom level
    interactive: false, // Enable user interaction with the map
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create a marker for each location
    const el = document.createElement('div');
    el.className = 'marker';

    // Add the marker to the map
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add a popup for each location
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend the map bounds to include the current location
    bounds.extend(loc.coordinates);
  });

  // Fit the map to the bounds of all locations
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
