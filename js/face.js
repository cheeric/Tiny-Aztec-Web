function Face(a) {
	if (a!=undefined)
		this.id = a;
	this.selected = false;
}


//Getters

Face.prototype.getId = function() {
 	return this.id;
};

Face.prototype.getHalfEdge = function() {
	return this.halfedge;
};

Face.prototype.getColor = function() {
	var c = new Array(4);
	if (this.selected) {
		c[0] = this.color[0]/3;
		c[1] = this.color[1]/3;
		c[2] = this.color[2]/3;
		c[3] = 1;
		return c;
	}
	else
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