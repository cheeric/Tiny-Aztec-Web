function Mesh() {
	this.faces = new Array();
}

Mesh.prototype.getVertices = function() {
	var vertices = new Array();
	for (var i = 0; i < this.faces.length; i++){
		var start = this.faces[i].getHalfEdge();
		var temp = start;
		do {
			var coord = temp.getVertex().getCoord();
			vertices[vertices.length] = coord[0];
			vertices[vertices.length] = coord[1];
			vertices[vertices.length] = coord[2];
			vertices[vertices.length] = 1.0;

			temp = temp.getNext();
		}
		while(temp != start);
	}
	return vertices;
}

Mesh.prototype.getColors = function() {
	var colors = new Array();
	for (var i = 0; i < this.faces.length; i++){
		var color = this.faces[i].getColor();
		var start = this.faces[i].getHalfEdge();
		var temp = start;
		do {
			colors[colors.length] = color[0];
			colors[colors.length] = color[1];
			colors[colors.length] = color[2];
			colors[colors.length] = color[3];

			temp = temp.getNext();
		}
		while(temp != start);
	}
	return colors;
}

Mesh.prototype.getIndices = function() {
	var indices = new Array();
	var startInd = 0;
	for (var i = 0; i < this.faces.length; i++){
		var start = this.faces[i].getHalfEdge();
		var temp = start;
		var numEdge = 0;

		// count how many edges are on this face
		do {
			numEdge++;
			temp = temp.getNext();
		} while (temp != start);
			
		// create indices based on the number of edges
		var numTriangle = numEdge - 2;
		var lastVert = 1;
		for (var j = 0; j < numTriangle; j++)
		{
			indices[indices.length] = startInd;
			indices[indices.length] = startInd + lastVert;
			indices[indices.length] = startInd + lastVert + 1;
			lastVert++;
		}
		startInd += numTriangle + 2;
	}
	return indices;
}

Mesh.prototype.getNormals = function() {
	var normals = new Array();
	for (var i = 0; i < this.faces.length; i++){
		var norm = calcNormal(this.faces[i]);
		var temp = start;
		do {
			normals[normals.length] = norm[0];
			normals[normals.length] = norm[1];
			normals[normals.length] = norm[2];
			normals[normals.length] = 0.0;

			temp = temp.getNext();
		}
		while(temp != start);
	}
	return normals;
}


function calcNormal(face){
	// calculate computed unit length normal at centroid
	var a = 0.0;
	var b = 0.0;
	var c = 0.0;

	var temp = face.getHalfEdge();
	do {
		var p1 = temp.getVertex().getCoord();
		var p2 = temp.getNext().getVertex().getCoord();

		a += (p1[1] - p2[1]) * (p1[2] + p2[2]);
		b += (p1[2] - p2[2]) * (p1[0] + p2[0]);
		c += (p1[0] - p2[0]) * (p1[1] + p2[1]);

		temp = temp.getNext();
	} while (temp != face.getHalfEdge());

	return vec3.create([a,b,c]);
}


function rayPlaneInter(p1, p2, f){
	var t;
	var norm = calcNormal(f);
	var S = f.getHalfEdge().getVertex().getCoord();
	var trash = vec3.create();

	// make sure the ray is not parallel or on the plane
	if (vec3.dot(norm, vec3.subtract(p2,p1, trash)) != 0)
		t = vec3.dot(norm, vec3.subtract(S, p1, trash)) / vec3.dot(norm, vec3.subtract(p2, p1, trash));

	return t;
}

