window.addEventListener('load', function() {
    let viewer = new CV2.CaveViewer('caveview-container', {
        home: 'CaveView/',
        view: {
            cameraType: CV2.CAMERA_ORTHOGRAPHIC,
            shading: CV2.SHADING_SINGLE,
            stations: true,
            terrain: true,
            terrainShading: "Satellite",
            terrainOpacity: 0.6,
            view: CV2.VIEW_PLAN,
        },
        theme: {
            background: 'white',
            box: {
                bounding: 'black',
            },
            hud: {
                widgetSize: 20,
                text: 'black',
                scale: {
                    bar1: 'black',
                    bar2: 'lightgray',
                }
            }
        },
        surveyDirectory: 'surveys/',
        terrainDirectory: 'terrain/',
    });
    viewer.addOverlay( 'OpenStreetMap', new OSMProvider() );
    viewer.addOverlay( 'Satellite', new MapBoxProvider( 'mapbox.satellite', 'pk.eyJ1IjoiYXJpY29vcGVyZGF2aXMiLCJhIjoiY2xydGQ2c2RzMDVreTJpbXhxcnF5ZWEzZSJ9.dB0-lgAaKzyrQ-MvVrrvPg') );
    viewer.addOverlay( 'OS 25 inch 1873-1888', new NLSProvider( '25_inch/cornwall_1st' ) );
    viewer.addOverlay( 'OS 25 inch 1892-1948', new NLSProvider( '25_inch/cornwall' ) );

    let ui = new CV2.CaveViewUI(viewer);
    ui.loadCave('pell.3d');
});