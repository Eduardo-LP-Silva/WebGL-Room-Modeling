/**
* CGFOBJModel
* @constructor
* Basic support for OBJ models. 
* Loads a set of faces defined by vertices positions, texture coordinates and normals.
* Supports triangles and quads.
* Does not support loading materials, or individual meshes/groups (contributions welcome).
*
* based on snippet from https://dannywoodz.wordpress.com/2014/12/16/webgl-from-scratch-loading-a-mesh/
* and optimized to reduce vertex duplication
*/

class CGFOBJModel extends CGFobject{

	constructor(scene, url, wireframe) 
	{
		super(scene);
		
		this.url = url;
		
		// false for triangles, true for lines (wireframe)
		this.wireframe = wireframe || false;
		
		// init with empty object, so that there are no problems while the data is being loaded
		this.vertices = [];
		this.normals = [];
		this.texcoords = [];
		this.indices = [];
		
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();

		// spawn resource reading
		this.rr = new CGFresourceReader();
		this.rr.open(url, this);
		
	};
	onResourceError(string) 
	{
		console.log("Error loading resource " + this.url + ": "+string);
	}

	onResourceReady(string) 
	{
	  var lines = string.split("\n");
	  var positions = [];
	  var normals = [];
	  var vertices = [];
	  var texcoords = [];
	  var icount=0;
	  
	  this.vcount=0;
	  this.fcount=0;
	  
	  var lut=[];  // this look-up table allows only repeating vertices that have different coords/tex/normals triplets
	 
	  for ( var i = 0 ; i < lines.length ; i++ ) {
		var parts = lines[i].trimRight().split(/\s+/);
		if ( parts.length > 0 ) {
		  switch(parts[0]) {
			case 'v':  positions.push(
				[
					parseFloat(parts[1]),
					parseFloat(parts[2]),
					parseFloat(parts[3])
				]
			  );
			  break;
			case 'vn':
			  normals.push(
				[
				  parseFloat(parts[1]),
				  parseFloat(parts[2]),
				  parseFloat(parts[3])
				]
			  );
			  break;
			case 'vt':
			  texcoords.push(
				[
				  parseFloat(parts[1]),
				  parseFloat(parts[2])
				]
			  );
			  break;
			case 'f': {
				function procVert(model, str)
				{
					str=str.trim();
					if (lut[str]) //already stored
						// just add the index
						model.indices[icount]=lut[str];
					else // not stored
					{
						// add coords/tex/norms to corresponding buffers and add the index
						
						var f = str.split('/');
						
						Array.prototype.push.apply(
							model.vertices, positions[parseInt(f[0]) - 1]
						);
						
						if (f[1])
							Array.prototype.push.apply(
								model.texcoords, texcoords[parseInt(f[1]) - 1]
							);
						if (f[2])
							Array.prototype.push.apply(
								model.normals, normals[parseInt(f[2]) - 1]
							);
						
						// store index in lut
						
						lut[str]=model.vcount;
						
						model.indices[icount]=model.vcount;

						model.vcount++
					}
					icount++;
				}
			
				if (!this.wireframe)
				{
					procVert(this,parts[1]);
					procVert(this,parts[2]);
					procVert(this,parts[3]);
					if (parts.length>4)
					{
						procVert(this,parts[1]);
						procVert(this,parts[3]);
						procVert(this,parts[4]);
					}
				}
				else
				{
					procVert(this,parts[1]);
					procVert(this,parts[2]);
					procVert(this,parts[2]);
					procVert(this,parts[3]);
					procVert(this,parts[3]);
					if (parts.length>4)
					{
						procVert(this,parts[4]);
						procVert(this,parts[4]);
					}
					procVert(this,parts[1]);
				}
				
				this.fcount++;

				break;
			}
		  }
		}
	  }
	  console.log("Loaded mesh "+ this.url +" with " + this.vcount + " vertices / "+ this.fcount + " faces");

		if (this.texcoords.length==0)
			this.texcoords=null;
			
		if (!this.wireframe)
			this.primitiveType = this.scene.gl.TRIANGLES;
		else
			this.primitiveType = this.scene.gl.LINES;
		
		this.initGLBuffers();
	};
}