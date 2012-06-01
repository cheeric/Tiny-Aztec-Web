function Camera(eyeX, eyeY, eyeZ, refX, refY, refZ) {
	// initialize camera position
	this.N = vec3.create([0.0, 0.0, 1.0]);
	this.upVec = vec3.create([0.0, 1.0, 0.0]);
	this.PR = vec3.create([eyeX, eyeY, eyeZ]);
	this.REF = vec3.create([refX, refY, refZ]);

	this.camXAngle = 0.0;
	this.camYAngle = 0.0;

	this.view = this.calcView(vec3.add(this.PR, this.REF));

	this.fov = 60.0;
}

Camera.prototype.setWindowSize = function(width, height){
	this.windowWidth = width;
	this.windowHeight = height;
}

Camera.prototype.calcView = function(viewVec) {
	/*// G = UP - N ( N . UP)
	var G = vec3.subtract(this.upVec, vec3.scale(this.N, vec3.dot(this.N, this.upVec)));

	// V = G / || G ||
	var V = vec3.normalize(G);

	// U = -N x V
	var U = vec3.cross(vec3.negate(this.N), V);

	// calculate rotation matrix
	var R = mat4.create([U[0], V[0], this.N[0], 0.0,
				  U[1], V[1], this.N[1], 0.0,
				  U[2], V[2], this.N[2], 0.0,
				  0.0, 0.0, 0.0, 1.0]); 
	*/

	// calculate translation matrix
	this.T = mat4.create();
	mat4.identity(this.T);
	mat4.translate(this.T, vec3.negate(viewVec, vec3.create()));
	
	//alert(mat4.str(T));
	return this.T;
}

Camera.prototype.getVMatrix = function() {
	var view_rot = mat4.create();
	mat4.rotate(this.view, this.camYAngle, vec3.create([1, 0, 0]), view_rot);
	view_rot = mat4.rotate(view_rot, this.camXAngle, vec3.create([0, 1, 0]));

	//this.aspect = this.windowWidth/this.windowHeight;
	//var proj = mat4.perspective(this.fov, this.aspect, 0.1, 100.0);
	return view_rot;
}

Camera.prototype.getEyeVec = function() {
	var model = mat4.create();
	mat4.identity(model);
	mat4.rotate(model, -this.camXAngle, [0, 1, 0]);
	mat4.rotate(model, -this.camYAngle, [1, 0, 0]);
	var temp = mat4.multiplyVec4(model, [this.REF[0]+this.PR[0], this.REF[1]+this.PR[1], this.REF[2]+this.PR[2], 1.0]);
	return [temp[0], temp[1], temp[2]];
}

Camera.prototype.getUpVec = function() {
	var model = mat4.create();
	mat4.identity(model);
	mat4.rotate(model, -this.camXAngle, [0, 1, 0]);
	mat4.rotate(model, -this.camYAngle, [1, 0, 0]);
	var temp = mat4.multiplyVec4(model, [this.upVec[0], this.upVec[1], this.upVec[2], 1.0]);
	return [temp[0], temp[1], temp[2]];
}

Camera.prototype.getRef = function() {
	return [this.REF[0], this.REF[1], this.REF[2]];
}



Camera.prototype.rotUp = function(angle) {
	this.camYAngle += angle;
}

Camera.prototype.rotDown = function(angle) {
	this.camYAngle -= angle;
}

Camera.prototype.rotRight = function(angle) {
	this.camXAngle += angle;
}

Camera.prototype.rotLeft = function(angle) {
	this.camXAngle -= angle;
}


Camera.prototype.zoomIn = function() {
	this.PR[2] *= 9.0/10.0;
	this.view = this.calcView(vec3.add(this.PR, this.REF));
}

Camera.prototype.zoomOut = function() {
	this.PR[2] /= 9.0/10.0;
	this.view = this.calcView(vec3.add(this.PR, this.REF));
}


Camera.prototype.moveUp = function(dist) {
	this.PR[1] += dist/110;
	this.view = this.calcView(vec3.add(this.PR, this.REF));
}

Camera.prototype.moveDown = function(dist) {
	this.PR[1] -= dist/110;
	this.view = this.calcView(vec3.add(this.PR, this.REF));
}

Camera.prototype.moveRight = function(dist) {
	this.PR[0] += dist/110;
	this.view = this.calcView(vec3.add(this.PR, this.REF));
}

Camera.prototype.moveLeft = function(dist) {
	this.PR[0] -= dist/110;
	this.view = this.calcView(vec3.add(this.PR, this.REF));
}


var cam = new Camera(0, 0, 10, 0, 0, 0);
var model = mat4.create();
mat4.identity(model);
//var mvMAT = mat4.add(model, cam.getVMatrix());