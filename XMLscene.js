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
        this.objects=[];
        //for(var i = 0; i < 4, i++){
        //  var plane = new CGFplane(this);
		    //  this.objects.push(plane);
        //}
        for(var i = 0; i < 84; i++)
        {
          var test = new CGFplane(this);
          this.objects.push(test);
        }

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
        this.graph.game.update(currTime);
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

    /**
     * Function used to update the player's view camera animation.
     * @param {float} currTime 
     */
    updatePlayerCamera(currTime)
    {
        if(this.graph.views['Player Perspective'] != null && vec3.length(this.graph.views['Player Perspective'][2]) != 0)
        {
            let playerView = this.graph.views["Player Perspective"];
            let timeDiff = (currTime - playerView[3]) / 1000;
            let totalTimeDiff = (currTime - playerView[4]) / 1000;
            let currentPosition = playerView[1].position;

            if(totalTimeDiff >= 2)
            {
                playerView[2] = vec3.fromValues(0, 0, 0);
                playerView[1] = new CGFcamera(70, 0.01, 500, playerView[5], [0, 2, 20]);
                this.camera = playerView[1];
                this.interface.setActiveCamera(playerView[1]);
                this.updateProjectionMatrix();

                if(this.graph.game.state == 2)
                    this.graph.game.resetTurnClock();
                
            }

            let newPosition = vec3.fromValues(currentPosition[0] + playerView[2][0] * timeDiff, 
                currentPosition[1] + playerView[2][1] * timeDiff, currentPosition[2] + playerView[2][2] * timeDiff);

            playerView[1].setPosition(newPosition);
            playerView[3] = currTime;
        }
    }

    /**
     * Begins the animation to switch the player's perspective.
     */
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
        this.processPicking();
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

        this.pushMatrix();// BOARD NUMBERS AND LETTERS
        this.translate(0, 2.601, 20);
        this.scale(0.26, 0.26, 0.26)
        this.translate(-10, 0, 9);

        for(var i = 0; i < 19; i++)
        {
            this.registerForPick(i+1, this.objects[i]);

            if(this.pickMode)
                this.objects[i].display(); //dont show the planes

            this.translate(0, 0, -1);
        }

        this.translate(20, 0, 1);

        for(var i = 0; i < 19; i++)
        {
            this.registerForPick(i+20, this.objects[i+19]);

            if(this.pickMode)
                this.objects[i+19].display(); //dont show the planes

            this.translate(0, 0, 1);
        }

        this.translate(-1, 0, 0);

        for(var i = 0; i < 19; i++)
        {
            this.registerForPick(i+39, this.objects[i+38]);

            if(this.pickMode)
                this.objects[i+38].display(); //dont show the planes

            this.translate(-1, 0, 0);
        }

        this.translate(1, 0, -20);

        for(var i = 0; i < 19; i++)
        {
            this.registerForPick(i+58, this.objects[i+57]);

            if(this.pickMode)
                this.objects[i+57].display(); //dont show the planes

            this.translate(1, 0, 0);
        }
        this.popMatrix();

        this.pushMatrix();
          // GAME MODES (player vs. player, player vs. bot, bot vs. bot)
          this.translate(1.9, 5.5, 24.61);
          this.scale(1.3, 0.8, 1);
          this.rotate(-90*DEGREE_TO_RAD, 1, 0, 0);

          this.registerForPick(77, this.objects[76]);
          if(this.pickMode){
            this.objects[76].display();
          }

          this.translate(-1.4, 0, 0);
          this.registerForPick(78, this.objects[77]);
          if(this.pickMode){
            this.objects[77].display();
          }
          this.translate(-1.4, 0, 0);
          this.registerForPick(79, this.objects[78]);
          if(this.pickMode){
            this.objects[78].display();
          }

          //BOT DIFFICULTY
          this.translate(1.92, 0, -1.6);
          this.scale(0.65, 1, 0.5);

          this.registerForPick(80, this.objects[79]);
          if(this.pickMode){
            this.objects[79].display();
          }

          this.translate(-1.65, 0, 0);
          this.registerForPick(81, this.objects[80]);
          if(this.pickMode){
            this.objects[80].display();
          }

          //UNDO AND REPLAY GAME
          this.translate(3.8, 0, -1.6);
          this.scale(1, 1, 1.8);

          this.registerForPick(82, this.objects[81]);
          if(this.pickMode){
            this.objects[81].display();
          }

          this.translate(-6, 0, 0);
          this.registerForPick(83, this.objects[82]);
          if(this.pickMode){
            this.objects[82].display();
          }

        this.popMatrix();
        this.registerForPick(84, this.objects[83]); // DEFAULT PLANE ID
    }

    /**
     * Processes the picking events.
     */
    processPicking()
    {
        if (this.pickMode == false) 
        {
            if (this.pickResults != null && this.pickResults.length > 0) 
            {
                for (var i=0; i< this.pickResults.length; i++) 
                {
                        var obj = this.pickResults[i][0];
                        
                        if (obj)
                        {
                            var customId = this.pickResults[i][1];				
                            console.log("Picked object: " + obj + ", with pick id " + customId);
                            
					        this.processPick(this.pickResults[i]);
				        }
			    }
                
                this.pickResults.splice(0,this.pickResults.length);
		      }
	    }
    }

    /**
     * Processes a single picking event.
     * @param {array} pickResult 
     */
    processPick(pickResult)
    {
        var customId = pickResult[1];
        
        if(customId >= 77 && customId <= 83)
            this.processTvPick(pickResult);
        else
            if(customId < 77)
                this.processBoardPick(pickResult);
    }

    /**
     * Process a picking event on the television.
     * @param {array} pickResult 
     */
    processTvPick(pickResult)
    {
        switch(pickResult[1])
        {
            case 77:
                this.graph.game.startGame(1);
                this.activeCamera = 'Player Perspective';
                break;

            case 78:
                this.graph.game.startGame(2);
                this.activeCamera = 'Player Perspective';
                break;

            case 79:
                this.graph.game.startGame(3);
                this.activeCamera = 'Player Perspective';
                break;

            case 80:
                this.graph.game.botDifficulty = 1;
                break;
            
            case 81:
                this.graph.game.botDifficulty = 2;
                break;

            case 82:
                //It's rewind time
                break;

            case 83:
                //Movie
                break;

            default:
                console.log("Tv pick not recognized | Id = " + pickResult[1]);
        }
    }

    /**
     * Processes a picking event on the board.
     * @param {array} pickResult 
     */
    processBoardPick(pickResult)
    {
        let game = this.graph.game;

        if(game.state == 1 && (game.mode == 1 || (game.mode == 2 && game.turnPlayer == 'w')))
        {
            let pickId = pickResult[1];
            let symbol, direction, move;

            if(pickId <= 38)
            {
                symbol = "'C'";
                let column;

                if(pickId <= 19)
                {
                    column = pickId;
                    direction = "'D'";
                }
                else
                {
                    column = 20 - (pickId - 20) - 1;
                    direction = "'U'"; 
                }

                move = [symbol, column, direction];
            }
            else
            {
                symbol = "'L'";
                let line;

                if(pickId <= 57)
                {
                    let aux = pickId % 19;

                    if(aux == 0)
                        aux = 19;

                    line = 20 - aux;
                    direction = "'R'";
                }
                else
                {
                    line = pickId % 19;

                    if(line == 0)
                        line = 19;

                    direction = "'L'";
                }

                move = [symbol, line, direction];
            }
            
            game.updateGame(move);
        }
    }
}
