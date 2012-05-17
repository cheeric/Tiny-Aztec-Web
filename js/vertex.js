function Vertex(a, b, c) {
	if ((b!=undefined)&&(c!=undefined))
		this.coord = vec3.create([a,b,c]);
	else if (a!=undefined)
 		this.id = a;
}


// Getters

Vertex.prototype.getId = function() {
 	return this.id;
}

Vertex.prototype.getCoord = function() {
 	return this.coord;
}


// Setters

Vertex.prototype.setCoord = function(c) {
 	this.coord = c;
}