var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph 
{
    /**
     * @constructor
     */
    constructor(filename, scene) 
    {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];
        this.idRoot = null; // The id of the root element.
        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];
        this.referenceLength = 0;
        this.ambientIllumination = [];
        this.background = [];
        this.textures = [];
        this.materials = [];
        this.transformations = [];
        this.root = null;

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() 
    {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) 
        {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) 
    {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";
 
        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++)
            nodeNames.push(nodes[i].nodeName);
           
        
            
        
        var error, index;

        // Processes each node, verifying errors.

        // <scene>
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else 
        {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error; 
        }

        //<views>
        if((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing\n";
        else
        {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            if((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        //<ambient>
        if((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing\n";
        else
        {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            if((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else 
        {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else 
        {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <TEXTURES> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else 
        {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else 
        {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else 
        {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse transformations block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>

        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else 
        {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse transformations block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
    }

    /**
     * Parses the <scene> node
     * @param {scene block element} sceneNode 
     */
    parseScene(sceneNode)
    {
        var root = this.reader.getString(sceneNode, "root");

        if(root == null)
            return "No root defined for scene\n";
        else
            this.idRoot = root;

        this.referenceLength = this.reader.getFloat(sceneNode, "axis_length");

        if(this.referenceLength == null || isNaN(this.referenceLength))
            return "No axis length defined for scene\n";

        this.log("Parsed scene");
    }

    /**
     * Parses the <views> node
     * @param {views block element} viewNode 
     */
    parseViews(viewNode)
    {
        var children = viewNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        //TODO Do smt with this information

        this.log("Parsed views");
    }

    /**
     * Parses the <ambient> node
     * @param {ambient block element} ambientNode 
     */
    parseAmbient(ambientNode)
    {
        var children = ambientNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var index = nodeNames.indexOf("ambient");

        if(index == null)
            return "<ambient> illumination tag not found\n";

        this.ambientIllumination = this.retrieveColor(children[index], "<ambient> tag");

        if(typeof this.ambientIllumination == "string")
            return this.ambientIllumination;

        index = nodeNames.indexOf("background");

        if(index == null)
            return "<backgroud> tag not found\n";

        this.background = this.retrieveColor(children[index], "<background> tag");

        if(typeof this.background == "string")
            return this.background;  

        this.log("Parsed ambient");
    }


    /**
     * Parses the <lights> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) 
    {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        var angle = 0;
        var exponent = 0;

        // Any number of lights.
        for (var i = 0; i < children.length; i++) 
        {

            if (children[i].nodeName != "omni") 
                if(children[i].nodeName != "spot")
                {
                    this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                    continue;
                }
                else
                {
                    angle = this.reader.getFloat(children[i], "angle");
                    exponent = this.reader.getFloat(children[i], "exponent");
                }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            var enableIndex = this.reader.getFloat(children[i], "enabled");

            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];

            for (var j = 0; j < grandChildren.length; j++) 
                nodeNames.push(grandChildren[j].nodeName);
            

            // Gets indices of each element.
            var positionIndex = nodeNames.indexOf("location");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");
            var targetIndex = nodeNames.indexOf("target");

            // Light enable/disable
            if (enableIndex == -1) 
                this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
            

            // Retrieves the light position.
            var positionLight = [];

            if (positionIndex != -1) 
            {
                // x
                var x = this.reader.getFloat(grandChildren[positionIndex], 'x');

                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[positionIndex], 'y');

                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[positionIndex], 'z');

                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[positionIndex], 'w');

                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(w);
            }
            else
                return "light position undefined for ID = " + lightId;

            // Retrieves the ambient component.
            var ambientIllumination = this.retrieveColor(grandChildren[ambientIndex], lightId);

            if(typeof ambientIllumination == "string")
                return ambientIllumination;

            //Retrieves the diffuse component

            var diffuseIllumination = this.retrieveColor(grandChildren[diffuseIndex], lightId);

            if(typeof diffuseIllumination == "string")
                return diffuseIllumination;

            //Retrieves the specular component

            var specularIllumination = this.retrieveColor(grandChildren[specularIndex], lightId);

            if(typeof specularIllumination == "string")
                return specularIllumination;

            //Retrieves the target component

            var targetPosition = [];

            if (targetIndex != -1 && children[i].nodeName == "spot") 
            {
                // x
                var tx = this.reader.getFloat(grandChildren[positionIndex], 'x');

                if (!(tx != null && !isNaN(tx)))
                    return "unable to parse target x-coordinate of the light position for ID = " + lightId;
                else
                    targetPosition.push(tx);

                // y
                var ty = this.reader.getFloat(grandChildren[positionIndex], 'y');

                if (!(ty != null && !isNaN(ty)))
                    return "unable to parse target y-coordinate of the light position for ID = " + lightId;
                else
                    targetPosition.push(ty);

                // z
                var tz = this.reader.getFloat(grandChildren[positionIndex], 'z');

                if (!(tz != null && !isNaN(tz)))
                    return "unable to parse target z-coordinate of the light position for ID = " + lightId;
                else
                    targetPosition.push(tz);
            }

            this.lights[lightId] = [enableIndex, positionLight, ambientIllumination, diffuseIllumination, specularIllumination];
        
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) 
    {
        var children = texturesNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        for(var i = 0; i < children.length; i++)
        {
            if(children[i].nodeName != "texture")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }   

            var textureID = this.reader.getString(children[i], "id");

            if (textureID == null)
                return "no ID defined for texture";

            if(this.textures[textureID] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureID + ")";

            var textureFile = this.reader.getString(children[i], "file");

            if(textureFile == null)
                return "No file defined for texture\n";

            this.textures[textureID] = [textureFile];
        }

        this.log("Parsed textures");
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) 
    {
        var children = materialsNode.children;
        var nodeNames = [], nodeNames = [];
        var grandChildren = [];
        var shininess, shininessIndex;
        var emission = [], emissionIndex;
        var ambient = [], ambientIndex;
        var diffuse = [], diffuseIndex;
        var specular = [], specularIndex;

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        for(var i = 0; i < children.length; i++)
        {
            if(children[i].nodeName != "material")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }   

            var materialID = this.reader.getString(children[i], "id");

            if (materialID == null)
                return "no ID defined for texture";

            if(this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            shininess = this.reader.getFloat(children[i], "shininess");

            if (shininess == null)
                return "no shininess defined for material";

            nodeNames = [];
            grandChildren = children[i].children;

            for(var j = 0; j < grandChildren.length; j++)
                nodeNames.push(grandChildren[j].nodeName);

            emissionIndex = nodeNames.indexOf("emission");
            ambientIndex = nodeNames.indexOf("ambient");
            diffuseIndex = nodeNames.indexOf("diffuse");
            specularIndex = nodeNames.indexOf("specular");
            
            //Gets emission component

            emission = this.retrieveColor(grandChildren[emissionIndex], materialID);

            if(typeof emission == "string")
                return emission;

            //Gets ambient component

            ambient = this.retrieveColor(grandChildren[ambientIndex], materialID);

            if(typeof ambient == "string")
                return emission;
                
            //Gets diffuse component

            diffuse = this.retrieveColor(grandChildren[diffuseIndex], materialID);

            if(typeof diffuse == "string")
                return diffuse;

            //Gets specular component

            specular = this.retrieveColor(grandChildren[specularIndex], materialID);

            if(typeof specular == "string")
                return specular;   

            this.materials[materialID] = [shininess, emission, ambient, diffuse, specular];
        }

        this.log("Parsed materials");
    }

    /**
     * Parses the <transformations> node
     * @param {transformation block element} transformationsNode 
     */
    parseTransformations(transformationsNode)
    {
        var children = transformationsNode.children;

        for(var i = 0; i < children.length; i++)
        {
            if(children[i].nodeName != "transformation")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            this.parseTransformation(children[i]);
        }

        this.log("Parsed transformations");
    }

    /**
     * Parses a single transformation block
     * @param {a single transformation block} transformationBlock 
     */
    parseTransformation(transformationBlock)
    {
        var transformationID = this.reader.getString(transformationBlock, "id");

        if(transformationID == null)
            return "No ID defined for this transformation";

        if(this.transformations[transformationID] != null)
            return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

        this.transformations[transformationID] = mat4.create();

        var transformationErrorTag = "Transformation " + transformationID + ": ";
        var children = transformationBlock.children;
        var xyz;

        for(var i = 0; i < children.length; i++)
        {
            switch(children[i].nodeName)
            {
                case "translate":
                    xyz = this.getXYZ(children[i]);

                    if(typeof xyz == "string")
                        return transformationErrorTag + xyz;
                    else
                        mat4.translate(this.transformations[transformationID], this.transformations[transformationID], 
                            xyz);

                    break;

                case "scale":
                    xyz = this.getXYZ(children[i]);

                    if(typeof xyz == "string")
                        return transformationErrorTag + xyz;
                    else
                        mat4.scale(this.transformations[transformationID], this.transformations[transformationID], 
                            xyz);

                    break;

                case "rotate":
                    
                    var axis = this.reader.getString(children[i], "axis"), 
                        angle = this.reader.getFloat(children[i], "angle");
                    var vec = vec3.create();

                    switch(axis)
                    {
                        case "x":
                            vec3.set(vec, 1, 0, 0);
                            break;

                        case "y":
                            vec3.set(vec, 0, 1, 0);
                            break;

                        case "z":
                            vec3.set(vec, 0, 0, 1);
                            break;

                        default:
                            this.log("Error in axis");
                    }

                    if(axis == null || angle == null)
                        return transformationErrorTag + "Rotation not properly defined";

                    mat4.rotate(this.transformations[transformationID], this.transformations[transformationID], 
                        angle * DEGREE_TO_RAD, vec);

                    break;
            }
        } 
    }

    /**
     * Parses the primitives node
     * @param {primitives block} primitivesNode 
     */
    parsePrimitives(primitivesNode)
    {
        var children = primitivesNode.children;

        for(var i = 0; i < children.length; i++)
        {
            if(children[i].nodeName != "primitive")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else
            {
                var error = this.parsePrimitive(children[i]);

                if(error != null)
                    return error;
            }
                
        }
            
        this.log("parsed primitives");
    }

    /**
     * Processes a single primitive block
     * @param {the single primitive block to be processed} primitiveBlock 
     */
    parsePrimitive(primitiveBlock)
    {
        var primitiveID = this.reader.getString(primitiveBlock, "id");
        var build;

        if(this.nodes[primitiveID] != null)
            return "ID must be unique for each primitive (conflict: ID = " + primitiveID + ")";

        var children = primitiveBlock.children;

        if(children.length == 0)
            return "At least one primitive object must be declared";

        switch(children[0].nodeName)
        {
            case "rectangle":
                build = new MyQuad(this.scene, this.reader.getFloat(children[0], "x1"), 
                    this.reader.getFloat(children[0], "y1"), this.reader.getFloat(children[0], "x2"), 
                    this.reader.getFloat(children[0], "y2"));

                break;

            case "triangle":
                var vCoords = [], p1 = [], p2 = [], p3 = [];

                p1.push(this.reader.getFloat(children[0], "x1"), this.reader.getFloat(children[0], "y1"), 
                    this.reader.getFloat(children[0], "z1"));

                p2.push(this.reader.getFloat(children[0], "x2"), this.reader.getFloat(children[0], "y2"), 
                    this.reader.getFloat(children[0], "z2"));

                p3.push(this.reader.getFloat(children[0], "x3"), this.reader.getFloat(children[0], "y3"), 
                    this.reader.getFloat(children[0], "z3"));
                
                vCoords.push(p1, p2, p3);

                build = new MyTriangle(this.scene, vCoords);
                break;

            case "cylinder":
                build = new MyCylinder(this.scene, this.reader.getFloat(children[0], "base"), 
                    this.reader.getFloat(children[0], "top"), this.reader.getFloat(children[0], "height"), 
                    this.reader.getFloat(children[0], "slices"), this.reader.getFloat(children[0], "stacks"));

                break;

            case "sphere":
                build = new MySphere(this.scene, this.reader.getFloat(children[0], "slices"), 
                    this.reader.getFloat(children[0], "stacks"), this.reader.getFloat(children[0], "radius"));
                break;

            case "torus":
                build = new MyTorus(this.scene, this.reader.getFloat(children[0], "inner"), 
                    this.reader.getFloat(children[0], "outer"), this.reader.getFloat(children[0], "slices"), 
                    this.reader.getFloat(children[0], "loops"));

                break;

            default:
                return "Tag not identified on primitive " + primitiveID;
        }
        
        this.nodes[primitiveID] = new MyNode(build, primitiveID);
        
    }
    /**
     * Processes the components node
     * @param {The components node} componentsNode 
     */
    parseComponents(componentsNode)
    {
        var children = componentsNode.children;
        var componentID;
        var error;

        //First pass - Merely add them to the list
        for(let i = 0; i < children.length; i++)
        {
            if(children[i].nodeName != "component")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            componentID = this.reader.getString(children[i], "id");

            if(this.nodes[componentID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + componentID + ")";
            else
                this.nodes[componentID] = new MyNode(null, componentID);
        }

        if(this.nodes[this.idRoot] == null)
            return "Root element isn't present in components";
        else
            this.root = this.nodes[this.idRoot];


        //Second pass - analyze & parse remaining details
        
        for(let i = 0; i < children.length; i++)
        {
            let error = this.parseComponent(children[i]);

            if(error != null)
                return error;
        } 

        this.log("Parsed components");
    }

    /**
     * Processes a single component block
     * @param {The single component block} componentBlock 
     */
    parseComponent(componentBlock)
    {
        var children = componentBlock.children;
        var i, nodeNames = [], index;
        var tranformationMatrix, materialList = [], textureSpecs = [], childrenList = [];
        var componentID = this.reader.getString(componentBlock, "id");

        for(i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        index = nodeNames.indexOf("transformation");

        if(index == null)
            return "No transformation tag present in component " + componentID;
    
        if(typeof (tranformationMatrix = this.parseComponentTransformation(children[index], componentID)) == "string")
            return tranformationMatrix;

        index = nodeNames.indexOf("materials");
            
        if(index == null)
            return "No materials tag present in component " + componentID;
    
        if(typeof (materialList = this.parseComponentMaterials(children[index], componentID)) == "string")
            return materialList;

        index = nodeNames.indexOf("texture");

        if(index == null)
            return "No texture tag present in component: " + componentID;

        if(typeof (textureSpecs = this.parseComponentTexture(children[index], componentID)) == "string")
            return textureSpecs;

        index = nodeNames.indexOf("children");

        if(index == null)
            return "No children tag present in component: " + componentID;

        if(typeof (childrenList = this.parseComponentChildren(children[index], componentID)) == "string")
            return childrenList;
    }

    /**
     * Parses the children block in a component.
     * @param {The component's children block} componentChildrenBlock 
     * @param {The component's ID} componentID 
     */
    parseComponentChildren(componentChildrenBlock, componentID)
    {
        var children = componentChildrenBlock.children;

        if(children.length == 0)
            return "Component " + componentID + ": At least one child must be declared";

        var childrenID, childrenList = [];

        for(let i = 0; i < children.length; i++)
        {
            childrenID = this.reader.getString(children[i], "id");

            if(this.nodes[childrenID] == null)
                return "Component " + componentID + ": Children " + childrenID +  " not previously declared";
            
            childrenList.push(childrenID);
        }

        this.nodes[componentID].children = childrenList;
    }

    /**
     * Parses the transformation block of a component.
     * @param {The component's tranformation block} componentTransformationBlock 
     * @param {The component's ID} componentID
     */
    parseComponentTransformation(componentTransformationBlock, componentID)
    {
        var children = componentTransformationBlock.children;
        var transformationMatrix, xyz;

        for(let i = 0; i < children.length; i++)
        {
            switch(children[i].nodeName)
            {
                case "transformationref":
                    let transformationID = this.reader.getString(children[i], "id");

                    if(this.transformations[transformationID] == null)
                        return "Component " + componentID + ": Transformation " + transformationID + 
                            " not defined previously";
                    else
                        if(i == 0)
                            transformationMatrix = this.transformations[transformationID];
                        else
                            mat4.mul(transformationMatrix, transformationMatrix, this.transformations[transformationID]);
            
                    break;

                case "translate":

                    if(i == 0)
                        transformationMatrix = mat4.create();

                    xyz = this.getXYZ(children[i]);

                    if(typeof xyz == "string")
                        return transformationErrorTag + xyz;
                    else
                        mat4.translate(transformationMatrix, transformationMatrix, xyz);

                    break;

                case "scale":

                    if(i == 0)
                        transformationMatrix = mat4.create();

                    xyz = this.getXYZ(children[i]);

                    if(typeof xyz == "string")
                        return transformationErrorTag + xyz;
                    else
                        mat4.scale(transformationMatrix, transformationMatrix, xyz);

                    break;

                case "rotate":
                
                    if(i == 0)
                        transformationMatrix = mat4.create();

                    var axis = this.reader.getFloat(children[i], "axis"), 
                        angle = this.reader.getFloat(children[i], "angle");

                    switch(axis)
                    {
                        case "x":
                            axis = [1, 0, 0];
                            break;

                        case "y":
                            axis = [0, 1, 0];
                            break;

                        case "z":
                            axis = [0, 0, 1];
                            break;
                    }

                    if(axis == null || angle == null)
                        return transformationErrorTag + "Rotation not properly defined";

                    mat4.rotate(transformationMatrix, transformationMatrix, angle * DEGREE_TO_RAD, axis);

                    break;

                default:
                    return "Component " + componentID + ": Transformation error"; 
            }
            
        }
        this.nodes[componentID].transformations = transformationMatrix;
    }

    /**
     * Parses the materials block in a component.
     * @param {The component's materials block} componentMaterialsBlock 
     * @param {The component's ID} componentID 
     */
    parseComponentMaterials(componentMaterialsBlock, componentID)
    {
        var children = componentMaterialsBlock.children;
        var materialID, materialList = [];

        for(let i = 0; i < children.length; i++)
        {
            if(children[i].nodeName != "material")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            materialID = this.reader.getString(children[i], "id");

            if(materialID == "inherit" || this.materials[materialID] != null)
                materialList.push(this.materials[materialID]);
            else
                return "Component " + componentID + ": Material " + materialID + 
                    " not defined previously";
        }

        this.nodes[componentID].materials = materialList;
    }

    /**
     * Parses the texture tag of a component.
     * @param {The component's texture tag} componentTextureTag 
     * @param {The component's id} componentID 
     */
    parseComponentTexture(componentTextureTag, componentID)
    {
        var textureID = this.reader.getString(componentTextureTag, "id");
        var textureSpecs = [];

        if(textureID == "inherit" || textureID == "none")
            textureSpecs.push(textureID);
        else
            textureSpecs.push(this.textures[textureID]);

        textureSpecs.push(this.reader.getFloat(componentTextureTag, "length_s"));
        textureSpecs.push(this.reader.getFloat(componentTextureTag, "length_t"));

        this.nodes[componentID].texture = textureSpecs;
    }

    /**
     * Returns the XYZ values from a tag
     * @param {the tag containing the XYZ values} tag 
     */
    getXYZ(tag)
    {
        var xyz = [];

        xyz.push(this.reader.getFloat(tag, "x"));
        xyz.push(this.reader.getFloat(tag, "y"));
        xyz.push(this.reader.getFloat(tag, "z"));

        if(xyz[0] == null || xyz[1] == null || xyz[2] == null)
            return "XYZ values not properly defined";
        else
            return xyz;
    }

    /**
     * Retrieves RGBA components from a generic tag
     * @param {tag containing RGBA components} tag
     * @param {object ID} ID
     */
    retrieveColor(tag, ID)
    {
        var colorArray = [];

        var r = this.reader.getFloat(tag, 'r');

        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component for ID = " + ID;
        else
            colorArray.push(r);

        // G
        var g = this.reader.getFloat(tag, 'g');

        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component for ID = " + ID;
        else
            colorArray.push(g);

        // B
        var b = this.reader.getFloat(tag, 'b');

        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component for ID = " + ID;
        else
            colorArray.push(b);

        // A
        var a = this.reader.getFloat(tag, 'a');

        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component for ID = " + ID;
        else
            colorArray.push(a);

        return colorArray;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) 
    {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) 
    {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) 
    {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() 
    {
        this.displayNode(this.idRoot);
    }

    /**
     * Displays a node
     * @param {The node's ID} nodeID
     * @param {The texture associated} textureInit
     * @param {The material associated} materialInit
     */
    displayNode(nodeID, textureInit, materialInit)
    { 
        var texture = textureInit, material = materialInit;
        var node;

        if(nodeID != null)
            node = this.nodes[nodeID];
        else
            this.log("Error in node ID");

        if(node.texture.length != 0)
            texture = node.texture;

        if(node.materials.length != 0)
            material = node.materials;

        this.scene.pushMatrix();

        if(node.transformations != null)
        {
            this.scene.multMatrix(node.transformations);
        }
             
        for(let i = 0; i < node.children.length; i++)
        {
            this.displayNode(node.children[i], texture, material);
        }

        if(node.build != null)
        {
            //Aplicar textura e material
            node.build.display();
        } 

        this.scene.popMatrix();
    }
}