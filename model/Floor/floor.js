var floormesh = {
  vertexPositions : [
    -1.0, 0.0,  -1.0,
     1.0, 0.0,  -1.0,
     -1.0,  0.0,  1.0,
	 1.0,  0.0,  1.0,
  ],
  vertexColors :[
    1.0,  1.0,  1.0,
	1.0,  1.0,  1.0,
	1.0,  1.0,  1.0,
	1.0,  1.0,  1.0,
  ],
  indices : [
    0,  1,  2,      2, 1, 3    // front
	/*
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left
	*/
  ]};
  var floorObject = {
   meshes:[floormesh]
  };
  //console.log(cube);