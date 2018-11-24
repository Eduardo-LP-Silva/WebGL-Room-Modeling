/**
 * MyVehicle class, representing a miniature hot air ballon.
 */
class Vehicle extends CGFobject
{
    /**
	 * @constructor
	 * @param {CGFscene} scene
	 */
    constructor(scene)
    {
        super(scene);

        var points = this.topPoints();
        var points2 = this.topPoints2();

        this.top = new Plane(this.scene, 20, 20, 4, 4, points);
        this.top2 = new Plane(this.scene, 20, 20, 4, 4, points2);
        this.bottom = new Cylinder2(this.scene, 0.4, 0.5, 0.5, 20, 20);
        this.topBorder = new MyTorus(this.scene, 0.03, 0.4, 30, 30);
        this.topLid = new MyDisk(this.scene, 30);
        this.bottomLid = new MyDisk(this.scene, 30);

        this.basketAppearance = new CGFappearance(this.scene);
        this.basketAppearance.setAmbient(0.5, 0.5, 0.5, 0.5);
    	  this.basketAppearance.setDiffuse(0.9, 0.9, 0.9, 0.5);
        this.basketAppearance.setSpecular(0.1, 0.1, 0.1, 0.5);
    	  this.basketAppearance.setShininess(20);
    	  this.basketAppearance.loadTexture("scenes/images/basket.png");

        this.topLidAppearance = new CGFappearance(this.scene);
    	  this.topLidAppearance.loadTexture("scenes/images/yellow.png");

        this.balloonAppearance = new CGFappearance(this.scene);
        this.balloonAppearance.setAmbient(1, 1, 1, 0.8);
        this.balloonAppearance.setDiffuse(0.9, 0.9, 0.9, 0.5);
        this.balloonAppearance.setSpecular(1, 1, 1, 0.2);
        this.balloonAppearance.setShininess(20);
        this.balloonAppearance.loadTexture("scenes/images/balloon.jpg");
    }

    /**
     * 
     */
    topPoints()
    {
      var points = [

        [-0.3, -0.3, 0, 1], //1
        [-0.5, -0.2, 0.4, 1], //2
        [-0.6, 0, 0.6, 1], //3
        [-0.5, 0.2, 0.4, 1], //4
        [-0.3, 0.3, 0, 1], //5

        [-0.2, -0.5, 0.4, 1], //6
        [-0.5, -0.8, 1.2, 1], //7
        [-0.7, 0, 2.2, 1], //8
        [-0.5, 0.8, 1.2, 1], //9
        [-0.2, 0.5, 0.4, 1], //10

        [0, -0.6, 0.6, 1], //11
        [0, -0.7, 2.2, 1], //12
        [0, 0, 2.5, 1], //13
        [0, 0.8, 2.2, 1], //14
        [0, 0.6, 0.6, 1], //15

        [0.2, -0.5, 0.4, 1], //16
        [0.5, -0.8, 1.2, 1], //17
        [0.7, 0, 2.2, 1], //18
        [0.5, 0.8, 1.2, 1], //19
        [0.2, 0.5, 0.4, 1], //20

        [0.3, -0.3, 0, 1], //21
        [0.5, -0.2, 0.5, 1], //22
        [0.6, 0, 0.6, 1], //23
        [0.5, 0.2, 0.4, 1], //24
        [0.3, 0.3, 0, 1] //25
      ];

      return points;
    }

    /**
     * 
     */
    topPoints2()
    {
      var points2 = [

        [-0.3, 0.3, 0, 1],
        [-0.5, 0.2, 0.4, 1],
        [-0.6, 0, 0.6, 1],
        [-0.5, -0.2, 0.4, 1],
        [-0.3, -0.3, 0, 1],

        [-0.2, 0.5, 0.4, 1],
        [-0.5, 0.8, 1.2, 1],
        [-0.7, 0, 2.2, 1],
        [-0.5, -0.8, 1.2, 1],
        [-0.2, -0.5, 0.4, 1],

        [0, 0.6, 0.6, 1],
        [0, 0.7, 2.2, 1],
        [0, 0, 2.5, 1],
        [0, -0.7, 2.2, 1],
        [0, -0.6, 0.6, 1],

        [0.2, 0.5, 0.4, 1],
        [0.5, 0.8, 1.2, 1],
        [0.7, 0, 2.2, 1],
        [0.5, -0.8, 1.2, 1],
        [0.2, -0.5, 0.4, 1],

        [0.3, 0.3, 0, 1],
        [0.5, 0.2, 0.5, 1],
        [0.6, 0, 0.6, 1],
        [0.5, -0.2, 0.4, 1],
        [0.3, -0.3, 0, 1]
      ];

      return points2;
    }

    /**
     * Assembles the diferent parts of the object and displays it.
     */
    display()
    {
      this.scene.pushMatrix();
        this.balloonAppearance.apply();
        this.scene.translate(0, 1.5, 0);
        this.scene.scale(3, 3, 3);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);

        this.scene.pushMatrix();
          this.scene.scale(1, 1, 0.65);
          this.top.display();
          this.top2.display();
        this.scene.popMatrix();

        this.basketAppearance.apply();
        this.topBorder.display();
        this.scene.translate(0, 0.1, -0.5);
        this.bottom.display();

        this.scene.pushMatrix();
        this.scene.scale(0.4, 0.4, 1);

        this.scene.pushMatrix();
          this.scene.translate(0, -0.185, 0);
          this.scene.scale(0.78, 0.78, 1);
          this.bottomLid.display();
        this.scene.popMatrix();

        this.scene.translate(0, -0.2, 0.5);
        this.topLidAppearance.apply();
        this.topLid.display();
        this.scene.popMatrix();
      this.scene.popMatrix();
    }

    /**
     * Dummy function, does nothing in this class.
     * @param {float} S 
     * @param {float} T 
     */
    updateTexCoords(S, T){}
};
