function Camera(eyeX, eyeY, eyeZ, refX, refY, refZ) {
	// initialize camera position
	this.N = vec3.create([0.0, 0.0, 1.0]);
	this.upVec = vec3.create([0.0, 1.0, 0.0]);
	this.PR = vec3.create([eyeX, eyeY, eyeZ]);
	this.REF = vec3.create([refX, refY, refZ]);
	this.rotREF = vec3.create([0, 0, 0]);

	this.camXAngle = 0.0;
	this.camYAngle = 0.0;

	this.fov = 60.0;
}

Camera.prototype.setWindowSize = function(width, height){
	this.windowWidth = width;
	this.windowHeight = height;
}

Camera.prototype.getVMatrix = function() {
	
	// calculate translation matrix
	this.T1 = mat4.create();
	mat4.identity(this.T1);
	this.T1[12] = -this.rotREF[0];
	this.T1[13] = -this.rotREF[1];
	this.T1[14] = -this.rotREF[2];

	this.R = mat4.create();
	mat4.identity(this.R);
	mat4.rotateX(this.R, degToRad(this.camYAngle));
	mat4.rotateY(this.R, degToRad(this.camXAngle));

	this.T2 =  mat4.create();
	mat4.identity(this.T2);
	this.T2[12] = -(this.REF[0] - this.rotREF[0] + this.PR[0]);
	this.T2[13] = -(this.REF[1] - this.rotREF[1] + this.PR[1]);
	this.T2[14] = -(this.REF[2] - this.rotREF[2] + this.PR[2]);

	this.view = mat4.create();
	mat4.identity(this.view);
	mat4.multiply(this.T1, this.view, this.view);
	mat4.multiply(this.R, this.view, this.view);
    mat4.multiply(this.T2, this.view, this.view);

	return this.view;
}

Camera.prototype.getEyeVec = function() {
	var model = mat4.create();
	mat4.identity(model);
	mat4.rotateY(model, degToRad(-this.camXAngle));
	mat4.rotateX(model, degToRad(-this.camYAngle));

	var temp = mat4.multiplyVec4(model, [this.REF[0]-this.rotREF[0]+this.PR[0], this.REF[1]-this.rotREF[1]+this.PR[1], this.REF[2]-this.rotREF[2]+this.PR[2], 1.0]);
	return [temp[0], temp[1], temp[2]];
}

Camera.prototype.getUpVec = function() {
	var model = mat4.create();
	mat4.identity(model);
	mat4.rotateY(model, degToRad(-this.camXAngle));
	mat4.rotateX(model, degToRad(-this.camYAngle));

	var temp = mat4.multiplyVec4(model, [this.upVec[0], this.upVec[1], this.upVec[2], 1.0]);
	return [temp[0], temp[1], temp[2]];
}

Camera.prototype.getRef = function() {
	return [this.REF[0], this.REF[1], this.REF[2]];
}



Camera.prototype.rotUp = function(angle) {
	this.camYAngle -= angle;
}

Camera.prototype.rotDown = function(angle) {
	this.camYAngle += angle;
}

Camera.prototype.rotRight = function(angle) {
	this.camXAngle += angle;
}

Camera.prototype.rotLeft = function(angle) {
	this.camXAngle -= angle;
}


Camera.prototype.zoomIn = function() {
	this.PR[2] *= 9.0/10.0;
}

Camera.prototype.zoomOut = function() {
	this.PR[2] /= 9.0/10.0;
}


Camera.prototype.moveUp = function(dist) {
	var A = vec3.create(), B = vec3.create(), C = vec3.create();

    var E = cam.getEyeVec();
    var U = cam.getUpVec();
    var center = cam.REF;
    vec3.subtract(center, E, C);
    vec3.cross(C, U, A);
    vec3.cross(A, C, B);
    vec3.normalize(A);
    alert(vec3.str(A));
	
	this.PR[1] -= dist/110;
	this.REF[1] -= dist/110;
}

Camera.prototype.moveDown = function(dist) {
	this.PR[1] += dist/110;
	this.REF[1] += dist/110;
}

Camera.prototype.moveRight = function(dist) {
	this.PR[0] -= dist/110;
	this.REF[0] -= dist/110;
}

Camera.prototype.moveLeft = function(dist) {
	this.PR[0] += dist/110;
	this.REF[0] += dist/110;
}


Camera.prototype.move = function(T) {
	vec3.negate(T);

	var model = mat4.create();
	mat4.identity(model);
	mat4.rotateY(model, degToRad(-this.camXAngle));
	mat4.rotateX(model, degToRad(-this.camYAngle));
	mat4.inverse(model);
	
	var T4 = mat4.multiplyVec4(model, [T[0], T[1], T[2], 1]);

	T[0] = T4[0];
	T[1] = T4[1];
	T[2] = T4[2];

	this.REF[0] += vec3.dot(T, [1,0,0]);
	this.REF[1] += vec3.dot(T, [0,1,0]);
}

Camera.prototype.getP = function(x, y) {
	var n_x = x / canvas.width;
    var n_y = 1 - (y / canvas.height);

    var A = vec3.create(), B = vec3.create(), C = vec3.create(), M = vec3.create(), V = vec3.create(), H = vec3.create(), P = vec3.create();

    var E = vec3.create();
    vec3.add(this.REF, this.PR, E);
    var U = cam.upVec;
    var center = cam.REF;
    vec3.subtract(center, E, C);
    vec3.cross(C, U, A);
    vec3.cross(A, C, B);
    vec3.add(E,C,M);
    var phi = degToRad(fov/2);
    vec3.scale(B, (1.0/(vec3.length(B)) * (vec3.length(C)*Math.tan(phi))), V);
    vec3.scale(A, (1.0/(vec3.length(A)) * (vec3.length(C)*Math.tan(phi)*(canvas.width/canvas.height))), H);
    vec3.add(vec3.add(M, vec3.scale(H, (2*n_x-1))), vec3.scale(V, (2*n_y-1)), P);

    var model = mat4.create();
	mat4.identity(model);
	mat4.rotateY(model, degToRad(-this.camXAngle));
	mat4.rotateX(model, degToRad(-this.camYAngle));

	var temp = mat4.multiplyVec4(model, [P[0], P[1], P[2], 1.0]);
	return [temp[0], temp[1], temp[2]];
}


var cam = new Camera(0, 0, 10, 0, 0, 0);
var model = mat4.create();
mat4.identity(model);
//var mvMAT = mat4.add(model, cam.getVMatrix());