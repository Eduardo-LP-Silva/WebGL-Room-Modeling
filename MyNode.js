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
      * @param {boolean} animationContinuity
      */
     constructor(build = null, id, children = [], transformations = null, texture = [], materials = [], animations = [], 
        animationContinuity = false)
     {
        this.id = id;
        this.build = build;
        this.children = children;
        this.texture = texture;
        this.materials = materials;
        this.animations = animations; //Array containing the node's animations
        this.transformations = transformations;
        this.originalTransformations = transformations; //Copy of the transformations matrix unaffected by the animations
        this.animationTransformations = transformations; //Transformation matrix affected by the animations
        this.materialIndex = 0; //Current material index
        this.animationIndex = 0; //Current animation index
        this.animationContinuity = animationContinuity; //If set, the animations will have continuity between each other
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

     /**
      * Updates the node's animation(s).
      * @param {long} currTime 
      */
     updateAnimations(currTime)
     {
        if(this.animationIndex < this.animations.length)
        {
            if(this.animations[this.animationIndex].initTime == - 1) //Animations hasn't been initiated yet
            {
                this.animations[this.animationIndex].initTimeStamps(currTime);

                if(this.animationContinuity)
                {
                    this.animationTransformations = this.transformations;
                    this.originalTransformations = this.transformations;
                }
                else
                {
                    this.animationTransformations = mat4.clone(this.transformations);
                    this.originalTransformations = mat4.clone(this.transformations);
                }
                
            }
                
            if(this.animations[this.animationIndex].getElapsedTime(currTime) 
                > this.animations[this.animationIndex].totalTime) //Animations has ended
                this.animationIndex++;
            else
            {
                this.animations[this.animationIndex].update(currTime); 

                //Incremental
                if(this.animations[this.animationIndex] instanceof LinearAnimation)
                    mat4.multiply(this.animationTransformations, this.animationTransformations, 
                        this.animations[this.animationIndex].transformationMatrix);
                else //Total replacement
                    mat4.multiply(this.animationTransformations, this.originalTransformations, 
                    this.animations[this.animationIndex].transformationMatrix);
            }      
        }
     }

     /**
      * Applies the current animation to the scene.
      * @param {mat4} sceneMatrix 
      */
     applyAnimation(sceneMatrix)
     {
        if(this.animations.length > 0)
        {
            if(this.animationIndex >= this.animations.length) //Applies last instance of last animation
                this.animations[this.animationIndex - 1].apply(sceneMatrix, this.animationTransformations); 
            else //Applies current animation
                this.animations[this.animationIndex].apply(sceneMatrix, this.animationTransformations);
        }
        else
            mat4.mul(sceneMatrix, sceneMatrix, this.transformations); /* If no animations are present it applies the 
            "regular" transformations */

        return sceneMatrix;
     }
 }