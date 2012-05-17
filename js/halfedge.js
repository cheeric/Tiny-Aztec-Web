function HalfEdge(halfedge_id) {
	this.id = halfedge_id;
}


// Getters

HalfEdge.prototype.getId = function() {
 	return this.id;
}

HalfEdge.prototype.getFace = function() {
	return this.face;
}

HalfEdge.prototype.getVertex = function() {
	return this.vertex;
}

HalfEdge.prototype.getNext = function() {
	return this.next;
}

HalfEdge.prototype.getSym = function() {
	return this.sym;
}


// Setters

HalfEdge.prototype.setFace = function(f) {
	this.face = f;
}

HalfEdge.prototype.setVertex = function(v) {
	this.vertex = v;
}

HalfEdge.prototype.setNext = function(he) {
	this.next = he;
}

HalfEdge.prototype.setSym = function(he) {
	this.sym = he;
}