function pointInPoly(p, f){
	// find the largest normal component in the face
	var norm = calcNormal(f);
	var x = Math.abs(norm[0]);
	var y = Math.abs(norm[1]);
	var z = Math.abs(norm[2]);

	var ind1;
	var ind2;

	// depending on the largest normal component, project the face
	// onto that plane
	if (x >= y && x >= z)
	{
		ind1 = 1;
		ind2 = 2;
	}
	else if (y >= x && y >= z)
	{
		ind1 = 0;
		ind2 = 2;
	}
	else if (z >= x && z >= y)
	{
		ind1 = 0;
		ind2 = 1;
	}


	var start = f.getHalfEdge();
	var temp = start;
	var inside = false;

	do {
		// iterate through each edge
		var p1 = temp.getVertex().getCoord();
		var p2 = temp.getNext().getVertex().getCoord();

		// swap p1 and p2
		if (p1[ind2] > p2[ind2]) 
		{
			var swap = p2;
			p2 = p1;
			p1 = swap;
		}

		if (p[ind2] > p1[ind2])	{
			if (p[ind2] <= p2[ind2]) {
				if (p1[ind2] != p2[ind2]) {
					if (((p[ind1] - p1[ind1]) * (p2[ind2] - p1[ind2])) -
						((p2[ind1] - p1[ind1]) * (p[ind2] - p1[ind2])) > 0)	{
						inside = !inside;
					}
				}
			}
		}

		temp = temp.getNext();
	} while (temp != start);
	return inside;
}

