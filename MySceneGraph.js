//Constant to convert from Degrees to Radians
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

        this.nodes = []; //The associative array containing the nodes(components + primitives)
        this.idRoot = null; // The id of the root element.
        this.axisCoords = []; //The axis coords
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];
        this.referenceLength = 0; //Axis length
        this.views = []; //Associative 2D array containing all the view/camera data
        this.ambientIllumination = [];
        this.background = [];
        this.textures = [];
        this.materials = [];
        this.transformations = [];
        this.root = null;
        this.defaultViewID = null;

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

        /* As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can 
        take place */
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
                this.onXMLMinorError("<scene> out of order");

            //Parses scene node
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

             //Parses views node
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

             //Parses ambient node
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

            //Parse lights node
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

            //Parse textures node
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

            //Parse materials node
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

            //Parse transformations node
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

            //Parse transformations node
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

            //Parse components node
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
        var error;
        var defaultID = this.reader.getString(viewNode, "default"); 

        if(defaultID == null)
            return "Default view is missing";

        if(children.length == 0)
            return "At least one view must be defined";

        for (var i = 0; i < children.length; i++)
        {
            error = this.parseViewBlock(children[i]);

            if(error != null)
                return error;
        }

        if(this.views[defaultID] == null)
            return "Default view " + defaultID + " not defined"; 
        else
            this.defaultViewID = defaultID; 
            
        this.log("Parsed views");
    }

    /**
     * Parses a single view block
     * @param {The view block} viewBlock 
     */
    parseViewBlock(viewBlock)
    {
        var viewID = this.reader.getString(viewBlock, "id");

        if(viewID == null)
            return "View ID not defined";

        if(this.views[viewID] != null)
            return "View " + viewID + " already declared";

        var viewErrorTag = "View " + viewID + ": ";
        
        var near = this.reader.getFloat(viewBlock, "near");

        if(near == null || isNaN(near))
            return viewErrorTag + "Error in near component";

        var far =  this.reader.getFloat(viewBlock, "far");

        if(far == null || isNaN(far))
            return viewErrorTag + "Error in far component";

        var children = viewBlock.children, nodeNames = [];

        for(let i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        let index = nodeNames.indexOf("from");

        if(index == null)
            return viewErrorTag + "No from tag present";

        var from = this.getXYZ(children[index]);

        if(typeof from == "string")
            return  viewErrorTag + from;

        index = nodeNames.indexOf("to");

        if(index == null)
            return viewErrorTag + "No to tag present";

        var to = this.getXYZ(children[index]);

        if(typeof to == "string")
            return viewErrorTag + to;

        if(viewBlock.nodeName == "perspective")
        {
            var angle =  this.reader.getFloat(viewBlock, "angle");

            if(angle == null || isNaN(angle))
                return viewErrorTag + "Error in angle component";

            this.views[viewID] = ['P', angle, near, far, from, to];
        }
        else
            if(viewBlock.nodeName == "ortho")
            {
                var left = this.reader.getFloat(viewBlock, "left");

                if(left == null || isNaN(left))
                    return viewErrorTag + "Error in left component";

                var right = this.reader.getFloat(viewBlock, "right");

                if(right == null || isNaN(right))
                    return viewErrorTag + "Error in right component";

                var top = this.reader.getFloat(viewBlock, "top");

                if(top == null || isNaN(top))
                    return viewErrorTag + "Error in top component";

                var bottom = this.reader.getFloat(viewBlock, "bottom");

                if(bottom == null || isNaN(bottom))
                    return viewErrorTag + "Error in bottom component";

                var up = [0,1,0];

                this.views[viewID] = ['O', left, right, bottom, top, near, far, from, to, up];
            }
            else
                return viewBlock.nodeName + ": Unkown view tag";
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
        var angle = null, exponent = null;

        // Any number of lights.
        for (var i = 0; i < children.length; i++)
        {
            var lightId = this.reader.getString(children[i], 'id');

            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            var lightErrorMessage = "Light " + lightId + ": ";

            if (children[i].nodeName != "omni")
                if(children[i].nodeName != "spot")
                {
                    this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                    continue;
                }
                else
                {
                    angle = this.reader.getFloat(children[i], "angle");

                    if(angle == null || isNaN(angle))
                        return lightErrorMessage + "Error in angle component";

                    exponent = this.reader.getFloat(children[i], "exponent");

                    if(exponent == null || isNaN(exponent))
                        return lightErrorMessage + "Error in exponent component";
                }

            // Get id of the current light.
            
            var enableIndex = this.reader.getFloat(children[i], "enabled");

            if(enableIndex == null || isNaN(enableIndex))
                return lightErrorMessage + "Error in enabled component";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];

            for (var j = 0; j < grandChildren.length; j++)
                nodeNames.push(grandChildren[j].nodeName);


            // Gets indices of each element.
            var positionIndex = nodeNames.indexOf("location");

            if(positionIndex == null)
                return lightErrorMessage + "<location> tag missing";

            var ambientIndex = nodeNames.indexOf("ambient");

            if(ambientIndex == null)
                return lightErrorMessage + "<ambient> tag missing";

            var diffuseIndex = nodeNames.indexOf("diffuse");

            if(diffuseIndex == null)
                return lightErrorMessage + "<diffuse> tag missing";

            var specularIndex = nodeNames.indexOf("specular");

            if(specularIndex == null)
                return lightErrorMessage + "<specular> tag missing";

            var targetIndex = nodeNames.indexOf("target");

            if(targetIndex== null)
                return lightErrorMessage + "<target> tag missing";

            // Retrieves the light position.
            var positionLight = [];

            positionLight = this.getXYZ(grandChildren[positionIndex]);
                
            // w
            var w = this.reader.getFloat(grandChildren[positionIndex], 'w');

            if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                return "unable to parse w-coordinate of the light position for ID = " + lightId;
            else
                positionLight.push(w);
            
            // Retrieves the ambient component.
            var ambientIllumination = this.retrieveColor(grandChildren[ambientIndex], lightId);

            if(typeof ambientIllumination == "string")
                return lightErrorMessage + ambientIllumination;

            //Retrieves the diffuse component
            var diffuseIllumination = this.retrieveColor(grandChildren[diffuseIndex], lightId);

            if(typeof diffuseIllumination == "string")
                return lightErrorMessage + diffuseIllumination;

            //Retrieves the specular component
            var specularIllumination = this.retrieveColor(grandChildren[specularIndex], lightId);

            if(typeof specularIllumination == "string")
                return lightErrorMessage + specularIllumination;

            //Retrieves the target component
            var targetPosition = [];

            if (targetIndex != -1 && children[i].nodeName == "spot")
            {
                targetPosition = this.getXYZ(grandChildren[targetIndex]);
                
                if(typeof targetPosition == "string")
                    return lightErrorMessage + targetPosition;
            }

            this.lights[lightId] = [enableIndex, positionLight, ambientIllumination, diffuseIllumination, specularIllumination, angle, exponent, targetPosition];

            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else 
            if(numLights > 8)
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

        if(children.length == 0)
            return "At least one texture must be defined";
    
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

            var textureErrorMessage = "Texture " + textureID + ": ";

            var textureFile = this.reader.getString(children[i], "file");

            if(textureFile == null)
                return textureErrorMessage + "Error in file component";

            var tex = new CGFtexture(this.scene, textureFile);

            this.textures[textureID] = tex;
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
        var nodeNames = [];
        var grandChildren = [];
        var shininess;
        var emission = [], emissionIndex;
        var ambient = [], ambientIndex;
        var diffuse = [], diffuseIndex;
        var specular = [], specularIndex;

        if(children.length == 0)
            return "At least one material must be defined";

        for(var i = 0; i < children.length; i++)
        {
            if(children[i].nodeName != "material")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var materialID = this.reader.getString(children[i], "id");

            if (materialID == null)
                return "no ID defined for material";

            if(this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            var materialErrorMessage = "Material " + materialID + ": ";

            shininess = this.reader.getFloat(children[i], "shininess");

            if (shininess == null || isNaN(shininess))
                return materialErrorMessage + "Error in shininess compononent";

            nodeNames = [];
            grandChildren = children[i].children;

            for(var j = 0; j < grandChildren.length; j++)
                nodeNames.push(grandChildren[j].nodeName);

            emissionIndex = nodeNames.indexOf("emission");

            if(emissionIndex == null)
                return materialErrorMessage + "<emission> tag missing";

            ambientIndex = nodeNames.indexOf("ambient");

            if(ambientIndex == null)
                return materialErrorMessage + "<ambient> tag missing";

            diffuseIndex = nodeNames.indexOf("diffuse");

            if(diffuseIndex == null)
                return materialErrorMessage + "<diffuse> tag missing";

            specularIndex = nodeNames.indexOf("specular");

            if(specularIndex == null)
                return materialErrorMessage + "<specular> tag missing";

            //Gets emission component

            emission = this.retrieveColor(grandChildren[emissionIndex], materialID);

            if(typeof emission == "string")
                return materialErrorMessage + emission;

            //Gets ambient component

            ambient = this.retrieveColor(grandChildren[ambientIndex], materialID);

            if(typeof ambient == "string")
                return materialErrorMessage + emission;

            //Gets diffuse component

            diffuse = this.retrieveColor(grandChildren[diffuseIndex], materialID);

            if(typeof diffuse == "string")
                return materialErrorMessage + diffuse;

            //Gets specular component

            specular = this.retrieveColor(grandChildren[specularIndex], materialID);

            if(typeof specular == "string")
                return materialErrorMessage + specular;

            var material = new CGFappearance(this.scene);

            material.setShininess(shininess);
            material.setEmission(emission[0], emission[1], emission[2], emission[3]);
            material.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
            material.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
            material.setSpecular(specular[0], specular[1], specular[2], specular[3]);
            material.setTextureWrap("REPEAT", "REPEAT");

            this.materials[materialID] = material;
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
        var error;

        if(children.length == 0)
            return "At least one transformation must be defined";

        for(var i = 0; i < children.length; i++)
        {
            if(children[i].nodeName != "transformation")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            error = this.parseTransformation(children[i]);

            if(error != null)
                return error;
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

                    if(angle == null || isNaN(angle))
                        return transformationErrorTag + "Error in angle component";

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
                            return transformationErrorTag + "Error in axis component";
                    }

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

        if(children.length == 0)
            return "At least one primitive must be defined";

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

        if(primitiveID == null)
            return "No ID defined for primitive";

        if(this.nodes[primitiveID] != null)
            return "ID must be unique for each primitive (conflict: ID = " + primitiveID + ")";

        var children = primitiveBlock.children;

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

        //First pass - Merely add them to the list
        for(let i = 0; i < children.length; i++)
        {
            if(children[i].nodeName != "component")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            componentID = this.reader.getString(children[i], "id");

            if(componentID == null)
                return "No ID defined for component";

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
            return "No <transformation> tag present in component " + componentID;

        if(typeof (tranformationMatrix = this.parseComponentTransformation(children[index], componentID)) == "string")
            return tranformationMatrix;

        index = nodeNames.indexOf("materials");

        if(index == null)
            return "No <materials> tag present in component " + componentID;

        if(typeof (materialList = this.parseComponentMaterials(children[index], componentID)) == "string")
            return materialList;

        index = nodeNames.indexOf("texture");

        if(index == null)
            return "No <texture> tag present in component: " + componentID;

        if(typeof (textureSpecs = this.parseComponentTexture(children[index], componentID)) == "string")
            return textureSpecs;

        index = nodeNames.indexOf("children");

        if(index == null)
            return "No <children> tag present in component: " + componentID;

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
        var componentChildrenErrorTag = "Component " + componentID + ": " + "Children: ";

        if(children.length == 0)
            return componentChildrenErrorTag + "At least one child must be declared";

        var childrenID, childrenList = [];

        for(let i = 0; i < children.length; i++)
        {
            childrenID = this.reader.getString(children[i], "id");

            if(childrenID == null)
                return componentChildrenErrorTag + "Children ID not referenced";

            if(this.nodes[childrenID] == null)
                return componentChildrenErrorTag + childrenID +  " not previously declared";

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
        var componentErrorTag = "Component " + componentID + ": ";

        if(children.length == 0)
            return componentErrorTag + "At least one transformation must be referenced or declared";

        for(let i = 0; i < children.length; i++)
        {
            switch(children[i].nodeName)
            {
                case "transformationref":
                    let transformationID = this.reader.getString(children[i], "id");

                    if(transformationID == null)
                        return componentErrorTag + "No ID defined for transformation";

                    if(this.transformations[transformationID] == null)
                        return componentErrorTag + "Transformation " + transformationID + " not defined previously";
                    else
                    {
                        if(i == 0)
                            transformationMatrix = this.transformations[transformationID];
                        else
                            mat4.mul(transformationMatrix, transformationMatrix, this.transformations[transformationID]);
                    }
                        
                    break;

                case "translate":

                    if(i == 0)
                        transformationMatrix = mat4.create();

                    xyz = this.getXYZ(children[i]);

                    if(typeof xyz == "string")
                        return componentErrorTag + "Transformation: " + xyz;
                    else
                        mat4.translate(transformationMatrix, transformationMatrix, xyz);

                    break;

                case "scale":

                    if(i == 0)
                        transformationMatrix = mat4.create();

                    xyz = this.getXYZ(children[i]);

                    if(typeof xyz == "string")
                        return componentErrorTag + "Transformation: " + xyz;
                    else
                        mat4.scale(transformationMatrix, transformationMatrix, xyz);

                    break;

                case "rotate":

                    if(i == 0)
                        transformationMatrix = mat4.create();

                    var axis = this.reader.getString(children[i], "axis"), 
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

                        default:
                            return componentErrorTag +  "Transformation: Error in axis component";
                    }

                    if(angle == null || isNaN(angle))
                        return componentErrorTag + "Transformation: " + "Error in angle component";

                    mat4.rotate(transformationMatrix, transformationMatrix, angle * DEGREE_TO_RAD, axis);
                    break;

                default:
                    return componentErrorTag + "Unkown transformation";
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
        var componentMaterialErrorTag = "Component " + componentID + ": Material: ";

        if(children.length == 0)
            return componentMaterialErrorTag + "At least one material must be referenced";

        for(let i = 0; i < children.length; i++)
        {
            if(children[i].nodeName != "material")
            {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            materialID = this.reader.getString(children[i], "id");

            if(materialID == null)
                return componentMaterialErrorTag + "No ID defined for material";

            if(materialID == "inherit")
                materialList.push(materialID);
            else
            {
                if(this.materials[materialID] == null)
                    return componentMaterialErrorTag + materialID + " not defined previously";
                else
                    materialList.push(this.materials[materialID]);
            }
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
        var componentTextureErrorTag = "Component " + componentID + ": Texture ";

        if(textureID == null)
            return componentTextureErrorTag + "No ID referenced";

        if(textureID == "inherit" || textureID == "none")
            textureSpecs.push(textureID);
        else
        {
            if(this.textures[textureID] == null)
                return componentTextureErrorTag + textureID + " not previously defined";
            else
                textureSpecs.push(this.textures[textureID]);
        }
            
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

        if(xyz[0] == null || isNaN(xyz[0]))
            return "X value not properly defined";
        else
            if(xyz[1] == null || isNaN(xyz[1]))
                return "Y value not properly defined";
            else
                if( xyz[2] == null || isNaN(xyz[2]))
                    return "Z value not properly defined";
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
        this.displayNode(this.idRoot, this.nodes[this.idRoot].texture, 
            this.nodes[this.idRoot].materials[this.nodes[this.idRoot].materialIndex]);
    }

    /**
     * Displays a node
     * @param {The node's ID} nodeID
     * @param {The texture associated} textureInit
     * @param {The material associated} materialInit
     */
    displayNode(nodeID, textureInit, materialInit)
    {
        var texture, material = materialInit;
        var node;

        if(nodeID != null)
            node = this.nodes[nodeID];
        else
            this.log("Error in node ID");

        this.scene.pushMatrix();
    
        if(node.materials.length != 0)
        {
            switch(node.materials[node.materialIndex])
            {
                case "inherit":
                    material = materialInit;
                    break;

                default:
                    material = node.materials[node.materialIndex];
            }

        }

        if(node.texture.length != 0)
        {
            switch(node.texture[0])
            {
                case "inherit":
                    texture = textureInit;
                    material.setTexture(texture[0]);
                    break;

                case "none":
                    texture = textureInit;
                    break;

                default:
                    texture = node.texture;
                    material.setTexture(texture[0]);
            }
        }
        
        material.apply();
            
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
            node.build.update(textureInit[1], textureInit[2])
            node.build.display();
        }

        this.scene.popMatrix();
    }
}
