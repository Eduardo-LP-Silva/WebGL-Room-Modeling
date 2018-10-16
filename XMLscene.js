var DEGREE_TO_RAD = Math.PI / 180; //Formula to convert from degrees to radians 

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene 
{
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) 
    {
        super();
        this.interface = myinterface;
        this.interface.initKeys();
    
        this.viewIndex = 0;
        this.oldViewIndex = this.viewIndex;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) 
    {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
       this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() 
    {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) 
        {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) 
            {
                var light = this.graph.lights[key];

                //lights are predefined in cgfscene
                this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
                this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);

                this.lights[i].setVisible(true);

                if(light[5] != null && light[6] != null && light[7].length != 0)
                {
                    this.lights[i].setSpotCutOff(light[5]);
                    this.lights[i].setSpotExponent(light[6]);
                    this.lights[i].setSpotDirection(light[7][0], light[7][1], light[7][2]);
                }

                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }

            
        }
    }


    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() 
    {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambientIllumination[0], 
            this.graph.ambientIllumination[1], this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);

        this.initLights();

        // Adds lights group.
        this.interface.addLightsGroup(this.lights);
        this.interface.addViewsGroup(this.graph.views);
        
        var cameraSpecs = this.graph.views[this.graph.defaultViewID];

        this.camera.fov = cameraSpecs[1];
        this.camera.near = cameraSpecs[2];
        this.camera.far = cameraSpecs[3];
        this.camera.setPosition(cameraSpecs[4]);
        this.camera.setTarget(cameraSpecs[5]);
        this.viewIndex = this.graph.defaultViewID;
        this.oldViewIndex = this.viewIndex;
       

        this.sceneInited = true;
    }


    /**
     * Displays the scene.
     */
    display() 
    {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        if(this.viewIndex != this.oldViewIndex)
        {
            var cameraSpecs = this.graph.views[this.viewIndex];

            this.camera.fov = cameraSpecs[1];
            this.camera.near = cameraSpecs[2];
            this.camera.far = cameraSpecs[3];
            this.camera.setPosition(cameraSpecs[4]);
            this.camera.setTarget(cameraSpecs[5]);
            this.oldViewIndex = this.viewIndex;
        }
        
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) 
        {
            // Draw axis
            this.axis.display();

            for (var i = 0; i < this.lights.length; i++)
                this.lights[i].update();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        else 
        {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    
}