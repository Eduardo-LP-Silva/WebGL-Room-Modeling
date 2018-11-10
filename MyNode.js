/**
 * My Node class, representing a graph node (primitive or component).
 */
 class MyNode
 {
     /**
      * @constructor
      * @param {CGFobject} build 
      * @param {string} id 
      * @param {array} children 
      * @param {mat4} transformations 
      * @param {array} texture 
      * @param {array} materials 
      */
     constructor(build = null, id, children = [], transformations = null, texture = [], materials = [], animations = [])
     {
        this.id = id;
        this.build = build;
        this.children = children;
        this.texture = texture;
        this.materials = materials;
        this.animations = animations;
        this.transformations = transformations;
        this.animationTransformations = transformations;
        this.materialIndex = 0;
        this.animationIndex = 0;
     }

     /**
      * Applies its transformation matrix and displays the primitive.
      */
     display()
     {
        build.scene.pushMatrix();
            build.scene.multMatrix(this.transformations);
            build.display();
        build.scene.popMatrix();
     }

     updateAnimations(currTime)
     {
        if(this.animationIndex < this.animations.length)
        {
            if(this.animations[this.animationIndex].initTime == - 1)
            {
                this.animations[this.animationIndex].initTimeStamps(currTime);
                this.animationTransformations = mat4.clone(this.transformations);
            }
                
            if(this.animations[this.animationIndex].getElapsedTime(currTime) 
                > this.animations[this.animationIndex].totalTime)
                this.animationIndex++;
            else
            {
                this.animations[this.animationIndex].update(currTime); 

                mat4.multiply(this.animationTransformations, this.animationTransformations, 
                    this.animations[this.animationIndex].transformationMatrix);
            }      
        }
     }

     applyAnimation(sceneMatrix)
     {
        if(this.animations.length > 0)
        {
            if(this.animationIndex >= this.animations.length)
                this.animations[this.animationIndex - 1].apply(sceneMatrix, this.animationTransformations);
            else
                this.animations[this.animationIndex].apply(sceneMatrix, this.animationTransformations);
        }
        else
            mat4.mul(sceneMatrix, sceneMatrix, this.transformations);

        return sceneMatrix;
     }
 }