var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var NODES_INDEX = 6;

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

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);

        this.translationCoords = []; //x,y,z
        this.referenceLength = null;
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

        if (error != null) {
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
        

        var error;

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

        //<VIEWS>

        if((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing\n";
        else
        {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            if((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        //<Ambient>

        if((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing\n";
        else
        {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            if((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <LIGHTS>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else 
        {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse LIGHTS block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <TEXTURES>
        if ((index = nodeNames.indexOf("TEXTURES")) == -1)
            return "tag <TEXTURES> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <TEXTURES> out of order");

            //Parse TEXTURES block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <MATERIALS>
        if ((index = nodeNames.indexOf("MATERIALS")) == -1)
            return "tag <MATERIALS> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <MATERIALS> out of order");

            //Parse MATERIALS block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <NODES>
        if ((index = nodeNames.indexOf("NODES")) == -1)
            return "tag <NODES> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <NODES> out of order");

            //Parse NODES block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
    }

    /**
     * Parses the <INITIALS> block.
     */
    parseInitials(initialsNode) {

        var children = initialsNode.children;

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        // Frustum planes
        // (default values)
        this.near = 0.1;
        this.far = 500;
        var indexFrustum = nodeNames.indexOf("frustum");
        if (indexFrustum == -1) {
            this.onXMLMinorError("frustum planes missing; assuming 'near = 0.1' and 'far = 500'");
        }
        else {
            this.near = this.reader.getFloat(children[indexFrustum], 'near');
            this.far = this.reader.getFloat(children[indexFrustum], 'far');

            if (!(this.near != null && !isNaN(this.near))) {
                this.near = 0.1;
                this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
            }
            else if (!(this.far != null && !isNaN(this.far))) {
                this.far = 500;
                this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 500'");
            }

            if (this.near >= this.far)
                return "'near' must be smaller than 'far'";
        }

        // Checks if at most one translation, three rotations, and one scaling are defined.
        if (initialsNode.getElementsByTagName('translation').length > 1)
            return "no more than one initial translation may be defined";

        if (initialsNode.getElementsByTagName('rotation').length > 3)
            return "no more than three initial rotations may be defined";

        if (initialsNode.getElementsByTagName('scale').length > 1)
            return "no more than one scaling may be defined";

        // Initial transforms.
        this.initialTranslate = [];
        this.initialScaling = [];
        this.initialRotations = [];

        // Gets indices of each element.
        var translationIndex = nodeNames.indexOf("translation");
        var thirdRotationIndex = nodeNames.indexOf("rotation");
        var secondRotationIndex = nodeNames.indexOf("rotation", thirdRotationIndex + 1);
        var firstRotationIndex = nodeNames.lastIndexOf("rotation");
        var scalingIndex = nodeNames.indexOf("scale");

        // Checks if the indices are valid and in the expected order.
        // Translation.
        this.initialTransforms = mat4.create();
        mat4.identity(this.initialTransforms);

        if (translationIndex == -1)
            this.onXMLMinorError("initial translation undefined; assuming T = (0, 0, 0)");
        else {
            var tx = this.reader.getFloat(children[translationIndex], 'x');
            var ty = this.reader.getFloat(children[translationIndex], 'y');
            var tz = this.reader.getFloat(children[translationIndex], 'z');

            if (tx == null || ty == null || tz == null) {
                tx = 0;
                ty = 0;
                tz = 0;
                this.onXMLMinorError("failed to parse coordinates of initial translation; assuming zero");
            }

            //TODO: Save translation data
            
            this.translationCoords.push(tx, ty, tz);

        }

        //TODO: Parse Rotations

        if (firstRotationIndex == -1)
            this.onXMLMinorError("initial first rotation undefined; assuming ");
        else {
            var rx = this.reader.getFloat(children[firstRotationIndex], 'x');
            var ry = this.reader.getFloat(children[translationIndex], 'y');
            var rz = this.reader.getFloat(children[translationIndex], 'z');

            if (tx == null || ty == null || tz == null) {
                tx = 0;
                ty = 0;
                tz = 0;
                this.onXMLMinorError("failed to parse coordinates of initial translation; assuming zero");
            }

            //TODO: Save translation data
            
            this.translationCoords.push(tx, ty, tz);

        }


        //TODO: Parse Scaling

        //TODO: Parse Reference length

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <ILLUMINATION> block.
     * @param {illumination block element} illuminationNode
     *
    parseIllumination(illuminationNode) {
        // TODO: Parse Illumination node

        this.log("Parsed illumination");

        return null;
    } */

    parseScene(sceneNode)
    {
        var root = this.reader.getString(sceneNode, "root");

        if(root == null)
            return "No root defined for scene\n";

        this.referenceLength = this.reader.getFloat(sceneNode, "axis_length");

        if(this.referenceLength == null || isNaN(this.referenceLength))
            return "No axis length defined for scene\n";
    }

    parseViews(viewNode)
    {
        var children = viewNode.children;

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        //TODO Do smt with this information
    }

    parseAmbient(ambientNode)
    {
        var children = ambientNode.children;

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        //TODO Do smt with this information
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
            var ambientIllumination = [];

            if (ambientIndex != -1) 
            {
                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');

                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');

                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');

                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');

                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(a);
            }
            else
                return "ambient component undefined for ID = " + lightId;

            //Retrieves the diffuse component

            var diffuseIllumination = [];

            if (diffuseIndex != -1) 
            {
                // R
                var dr = this.reader.getFloat(grandChildren[diffuseIndex], 'r');

                if (!(dr != null && !isNaN(dr) && dr >= 0 && dr <= 1))
                    return "unable to parse R component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(dr);

                // G
                var dg = this.reader.getFloat(grandChildren[diffuseIndex], 'g');

                if (!(dg != null && !isNaN(dg) && dg >= 0 && dg <= 1))
                    return "unable to parse G component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(dg);

                // B
                var db = this.reader.getFloat(grandChildren[diffuseIndex], 'b');

                if (!(db != null && !isNaN(db) && db >= 0 && db <= 1))
                    return "unable to parse B component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(db);

                // A
                var da = this.reader.getFloat(grandChildren[diffuseIndex], 'a');

                if (!(da != null && !isNaN(da) && da >= 0 && da <= 1))
                    return "unable to parse A component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(da);
            }
            else
                return "diffuse component undefined for ID = " + lightId;

            //Retrieves the specular component

            var specularIllumination = [];

            if (specularIndex != -1) 
            {
                // R
                var sr = this.reader.getFloat(grandChildren[specularIndex], 'r');

                if (!(sr != null && !isNaN(sr) && sr >= 0 && sr <= 1))
                    return "unable to parse R component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(sr);

                // G
                var sg = this.reader.getFloat(grandChildren[specularIndex], 'g');

                if (!(sg != null && !isNaN(sg) && sg >= 0 && sg <= 1))
                    return "unable to parse G component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(sg);

                // B
                var sb = this.reader.getFloat(grandChildren[specularIndex], 'b');

                if (!(sb != null && !isNaN(sb) && sb >= 0 && sb <= 1))
                    return "unable to parse B component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(sb);

                // A
                var sa = this.reader.getFloat(grandChildren[specularIndex], 'a');

                if (!(sa != null && !isNaN(sa) && sa >= 0 && sa <= 1))
                    return "unable to parse A component of the diffuse illumination for ID = " + lightId;
                else
                    specularIllumination.push(sa);
            }
            else
                return "specular component undefined for ID = " + lightId;

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
            else
                return "light target position undefined for ID = " + lightId;

            // TODO: Store Light global information.
            
            var light = new CGFlight(this.scene, lightId);

            light.setAmbient(ambientIllumination[0], ambientIllumination[1], ambientIllumination[2], ambientIllumination[3]);
            light.setDiffuse(diffuseIllumination[0], diffuseIllumination[1], diffuseIllumination[2], diffuseIllumination[3]);
            light.setSpecular(specularIllumination[0], specularIllumination[1], specularIllumination[2], specularIllumination[3]);
            light.setPosition(positionLight[0], positionLight[1], positionLight[2], positionLight[3]);
            light.setSpotExponent(exponent);
            light.setSpotCutOff(angle);
            
            if(enableIndex == 1)
                light.enable();
            else
                light.disable();

            this.lights[lightId] = light;
        
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");

        return null;
    }

    /**
     * Parses the <TEXTURES> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) 
    {
        // TODO: Parse block

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

            var textureFile = this.reader.getString(chidlren[i], "file");

            if(textureFile == null)
                return "No file defined for texture\n";

            //TODO Create CGF Appearance?
        }

        return null;
    }

    /**
     * Parses the <MATERIALS> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) 
    {
        // TODO: Parse block
        this.log("Parsed materials");
        return null;

    }

    /**
     * Parses the <NODES> block.
     * @param {nodes block element} nodesNode
     */
    parseNodes(nodesNode) {
        // TODO: Parse block
        this.log("Parsed nodes");
        return null;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorErro(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
    }
}