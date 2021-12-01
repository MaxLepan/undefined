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

        // disable map rotation using right click + drag
        map.dragRotate.disable();
        
        // disable map rotation using touch rotation gesture
        map.touchZoomRotate.disableRotation();

        // disable double click zoom
        map.doubleClickZoom.disable()

        
        //map.scrollZoom.enable({ around: 'center' });

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
        
            yearBool = yearSwitch.checked

            if (protectedFilter.classList.contains('activeProtectedFilter')){
                protectedCountries(protectedCountriesToIterate).then()
            }

            if (neutralFilter.classList.contains('activeNeutralFilter')){
                neutralCountries(neutralCountriesToIterate).then()
            }

            if (criminalizedFilter.classList.contains('activeCriminalizedFilter')){
                criminalizedlCountries(criminalizedCountriesToIterate).then()
            }

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
                document.getElementById("gaiFilter").style.display= "flex";
            }

            protectedFilter.classList.add('activeProtectedFilter')
            neutralFilter.classList.add('activeNeutralFilter')
            criminalizedFilter.classList.add('activeCriminalizedFilter')  

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
            console.log(gai_slider_value);

            gaiCountries(gai_slider_value, 1).then()

        })

        const states = map.getSource('states')._data.features;
        const capitals = map.getSource('capitals')._data.features;

        protectedFilter.onclick = () => {
            protectedCountries(protectedCountriesToIterate).then()
            protectedFilter.classList.toggle('activeProtectedFilter')
            protectedFilterVerification = protectedFilter.classList.contains('activeProtectedFilter')
        }

        neutralFilter.onclick = () => {
            neutralCountries(neutralCountriesToIterate).then()
            neutralFilter.classList.toggle('activeNeutralFilter')
            neutralFilterVerification = neutralFilter.classList.contains('activeNeutralFilter')
        }

        criminalizedFilter.onclick = () => {
            criminalizedlCountries(criminalizedCountriesToIterate).then()
            criminalizedFilter.classList.toggle('activeCriminalizedFilter')
            criminalizedFilterVerification = criminalizedFilter.classList.contains('activeCriminalizedFilter')
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
                    ["==", ["feature-state", "colorCountries"], 0], "#313131",
                    ["==", ["feature-state", "colorCountries"], 1], "#54DDEF",
                    ["==", ["feature-state", "colorCountries"], 2], "#FFA722",
                    ["==", ["feature-state", "colorCountries"], 3], "#FF5780",
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
                'line-color': '#1C1C1C',
                'line-width': 1
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

        let clickedCountry;
        let clickedCountryBool = false;

        map.on('click', 'state-fills', (e) => {

            let sidebar = document.querySelector('.sidebar-content')
            let sidebarWrapper = document.querySelector('.sidebar')
            
            //console.log(e.features[0].properties)

            let foundCountryBool = false

            //-----------------------------PROTECTED COUNTRIES------------------------------------
            for (let country in protectedCountriesToIterate){
                //console.log(country)
                if (country === e.features[0].properties.ADMIN){
                    foundCountryBool = true
                    
                    //console.log(protectedCountriesToIterate[country])

                    sidebar.innerHTML = `
                        <div class="slider_wrapper">
                            <h3>${country}</h3>
                            <input type="range" min="1" max="9" value="${ 10 - protectedCountriesToIterate[country]['type'] }" step="1" disabled>
                            <div class="protection_level_wrapper">
                                <div class="protection_level" id="9">Protection constitutionnelle</div>
                                <div class="protection_level" id="8">Protection large</div>
                                <div class="protection_level" id="7">Protection dans le monde du travail</div>
                                <div class="protection_level" id="6">Protection limitée/inégale</div>
                                <div class="protection_level" id="5">Ni protection, ni criminalisation</div>
                                <div class="protection_level" id="4">Criminalisatoin de facto</div>
                                <div class="protection_level" id="3">Jusqu'à 8 ans d'emprisonnement</div>
                                <div class="protection_level" id="2">De 10 ans à la prison à vie</div>
                                <div class="protection_level" id="1">Peine de mort</div>
                            </div>
                            <div class="additional_rights_wrapper">
                                <div class="additional_right" id="legal_union"></div>
                                <div class="additional_right" id="adoption"></div>
                            </div>
                        </div>
                    `

                    let legal_union = document.querySelector('#legal_union')
                    let adoption = document.querySelector('#adoption')
                    if (protectedCountriesToIterate[country]['same_sex_marriage'] === 'YES'){

                        legal_union.innerHTML = `
                            <div class="right_accepted">
                                <div class="right_image"></div>
                                <div class="right_description">Union légale pour les personnes de même sexe</div>
                            </div>
                        `

                    } else {
                        legal_union.innerHTML = `
                            <div class="right_not_accepted"></div>
                        `
                    }

                    if (protectedCountriesToIterate[country]['second_parent_adoption'] === 'YES'){

                        adoption.innerHTML = `
                            <div class="right_accepted">
                                <div class="right_image"></div>
                                <div class="right_description">Adoption ouverte aux couples de même sexe</div>
                            </div>
                        `

                    } else {
                        adoption.innerHTML = `
                            <div class="right_not_accepted"></div>
                        `
                    }
                }
            }
            //-------------------------NEUTRAL COUNTRIES-----------------------
            if (!foundCountryBool){
                for (let country in neutralCountriesToIterate){
                    //console.log(country)
                    if (country === e.features[0].properties.ADMIN){
                        foundCountryBool = true
                        //console.log(neutralCountriesToIterate[country])

                        sidebar.innerHTML = `
                            <div class="slider_wrapper">
                                <h3>${country}</h3>
                                <input type="range" min="1" max="9" value="${ 10 - neutralCountriesToIterate[country]['type'] }" step="1" disabled>
                                <div class="protection_level_wrapper">
                                    <div class="protection_level" id="9">Protection constitutionnelle</div>
                                    <div class="protection_level" id="8">Protection large</div>
                                    <div class="protection_level" id="7">Protection dans le monde du travail</div>
                                    <div class="protection_level" id="6">Protection limitée/inégale</div>
                                    <div class="protection_level" id="5">Ni protection, ni criminalisation</div>
                                    <div class="protection_level" id="4">Criminalisatoin de facto</div>
                                    <div class="protection_level" id="3">Jusqu'à 8 ans d'emprisonnement</div>
                                    <div class="protection_level" id="2">De 10 ans à la prison à vie</div>
                                    <div class="protection_level" id="1">Peine de mort</div>
                                </div>
                                <div class="additional_rights_wrapper">
                                    <div class="additional_right" id="non_governmental_organisations"></div>
                                    <div class="additional_right" id="expression_freedom"></div>
                                </div>
                            </div>
                        `

                        let nonGovOrganisations = document.querySelector('#non_governmental_organisations')
                        let expressionFreedom = document.querySelector('#expression_freedom')

                        if (neutralCountriesToIterate[country]['ong'] === 'NO'){
                            nonGovOrganisations.innerHTML = `
                                <div class="right_accepted">
                                    <div class="wrong_right_image"></div>
                                    <div class="right_description">Obstacles juridiques à l'exercice des ONG sur les sujets LGBTQIA+</div>
                                </div>
                            `
                        } else {
                            nonGovOrganisations.innerHTML = `<div class="right_not_accepted"></div>`
                        }

                        if (neutralCountriesToIterate[country]['expression'] === 'NO'){
                            expressionFreedom.innerHTML = `
                                <div class="right_accepted">
                                    <div class="wrong_right_image"></div>
                                    <div class="right_description">Obstacles juridiques à la liberté d'expression sur les LGBTQIA+</div>
                                </div>
                            `
                        } else {
                            expressionFreedom.innerHTML = `<div class="right_not_accepted"></div>`
                        }

                    }
                }
            }
            //--------------------------------------CRIMINALIZED COUNTRIES---------------------------------
            if (!foundCountryBool){
                for (let country in criminalizedCountriesToIterate){
                    //console.log(country)
                    if (country === e.features[0].properties.ADMIN){
                        foundCountryBool = true
                        //console.log(criminalizedCountriesToIterate[country])

                        sidebar.innerHTML = `
                            <div class="slider_wrapper">
                                <h3>${country}</h3>
                                <input type="range" min="1" max="9" value="${ 10 - criminalizedCountriesToIterate[country]['type'] }" step="1" disabled>
                                <div class="protection_level_wrapper">
                                    <div class="protection_level" id="9">Protection constitutionnelle</div>
                                    <div class="protection_level" id="8">Protection large</div>
                                    <div class="protection_level" id="7">Protection dans le monde du travail</div>
                                    <div class="protection_level" id="6">Protection limitée/inégale</div>
                                    <div class="protection_level" id="5">Ni protection, ni criminalisation</div>
                                    <div class="protection_level" id="4">Criminalisatoin de facto</div>
                                    <div class="protection_level" id="3">Jusqu'à 8 ans d'emprisonnement</div>
                                    <div class="protection_level" id="2">De 10 ans à la prison à vie</div>
                                    <div class="protection_level" id="1">Peine de mort</div>
                                </div>
                                <div class="additional_rights_wrapper">
                                    <div class="additional_right" id="non_governmental_organisations"></div>
                                    <div class="additional_right" id="expression_freedom"></div>
                                </div>
                            </div>
                        `

                        let nonGovOrganisations = document.querySelector('#non_governmental_organisations')
                        let expressionFreedom = document.querySelector('#expression_freedom')

                        if (criminalizedCountriesToIterate[country]['ong'] === 'NO'){
                            nonGovOrganisations.innerHTML = `
                                <div class="right_accepted">
                                    <div class="wrong_right_image"></div>
                                    <div class="right_description">Obstacles juridiques à l'exercice des ONG sur les sujets LGBTQIA+</div>
                                </div>
                            `
                        } else {
                            nonGovOrganisations.innerHTML = `<div class="right_not_accepted"></div>`
                        }

                        if (criminalizedCountriesToIterate[country]['expression'] === 'NO'){
                            expressionFreedom.innerHTML = `
                                <div class="right_accepted">
                                    <div class="wrong_right_image"></div>
                                    <div class="right_description">Obstacles juridiques à la liberté d'expression sur les LGBTQIA+</div>
                                </div>
                            `
                        } else {
                            expressionFreedom.innerHTML = `<div class="right_not_accepted"></div>`
                        }

                    }
                }

            }
            
            if (!foundCountryBool) {
            sidebar.innerHTML = `
                <div class="country_not_found">
                    <h2>${e.features[0].properties.ADMIN}</h2>
                    <h2>Nous n'avons aucune information sur ce pays.</h2>
                </div>
            `
            }

            console.log("clicked country", clickedCountryBool)
            console.log("sidebar", sidebar.classList.contains('collapsed'))

            if (sidebarWrapper.classList.contains('collapsed')){
                console.log(clickedCountryBool)
                clickedCountryBool = true
                toggleSidebar('left', e.features[0].properties.ADMIN)
            } else if (clickedCountry === e.features[0].properties.ADMIN) {
                clickedCountryBool = false
                toggleSidebar('left', e.features[0].properties.ADMIN)
            }

            clickedCountry = e.features[0].properties.ADMIN

        })


        //---------------------Filters---------------------------

        async function protectedCountries(arrayToIterate) {

            let color;

            for (let protectedCountry in arrayToIterate) {
                //console.log("Protected Country : ", protectedCountry, arrayToIterate[protectedCountry])
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

                
            }
            //console.log('================================================================')

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

        async function gaiCountries (gai_slider_value, gaiCountryValue) {
            let fileToIterate;

            if (gai_slider_value >= 1 && gai_slider_value <= 4){
                fileToIterate = protectedCountries2017
            } else if (gai_slider_value >= 5 || gai_slider_value <= 6) {
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

        function toggleSidebar(id) {
            const elem = document.getElementById(id);

            const collapsed = elem.classList.toggle('collapsed');
            const padding = {};

            padding[id] = collapsed ? 0 : 300;

            map.easeTo({
                padding: padding,
                duration: 1000
            });
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
