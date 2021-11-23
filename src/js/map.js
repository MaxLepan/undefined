window.addEventListener("DOMContentLoaded", () => {
    
  
    console.log(country); 
    console.log(capitals);

    // define access token
    mapboxgl.accessToken = 'pk.eyJ1IjoibHNtbnQiLCJhIjoiY2t1eHNxN2E0MHgzeDJxcmZjMnlyaDU5ciJ9.IIvVsucH11Eo5bY1wkACtA';
    var collection;
    var querys;
    var datas;


    // create map
    const map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/lsmnt/ckuxryts03ma218o6g4fz54v0', // map style URL from Mapbox Studio
        center: [10, 40],
        zoom: 1.5
    });

    let hoveredStateId = null;

    mapLoad().then(()=>{

        
        const states = map.getSource('states');
        const capitals = map.getSource('capitals');
  

        //----------------------Layers---------------------

        map.addLayer({
            'id': 'state-fills',
            'type': 'fill',
            'source': 'states',
            'layout': {},
            'paint': {
                'fill-color': '#627BC1',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    1,
                    0.5
                ]
            }
        });

        map.addLayer({
            'id': 'state-borders',
            'type': 'line',
            'source': 'states',
            'layout': {},
            'paint': {
                'line-color': '#627BC1',
                'line-width': 2
            }
        });


      
        map.addLayer({
            'id': 'marker',
            'type': 'circle',
            'source': 'capitals',
            'layout': {},
            'paint': {

                // Make circles larger as the user zooms from z12 to z22.
                'circle-radius': {
                    'base': 1.75,
                    'stops': [
                        [12, 2],
                        [22, 180]
                    ]
                },
                'circle-color': 'red'
            }
        });

        //----------------------Mouse---------------------

        map.on('mousemove', 'state-fills', (e) => {
            if (e.features.length > 0) {
                if (hoveredStateId !== null) {
                    map.setFeatureState(
                        { source: 'states', id: hoveredStateId },
                        { hover: false }
                    );

                }
                hoveredStateId = e.features[0].id;
                map.setFeatureState(
                    { source: 'states', id: hoveredStateId },
                    { hover: true }
                );
                //console.log(e.features[0].properties.ADMIN)
            }
        });
        map.on('mouseleave', 'state-fills', () => {
            if (hoveredStateId !== null) {
                map.setFeatureState(
                    { source: 'states', id: hoveredStateId },
                    { hover: false }
                );
            }
            hoveredStateId = null;
        });


        //const m = new mapboxgl.Marker().setLngLat([1, 45]).addTo(map);
        map.scrollZoom.enable({ around: 'center' });



    });

    function mapLoad() {
        return new Promise((resolve, reject) => {
            
            map.on('load', () => {

                map.addSource('states', {
                    'type': 'geojson',
                    'data': country,
                    'generateId': true
                });
            
                map.addSource('capitals', {
                    'type': 'geojson',
                    'data': capitals,
                    'generateId': true
                });
                    resolve();  
                });

        })
    }




    function proteger() {

    }
    function neutre() {

    }
    function crim() {

    }

})
