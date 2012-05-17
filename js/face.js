function Face(a) {
	if (a!=undefined)
		this.id = a;
}


//Getters

Face.prototype.getId = function() {
 	return this.id;
};

Face.prototype.getHalfEdge = function() {
	return this.halfedge;
};

Face.prototype.getColor = function() {
	return this.color;
};


//Setters

Face.prototype.setHalfEdge = function(he) {
	this.halfedge = he;
};

Face.prototype.setColor = function(r, g, b) {
	this.color = new Array(4);
	this.color[0] = r;
	this.color[1] = g;
	this.color[2] = b;
	this.color[3] = 1;
};