function unitCube() {

	// create vertices
	var v0 = new Vertex(1, 1, 1);
	var v1 = new Vertex(-1, 1, 1);
	var v2 = new Vertex(-1, -1, 1);
	var v3 = new Vertex(1, -1, 1);
	var v4 = new Vertex(1, -1, -1);
	var v5 = new Vertex(1, 1, -1);
	var v6 = new Vertex(-1, 1, -1);
	var v7 = new Vertex(-1, -1, -1);

	// create half edges

	// front face
	var frHE1 = new HalfEdge();
	var frHE2 = new HalfEdge();
	var frHE3 = new HalfEdge();
	var frHE4 = new HalfEdge();

	frHE1.setNext(frHE2);
	frHE2.setNext(frHE3);
	frHE3.setNext(frHE4);
	frHE4.setNext(frHE1);

	frHE1.setVertex(v0);
	frHE2.setVertex(v1);
	frHE3.setVertex(v2);
	frHE4.setVertex(v3);

	var riHE1 = new HalfEdge();
	var riHE2 = new HalfEdge();
	var riHE3 = new HalfEdge();
	var riHE4 = new HalfEdge();

	riHE1.setNext(riHE2);
	riHE2.setNext(riHE3);
	riHE3.setNext(riHE4);
	riHE4.setNext(riHE1);

	riHE1.setVertex(v3);
	riHE2.setVertex(v4);
	riHE3.setVertex(v5);
	riHE4.setVertex(v0);

	var toHE1 = new HalfEdge();
	var toHE2 = new HalfEdge();
	var toHE3 = new HalfEdge();
	var toHE4 = new HalfEdge();

	toHE1.setNext(toHE2);
	toHE2.setNext(toHE3);
	toHE3.setNext(toHE4);
	toHE4.setNext(toHE1);

	toHE1.setVertex(v1);
	toHE2.setVertex(v0);
	toHE3.setVertex(v5);
	toHE4.setVertex(v6);

	var leHE1 = new HalfEdge();
	var leHE2 = new HalfEdge();
	var leHE3 = new HalfEdge();
	var leHE4 = new HalfEdge();

	leHE1.setNext(leHE2);
	leHE2.setNext(leHE3);
	leHE3.setNext(leHE4);
	leHE4.setNext(leHE1);

	leHE1.setVertex(v7);
	leHE2.setVertex(v2);
	leHE3.setVertex(v1);
	leHE4.setVertex(v6);

	var boHE1 = new HalfEdge();
	var boHE2 = new HalfEdge();
	var boHE3 = new HalfEdge();
	var boHE4 = new HalfEdge();

	boHE1.setNext(boHE2);
	boHE2.setNext(boHE3);
	boHE3.setNext(boHE4);
	boHE4.setNext(boHE1);

	boHE1.setVertex(v3);
	boHE2.setVertex(v2);
	boHE3.setVertex(v7);
	boHE4.setVertex(v4);

	var baHE1 = new HalfEdge();
	var baHE2 = new HalfEdge();
	var baHE3 = new HalfEdge();
	var baHE4 = new HalfEdge();

	baHE1.setNext(baHE2);
	baHE2.setNext(baHE3);
	baHE3.setNext(baHE4);
	baHE4.setNext(baHE1);

	baHE1.setVertex(v6);
	baHE2.setVertex(v5);
	baHE3.setVertex(v4);
	baHE4.setVertex(v7);

	// set symetric half edges

	frHE1.setSym(riHE1);
	frHE2.setSym(toHE2);
	frHE3.setSym(leHE3);
	frHE4.setSym(boHE2);

	riHE1.setSym(frHE1);
	riHE2.setSym(boHE1);
	riHE3.setSym(baHE3);
	riHE4.setSym(toHE3);

	toHE1.setSym(leHE4);
	toHE2.setSym(frHE2);
	toHE3.setSym(riHE4);
	toHE4.setSym(baHE2);

	leHE1.setSym(baHE1);
	leHE2.setSym(boHE3);
	leHE3.setSym(frHE3);
	leHE4.setSym(toHE1);

	boHE1.setSym(riHE2);
	boHE2.setSym(frHE4);
	boHE3.setSym(leHE2);
	boHE4.setSym(baHE4);

	baHE1.setSym(leHE1);
	baHE2.setSym(toHE4);
	baHE3.setSym(riHE3);
	baHE4.setSym(boHE4);

	// create faces

	var front = new Face(0);
	front.setColor(1, 0, 0);

	front.setHalfEdge(frHE1);
	frHE1.setFace(front);
	frHE2.setFace(front);
	frHE3.setFace(front);
	frHE4.setFace(front);

	var right = new Face(1);
	right.setColor(0, 1, 0);

	right.setHalfEdge(riHE1);
	riHE1.setFace(right);
	riHE2.setFace(right);
	riHE3.setFace(right);
	riHE4.setFace(right);

	var top = new Face(2);
	top.setColor(0, 0, 1);

	top.setHalfEdge(toHE1);
	toHE1.setFace(top);
	toHE2.setFace(top);
	toHE3.setFace(top);
	toHE4.setFace(top);

	var left = new Face(3);
	left.setColor(1, 1, 0);

	left.setHalfEdge(leHE1);
	leHE1.setFace(left);
	leHE2.setFace(left);
	leHE3.setFace(left);
	leHE4.setFace(left);

	var bottom = new Face(4);
	bottom.setColor(1, 0, 1);

	bottom.setHalfEdge(boHE1);
	boHE1.setFace(bottom);
	boHE2.setFace(bottom);
	boHE3.setFace(bottom);
	boHE4.setFace(bottom);

	var back = new Face(5);
	back.setColor(0, 1, 1);

	back.setHalfEdge(baHE1);
	baHE1.setFace(back);
	baHE2.setFace(back);
	baHE3.setFace(back);
	baHE4.setFace(back);

	// return a mesh object with the defined faces
	var cubeMesh = new Mesh();
	cubeMesh.faces[0] = (front);
	cubeMesh.faces[1] = (right);
	cubeMesh.faces[2] = (top);
	cubeMesh.faces[3] = (left);
	cubeMesh.faces[4] = (bottom);
	cubeMesh.faces[5] = (back);

	return cubeMesh;
}


/*
var canvas, context;
//var vector = vec3.create([1, 2, 3]);
function init() {
	canvas = document.getElementById('main_canvas');
	context = canvas.getContext('2d');
	canvas.addEventListener('mousemove', ev_mousemove, false);
	//alert(canvas.width);
}

// The mousemove event handler.
var started = false;
function ev_mousemove (ev) {
	var x, y;

	// Get the mouse position relative to the canvas element.
	if (ev.layerX || ev.layerX == 0) { // Firefox
		x = ev.layerX;
		y = ev.layerY;
	} else if (ev.offsetX || ev.offsetX == 0) { // Opera
		x = ev.offsetX;
		y = ev.offsetY;
	}

	document.getElementById("coord").innerHTML = 'X: ' + x + '    Y: ' + y;
}

init();
*/