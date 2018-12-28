/**
 * GamePiece class, representing a zurero's piece.
 */
class GamePiece extends CGFobject
{
    /**
	 * @constructor
	 * @param {CGFscene} scene
   * @param {string} color
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
    	  this.blackTileAppearence.setTexture(scene.graph.textures['black_tile']);


        this.whiteTileAppearence = new CGFappearance(this.scene);
        this.whiteTileAppearence.setAmbient(1, 1, 1, 0.8);
        this.whiteTileAppearence.setDiffuse(0.9, 0.9, 0.9, 0.5);
        this.whiteTileAppearence.setSpecular(1, 1, 1, 0.2);
        this.whiteTileAppearence.setShininess(20);
        this.whiteTileAppearence.setTexture(scene.graph.textures['white_tile']);
    }

    /**
     * Displays the piece.
     */
    display()
    {
      this.scene.pushMatrix();
      if(this.color == "white"){
        this.whiteTileAppearence.apply();
      }else{
        this.blackTileAppearence.apply();
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
