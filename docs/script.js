window.addEventListener('load', function() {
    let viewer = new CV2.CaveViewer('caveview-container', {
        avenControls: false,
        home: 'CaveView/',
        surveyDirectory: 'surveys/',
        terrainDirectory: 'terrain/',
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
        view: {
            cameraType: CV2.CAMERA_ORTHOGRAPHIC,
            shading: CV2.SHADING_SINGLE,
            stations: true,
            terrain: true,
            terrainShading: "Modern: Satellite",
            terrainOpacity: 0.7,
            view: CV2.VIEW_PLAN,
        },
    });

    viewer.addOverlay( 'Modern: OS Outdoor', new OSDataHubProvider( 'Outdoor_3857', '2GHbE0Pal0c0f9ZxE69vPvIIVRgGADts') );
    viewer.addOverlay( 'Modern: Satellite', new MapBoxProvider( 'mapbox.satellite', 'pk.eyJ1IjoiYXJpY29vcGVyZGF2aXMiLCJhIjoiY2xydGQ2c2RzMDVreTJpbXhxcnF5ZWEzZSJ9.dB0-lgAaKzyrQ-MvVrrvPg') );
    viewer.addOverlay( 'Historic: OS 25 inch 1873-1888', new NLSProvider( '25_inch/cornwall_1st' ) );
    viewer.addOverlay( 'Historic: OS 25 inch 1892-1948', new NLSProvider( '25_inch/cornwall' ) );
    viewer.addOverlay( 'Plan: HB_S4_2', new MapBoxProvider( 'aricooperdavis.65d3q4aj', 'pk.eyJ1IjoiYXJpY29vcGVyZGF2aXMiLCJhIjoiY2xydGQ2c2RzMDVreTJpbXhxcnF5ZWEzZSJ9.dB0-lgAaKzyrQ-MvVrrvPg') );
    viewer.addOverlay( 'Plan: HB_S4_5', new MapBoxProvider( 'aricooperdavis.402d88gp', 'pk.eyJ1IjoiYXJpY29vcGVyZGF2aXMiLCJhIjoiY2xydGQ2c2RzMDVreTJpbXhxcnF5ZWEzZSJ9.dB0-lgAaKzyrQ-MvVrrvPg') );
    viewer.addOverlay( 'Plan: HB_S10_2', new MapBoxProvider( 'aricooperdavis.8jfkse91', 'pk.eyJ1IjoiYXJpY29vcGVyZGF2aXMiLCJhIjoiY2xydGQ2c2RzMDVreTJpbXhxcnF5ZWEzZSJ9.dB0-lgAaKzyrQ-MvVrrvPg') );
    viewer.addOverlay( 'Plan: M_220_1', new MapBoxProvider( 'aricooperdavis.dasiign4', 'pk.eyJ1IjoiYXJpY29vcGVyZGF2aXMiLCJhIjoiY2xydGQ2c2RzMDVreTJpbXhxcnF5ZWEzZSJ9.dB0-lgAaKzyrQ-MvVrrvPg') );

    let ui = new CV2.CaveViewUI(viewer);
    ui.loadCave('pell.3d');
});