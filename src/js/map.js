window.addEventListener("DOMContentLoaded", () => {
    

    const protectedCountries2020 = paysProteger2020
    const neutralCountries2020 = paysNeutre2020
    const criminalizedCountries2020 = paysCrime2020

    const protectedCountries2017 = paysProteger2017
    const neutralCountries2017 = paysNeutre2017
    const criminalizedCountries2017 = paysCrime2017

    console.log("Protected 2020", protectedCountries2020)
    console.log("Neutral 2020", neutralCountries2020)
    console.log("Crim 2020", criminalizedCountries2020)

    console.log("Protected 2017", protectedCountries2017)
    console.log("Neutral 2017", neutralCountries2017)
    console.log("Crim 2017", criminalizedCountries2017)


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

        const protectedFilter = document.querySelector('#protected_filter')
        const neutralFilter = document.querySelector('#neutral_filter')
        const criminalizedFilter = document.querySelector('#criminalized_filter')

        const gai_slider = document.querySelector('#gai_slider')
        let gai_slider_value = 1;

        let protectedFilterVerification = false
        let neutralFilterVerification = false
        let criminalizedFilterVerification = false

        const yearSwitch = document.querySelector('#toggle')
        let yearBool = yearSwitch.checked;
        let protectedCountriesToIterate = protectedCountries2020[0];
        let neutralCountriesToIterate = neutralCountries2020[0];
        let criminalizedCountriesToIterate = criminalizedCountries2020[0];

        yearSwitch.onclick = () => {
            protectedFilter.classList.remove('active')
            neutralFilter.classList.remove('active')
            criminalizedFilter.classList.remove('active')

            protectedCountries(protectedCountriesToIterate).then()
            neutralCountries(neutralCountriesToIterate).then()
            criminalizedlCountries(criminalizedCountriesToIterate).then()

            yearBool = yearSwitch.checked

            if (yearBool){
                protectedCountriesToIterate = protectedCountries2020[0]
                neutralCountriesToIterate = neutralCountries2020[0];
                criminalizedCountriesToIterate = criminalizedCountries2020[0];
                gai_slider.disabled = true;
            } else {
                protectedCountriesToIterate = protectedCountries2017[0]
                neutralCountriesToIterate = neutralCountries2017[0];
                criminalizedCountriesToIterate = criminalizedCountries2017[0];
                gai_slider.disabled = false;
                gaiCountries(gai_slider_value, null).then()
            }

            protectedFilterVerification = true
            neutralFilterVerification = true
            criminalizedFilterVerification = true

            protectedCountries(protectedCountriesToIterate).then()
            neutralCountries(neutralCountriesToIterate).then()
            criminalizedlCountries(criminalizedCountriesToIterate).then()

        }

        gai_slider.addEventListener("change", e => {
            //console.log("slider value", gai_slider.value)
            //console.log("old slider value", gai_slider_value)

            gaiCountries(gai_slider_value, null).then()

            gai_slider_value = parseInt(gai_slider.value)

            gaiCountries(gai_slider_value, 1).then()

        })

        const states = map.getSource('states')._data.features;
        const capitals = map.getSource('capitals')._data.features;

        protectedFilter.onclick = () => {
            protectedCountries(protectedCountriesToIterate).then()
            protectedFilter.classList.toggle('active')
            protectedFilterVerification = protectedFilter.classList.contains('active')
        }

        neutralFilter.onclick = () => {
            neutralCountries(neutralCountriesToIterate).then()
            neutralFilter.classList.toggle('active')
            neutralFilterVerification = neutralFilter.classList.contains('active')
        }

        criminalizedFilter.onclick = () => {
            criminalizedlCountries(criminalizedCountriesToIterate).then()
            criminalizedFilter.classList.toggle('active')
            criminalizedFilterVerification = criminalizedFilter.classList.contains('active')
        }


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
            'id': 'countriesProtectionStatus',
            'type': 'fill',
            'source': 'states',
            'paint': {
                'fill-color': [
                    "case",
                    ["==", ["feature-state", "colorCountries"], 0], "#808080",
                    ["==", ["feature-state", "colorCountries"], 1], "#0a8a06",
                    ["==", ["feature-state", "colorCountries"], 2], "#de7605",
                    ["==", ["feature-state", "colorCountries"], 3], "#c22e2e",
                    "#313131"
                ],
                'fill-opacity': 1
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
                'circle-color': "red",
                'circle-opacity': [
                    "case",
                    ["==", ["feature-state", "gaiCountries"], 1], 1,
                    0
                ]
            },

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

        //---------------------Filters---------------------------

        async function protectedCountries(arrayToIterate) {

            let color;

            for (let protectedCountry in arrayToIterate) {
                //console.log("Protected Country : ", protectedCountry)
                let indexOfFeatures = states.map(function (e) {
                    return e.properties.ADMIN;
                }).indexOf(protectedCountry);

                //console.log('index of feature : ', indexOfFeatures)

                if (!protectedFilterVerification) {
                    color = 1
                }

                map.setFeatureState(
                    {
                        source: 'states',
                        id: indexOfFeatures
                    },
                    {colorCountries: color},
                );

                color = null;

                //console.log('================================================================')
            }

        }

        async function neutralCountries(arrayToIterate) {

            let color;

            for (let neutralCountry in arrayToIterate) {
                //console.log("Neutral Country : ", neutralCountry)
                let indexOfFeatures = states.map(function (e) {
                    return e.properties.ADMIN;
                }).indexOf(neutralCountry);

                //console.log('index of feature : ', indexOfFeatures)

                if (!neutralFilterVerification) {
                    color = 2
                }

                map.setFeatureState(
                    {
                        source: 'states',
                        id: indexOfFeatures
                    },
                    {colorCountries: color},
                );

                color = null;

                //console.log('===================================================================')
            }
        }

        async function criminalizedlCountries(arrayToIterate) {

            let color;

            for (let criminalizedCountry in arrayToIterate) {
                //console.log("Protected Country : ", criminalizedCountry)
                let indexOfFeatures = states.map(function (e) {
                    return e.properties.ADMIN;
                }).indexOf(criminalizedCountry);

                //console.log('index of feature : ', indexOfFeatures)

                if (!criminalizedFilterVerification) {
                    color = 3
                }

                map.setFeatureState(
                    {
                        source: 'states',
                        id: indexOfFeatures
                    },
                    {colorCountries: color},
                );

                color = null;

                //console.log('===================================================================')
            }
        }

        if (protectedFilterVerification || neutralFilterVerification || criminalizedFilterVerification){
            protectedCountries().then()
            neutralCountries().then()
            criminalizedlCountries().then()
        }

        async function gaiCountries (gai_slider_value, gaiCountryValue) {
            let fileToIterate;

            if (gai_slider_value >= 1 && gai_slider_value <= 4){
                fileToIterate = protectedCountries2017
            } else if (gai_slider_value === 5 || gai_slider_value === 6) {
                fileToIterate = neutralCountries2017
            } else if (gai_slider_value >= 7 && gai_slider_value <= 9) {
                fileToIterate = criminalizedCountries2017
            }

            let gaiCountry;

            for (let country in fileToIterate[0]){

                let countryType = fileToIterate[0][country]['type']
                if (parseInt(countryType) === gai_slider_value){
                    //console.log(country)
                    let indexOfFeature = capitals.map(function (e) {
                        return e.properties.COUNTRY;
                    }).indexOf(country)

                    gaiCountry = gaiCountryValue

                    map.setFeatureState ({
                            source: 'capitals',
                            id: indexOfFeature
                        },
                        { gaiCountries: gaiCountry }
                    )

                    //console.log(indexOfFeature)
                }
            }
        }

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

})
