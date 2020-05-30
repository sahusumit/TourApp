
export const displayMap=(locations) =>{
    mapboxgl.accessToken = 'pk.eyJ1IjoiYmx1ZS1mcm9nIiwiYSI6ImNrYWw2dDFnMzA4c3kycm12ZTNrMWo0NWcifQ.s6rkBv-PXdfidaErkOzVcQ';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/blue-frog/ckal8xsva3lo31iqhvgsvya5f',
        scrollZoom:false
        // center:[-118.113491, 34.111745],
        // zoom:10,
        // interactive:false
    });
    
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach(loc => {
        //Create Marker
        const el = document.createElement('div');
        el.className = 'marker'
        //Add Marker
        new mapboxgl.Marker({
            element: el,
            anchor:'bottom'
        }).setLngLat(loc.coordinates).addTo(map);
       
        //Add pop
        new mapboxgl.Popup({offset:30}).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}<p>`).addTo(map);
        // Extends the map bounds to include the current location
        bounds.extend(loc.coordinates);  
    });
    
    map.fitBounds(bounds, {
        padding:{
            top:200,
            bottom:150,
            right:100,
            left:100,
        }
    });
}

