/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface 
{
    /**
     * @constructor
     */
    constructor() 
    {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) 
    {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        return true;
    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) 
    {
        var group = this.gui.addFolder("Lights");

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        var i = 0;

        for (var key in this.scene.graph.lights) 
        {
            if (this.scene.graph.lights.hasOwnProperty(key)) 
            {
                group.add(lights[i], 'enabled').name(key);
            }

            i++;
        }
            
    }

    /**
     * Adds a new Views folder to the GUI
     * @param {The associative array containing all the information regarding the scene's views} views 
     */
    addViewsGroup(views)
    {
        var group = this.gui.addFolder("Views");
        var viewIDs = [];

        for (var key in views) 
        {
            if (views.hasOwnProperty(key)) 
            {
                viewIDs.push(key);
            }
        }

        group.add(this.scene, "viewIndex", viewIDs);
    }

    /**
     * Initiates Key Processing
     */
    initKeys()
    {
        this.processKeyboard=function(){};
        this.activeKeys={};
    };

    processKeyDown(event) 
	{
		this.activeKeys[event.code]=true;
	};
		
	processKeyUp(event) 
	{
		this.activeKeys[event.code]=false;
	};
		
	isKeyPressed(keyCode) 
	{
		return this.activeKeys[keyCode] || false;
    };

    /**
     * Handles the key inputs
     */
    handleInputs()
    {
        if(this.isKeyPressed("KeyM"))
        {
            console.log("Changed Materials");
            
            for(var key in this.scene.graph.nodes) 
            {
                if(this.scene.graph.nodes.hasOwnProperty(key)) 
                {
                    let index = this.scene.graph.nodes[key].materialIndex;

                    if(this.scene.graph.nodes[key].materials.length != 0)
                        if(index == this.scene.graph.nodes[key].materials.length - 1)
                            this.scene.graph.nodes[key].materialIndex = 0;
                        else
                            this.scene.graph.nodes[key].materialIndex++;
                }
            }   
        }

    }
}