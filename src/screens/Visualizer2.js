(function(VIZ)
{
    var p = Visualizer.prototype;
    var blockWidth = 5;
    var spacerWidth = 3;
    var numCubes = Math.floor((Globals.STAGE_WIDTH / spacerWidth) / 10);
    var spacer = Math.floor(numCubes / 2) * -1;

    p.view = null;
    p.camera = null;
    p.scene = null;
    p.pointLight1 = null;
    p.pointLight2 = null;
    p.ambientLight = null;
    p.geometry = null;
    p.material = null;
    p.cubes = [];
    p.renderer = null;

    function Visualizer()
    {
        this.createView();
        this.create3dView();
    }

    p.createView = function()
    {

    };

    p.create3dView = function()
    {
        this.camera = new THREE.PerspectiveCamera(45, VIZ.core.aspectRatio, 1, 15000);
        this.camera.position.z = 300;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 1, 15000);

        this.pointLight1 = new THREE.PointLight(0xffffff);
        this.pointLight1.position.set(100, 100, 100);
        this.scene.add(this.pointLight1);

        this.pointLight2 = new THREE.PointLight(0xdddddd);
        this.pointLight2.position.set(-100, -100, 500);
        this.scene.add(this.pointLight2);

        this.ambientLight = new THREE.AmbientLight(0x111111);
        this.scene.add(this.ambientLight);

        this.geometry = new THREE.CubeGeometry(blockWidth, 100, blockWidth);
        this.material = new THREE.MeshLambertMaterial({ color: 0xffffff, morphTargets: true });

        for (i = 0; i < this.geometry.vertices.length; i++)
        {
            var vertices = [];

            for (var v = 0; v < this.geometry.vertices.length; v++)
            {
                vertices.push(this.geometry.vertices[v].clone());

                if (v === i)
                {
                    vertices[vertices.length - 1].x *= 2;
                    vertices[vertices.length - 1].y *= 2;
                    vertices[vertices.length - 1].z *= 2;
                }
            }

            this.geometry.morphTargets.push({ name: "target" + i, vertices: vertices });
        }

        for (i = 0; i < numCubes; i++)
        {
            var cube = new THREE.Mesh(this.geometry, this.material);
            cube.position.x = spacer * (blockWidth + spacerWidth);

            this.cubes.push(cube);
            scene.add(cube);

            spacer++;
        }

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(Globals.STAGE_WIDTH, Globals.STAGE_HEIGHT);
        this.renderer.setClearColor(0x444444, 1);
        this.renderer.sortObjects = false;

        //text = createLabel("Datassette - Malfunction", window.self.innerWidth / 2, window.self.innerHeight / 2 - 300, 0, 100, "black", "yellow");

        document.body.appendChild(this.renderer.domElement);

        this.tick();
    };

    p.tick = function()
    {
        requestAnimationFrame(this.tick.bind(this));

        for (var i = 0; i < numCubes; i++)
        {
            cubes[i].scale.y = 1;
            cubes[i].scale.z = 1;
        }

        this.camera.lookAt(this.scene.position);
        this.renderer.render(this.scene, this.camera);
    };

    p.update = function()
    {

    };

    p.dispose = function()
    {

    };

    VIZ.Visualizer = Visualizer;
})(window.VIZ);