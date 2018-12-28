/**
 * MyVehicle class, representing a miniature hot air ballon.
 */
class GamePiece extends CGFobject
{
    /**
	 * @constructor
	 * @param {CGFscene} scene
	 */
    constructor(scene, color)
    {
        super(scene);

        this.piece = new MySphere(this.scene, 30, 30, 0.1);
        this.color = color;

        this.blackTileAppearence = new CGFappearance(this.scene);
        this.blackTileAppearence.setAmbient(0.5, 0.5, 0.5, 0.5);
    	  this.blackTileAppearence.setDiffuse(0.9, 0.9, 0.9, 0.5);
        this.blackTileAppearence.setSpecular(0.1, 0.1, 0.1, 0.5);
    	  this.blackTileAppearence.setShininess(20);
    	  this.blackTileAppearence.loadTexture("scenes/images/black_tile.jpg");


        this.whiteTileAppearence = new CGFappearance(this.scene);
        this.whiteTileAppearence.setAmbient(1, 1, 1, 0.8);
        this.whiteTileAppearence.setDiffuse(0.9, 0.9, 0.9, 0.5);
        this.whiteTileAppearence.setSpecular(1, 1, 1, 0.2);
        this.whiteTileAppearence.setShininess(20);
        this.whiteTileAppearence.loadTexture("scenes/images/balloon.jpg");
    }

    /**
     * Assembles the diferent parts of the object and displays it.
     */
    display()
    {
      this.scene.pushMatrix();
      if(this.color == "white"){
        this.whiteTileAppearence.apply();
      }else{
        this.blackTileAppearent.apply();
      }
      this.scene.scale(1, 0.5, 1);
      this.piece.display();
      this.scene.popMatrix();
    }

    /**
     * Dummy function, does nothing in this class.
     * @param {float} S
     * @param {float} T
     */
    updateTexCoords(S, T){}
};
