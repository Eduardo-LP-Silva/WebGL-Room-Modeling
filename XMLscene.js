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
    
        this.activeCamera = 0; //The index associated with the active camera
        this.oldViewIndex = this.activeCamera; //The second camera index used to check if the camera has changed
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
        this.objects=[
		        new CGFplane(this),
		        new CGFplane(this),
		        new CGFplane(this),
		        new CGFplane(this),
		        new CGFplane(this),
		        new CGFplane(this),
		        new CGFplane(this),
		        new CGFplane(this),
		        new CGFplane(this),
		        new CGFplane(this),
		        new CGFplane(this),
		        new CGFplane(this),
		        new CGFplane(this),
		        new CGFplane(this),
		        new CGFplane(this),
		        new CGFplane(this),
		        new CGFplane(this),
		        new CGFplane(this),
            new CGFplane(this),

            new CGFplane(this)]; //the last one is for the extra id
        //for(var i = 0; i < 4, i++){
        //  var plane = new CGFplane(this);
		    //  this.objects.push(plane);
        //}
    }

    /**
     * Initializes the scene's camera.
     */
    initCameras()
    {
       this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    /**
     * Initializes the scene's lights with the values read from the XML file.
     */
    initLights()
    {
        var i = 0; // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights)
        {
            if (i >= 8)
                break; // Only eight lights allowed by WebGL.

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
     * As loading is asynchronous, this may be called already after the application has started the run loop.
     */
    onGraphLoaded()
    {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2],
            this.graph.background[3]);
        this.setGlobalAmbientLight(this.graph.ambientIllumination[0],
            this.graph.ambientIllumination[1], this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);

        this.initLights();

        // Adds lights group.
        this.interface.addLightsGroup(this.lights);
        
        //Associates the camera with the default one referenced in the XML file.
        var cameraSpecs = this.graph.views[this.graph.defaultViewID];

        if(cameraSpecs[0] == 'P')
            this.camera = new CGFcamera(cameraSpecs[1], cameraSpecs[2], cameraSpecs[3], cameraSpecs[4], 
                cameraSpecs[5]);
        else
            if(cameraSpecs[0] == 'O')
                this.camera = new CGFcameraOrtho(cameraSpecs[1], cameraSpecs[2], cameraSpecs[3], cameraSpecs[4], 
                    cameraSpecs[5], cameraSpecs[6], cameraSpecs[7], cameraSpecs[8], cameraSpecs[9]);
            else
                this.camera = cameraSpecs[1];
        
        this.interface.setActiveCamera(this.camera);
        this.activeCamera = this.graph.defaultViewID;
        this.oldViewIndex = this.activeCamera;
        this.interface.addViewsGroup(this.graph.views);
        this.setUpdatePeriod(10);

        this.sceneInited = true;
    }

    /**
     * Reipmplementation of the update function of CGFscene.
     * @param {long} currTime
     */
    update(currTime)
    {
        this.updateComponentAnimations(currTime);
        this.updatePlayerCamera(currTime);
    }

    /**
     * Goes through the nodes and updates their animations.
     * @param {long} currTime
     */
    updateComponentAnimations(currTime)
    {
        for (var key in this.graph.nodes)
        {
            if (this.graph.nodes.hasOwnProperty(key))
            {
                this.graph.nodes[key].updateAnimations(currTime);

                if(this.graph.nodes[key].build != null && this.graph.nodes[key].build instanceof Water)
                    this.graph.nodes[key].build.updateShader();
            }
        }
    }

    updatePlayerCamera(currTime)
    {
        if(this.graph.views['Player Perspective'] != null && vec3.length(this.graph.views['Player Perspective'][2]) != 0)
        {
            let playerView = this.graph.views["Player Perspective"];
            let timeDiff = (currTime - playerView[3]) / 1000;
            let totalTimeDiff = (currTime - playerView[4]) / 1000;
            let currentPosition = playerView[1].position;

            if(totalTimeDiff >= 2)
                return;

            let newPosition = vec3.fromValues(currentPosition[0] + playerView[2][0] * timeDiff, 
                currentPosition[1] + playerView[2][1] * timeDiff, currentPosition[2] + playerView[2][2] * timeDiff);

            playerView[1].setPosition(newPosition);
            playerView[3] = currTime;
        }
    }

    switchPlayerView()
    {
        if(this.graph.views["Player Perspective"] != null)
        {
            let playerView = this.graph.views["Player Perspective"];

            playerView[1].setTarget([0, 2, 20]);
            playerView[5][0] *= -1;  

            let currentPosition = playerView[1].position;

            let diffVector = vec3.create();

            vec3.subtract(diffVector, playerView[5], currentPosition);

            playerView[2][0] = diffVector[0] / 2;
            playerView[2][1] = diffVector[1] / 2;
            playerView[2][2] = diffVector[2] / 2;

            let date = new Date();

            playerView[3] = date.getTime();
            playerView[4] = playerView[3];
        }
    }

    /**
     * Displays the scene.
     */
    display()
    {
      this.logPicking();
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        //Checks if camera has changed
        if(this.activeCamera != this.oldViewIndex)
        {
            var cameraSpecs = this.graph.views[this.activeCamera];
            
            if(cameraSpecs[0] == 'P')
                this.camera = new CGFcamera(cameraSpecs[1], cameraSpecs[2], cameraSpecs[3], cameraSpecs[4],
                    cameraSpecs[5]);
            else
                if(cameraSpecs[0] == 'O')
                    this.camera = new CGFcameraOrtho(cameraSpecs[1], cameraSpecs[2], cameraSpecs[3], cameraSpecs[4], 
                        cameraSpecs[5], cameraSpecs[6], cameraSpecs[7], cameraSpecs[8], cameraSpecs[9]);
                else
                    this.camera = cameraSpecs[1];

            this.interface.setActiveCamera(this.camera);

                this.oldViewIndex = this.activeCamera;
        }

        // Initialize Model-View matrix as identity (no transformation)
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
        this.pushMatrix();
          this.translate(0, 2.601, 20);
          this.scale(0.26, 0.26, 0.26)
          this.translate(-10, 0, 9);

          for(var i = 0; i < this.objects.length; i++){
            this.registerForPick(i+1, this.objects[i]);
            if(this.pickMode){
              this.objects[i].display()
            };//dont show the planes
            this.translate(0, 0, -1);

          }

        this.popMatrix();

    }

    logPicking(){
      if (this.pickMode == false) {
		      if (this.pickResults != null && this.pickResults.length > 0) {
			         for (var i=0; i< this.pickResults.length; i++) {
				           var obj = this.pickResults[i][0];
				           if (obj){
					             var customId = this.pickResults[i][1];
					             console.log("Picked object: " + obj + ", with pick id " + customId);
				           }
			         }
			         this.pickResults.splice(0,this.pickResults.length);
		      }
	     }
    }
}
