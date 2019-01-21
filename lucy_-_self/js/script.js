            if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
            var FLOOR = -250;
            var container, stats;
            var camera, scene, renderer;
            var mesh, zmesh, geometry;
            var loader;
            var directionalLight, pointLight;
            var mouseX = 0, mouseY = 0;
            var windowHalfX = window.innerWidth / 2;
            var windowHalfY = window.innerHeight / 2;
            init();
            animate();
            function init() {
                // container = document.createElement('div');
                container = document.getElementById( 'three_background' );
                document.body.appendChild(container);
                camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100000 );
                camera.position.z =  - 4000;
                
                var urls = [
                    "./images/Magic_Eye_Raindrop.png", 
                    "./images/Magic_Eye_Raindrop.png",
                    "./images/Magic_Eye_Raindrop.png",
                    "./images/Magic_Eye_Raindrop.png",
                    "./images/Magic_Eye_Raindrop.png",
                    "./images/Magic_Eye_Raindrop.png"

                ];
               // var urls = [
               //      "./images/flag.jpg", 
               //      "./images/flag.jpg", 
               //      "./images/flag.jpg", 
               //      "./images/flag.jpg", 
               //      "./images/flag.jpg", 
               //      "./images/flag.jpg" 
               //  ];
                var textureCube = new THREE.CubeTextureLoader().load( urls );
                textureCube.mapping = THREE.CubeRefractionMapping;
                scene = new THREE.Scene();
                scene.background = textureCube;


                // LIGHTS
                var ambient = new THREE.AmbientLight( 0xffffff );
                scene.add( ambient );
                pointLight = new THREE.PointLight( 0xffffff, 2 );
                scene.add( pointLight );
                // light representation
                var sphere = new THREE.SphereBufferGeometry( 100, 16, 8 );
                var mesh = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
                mesh.scale.set( 0.05, 0.05, 0.05 );
                pointLight.add( mesh );
                // material samples
                var cubeMaterial3 = new THREE.MeshPhongMaterial( { color: 0xccddff, envMap: textureCube, refractionRatio: 0.98, reflectivity: 0.9 } );
                var cubeMaterial2 = new THREE.MeshPhongMaterial( { color: 0xccfffd, envMap: textureCube, refractionRatio: 0.985 } );
                var cubeMaterial1 = new THREE.MeshPhongMaterial( { color: 0xffffff, envMap: textureCube, refractionRatio: 0.98 } );
                //
                renderer = new THREE.WebGLRenderer();
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( window.innerWidth, window.innerHeight );
                container.appendChild( renderer.domElement );
                stats = new Stats();
                // container.appendChild( stats.domElement );
                loader = new THREE.PLYLoader();
                loader.load( './images/Lucy100k.ply', function( geometry ) { createScene( geometry, cubeMaterial1, cubeMaterial2, cubeMaterial3 ) } );
                document.addEventListener('mousemove', onDocumentMouseMove, false);
                //
                window.addEventListener( 'resize', onWindowResize, false );
            }
            function onWindowResize() {
                windowHalfX = window.innerWidth / 2;
                windowHalfY = window.innerHeight / 2;
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize( window.innerWidth, window.innerHeight );
            }
            function createScene( geometry, m1, m2, m3 ) {
                geometry.computeVertexNormals();
                var s = 3.5;
                var mesh = new THREE.Mesh( geometry, m1 );
                mesh.rotation.z = - 20;
                mesh.rotation.x = - 20;
                mesh.rotation.y = - 20;
                mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
                scene.add( mesh );
                // var mesh = new THREE.Mesh( geometry, m2 );
                // mesh.position.x = - 1500;
                // mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
                // scene.add( mesh );
                // var mesh = new THREE.Mesh( geometry, m3 );
                // mesh.position.x = 1500;
                // mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
                // scene.add( mesh );
            }
            function onDocumentMouseMove(event) {
                mouseX = ( event.clientX - windowHalfX ) * 4;
                mouseY = ( event.clientY - windowHalfY ) * 4;
            }
            var angle = 0;
            var radius = 1000; 
            function animate() {
                // Use Math.cos and Math.sin to set camera X and Z values based on angle. 
                camera.position.x = radius * Math.cos( angle );  
                camera.position.z = radius * Math.sin( angle );
                angle += 0.0004;
                requestAnimationFrame( animate );
                render();
                stats.update();
            }
            function render() {
                var timer = -0.0002 * Date.now();
                camera.position.x += ( mouseX - camera.position.x ) * .05;
                camera.position.y += ( - mouseY - camera.position.y ) * .05;
                camera.lookAt( scene.position );
                pointLight.position.x = 1500 * Math.cos( timer );
                pointLight.position.z = 1500 * Math.sin( timer );
                renderer.render( scene, camera );
            }
