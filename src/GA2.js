		var webgl;

        function addMessage(message) {
            console.log(message);
        }

        //This function gets called when reading a JSON file. It stores the current xml information.
        function parseJSON(jsonFile) {
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", jsonFile, false);
            xhttp.overrideMimeType("application/json");
            xhttp.send(null);
            var Doc = xhttp.responseText;
            return JSON.parse(Doc);
        }
        var gl;
        var model, camera, projMatrix, viewMatrix;
        var fov = 26; //intial values, will change while program runs
        var near = 0.1;
        var far = 10;

        function loadModel(modelfilename1) {
			
            modelfilename = "../model/" + modelfilename1 + "/models/model.json";
            model = new RenderableModel(gl, parseJSON(modelfilename));
            camera = new Camera(gl, model.getBounds(), [0, 1, 0]);
            projMatrix = camera.getProjMatrix(fov, near, far);
			viewMatrix = camera.getViewMatrix();
		document.getElementById("myCanvas").focus();
		document.getElementById("modelList").blur();

        }
        function WebGL() {
            // ... global variables ...
            var canvas = null;
            var messageField = null;

            canvas = document.getElementById("myCanvas");
            addMessage(((canvas) ? "Canvas acquired" : "Error: Can not acquire canvas"));
            gl = getWebGLContext(canvas, false);
            addMessage(((gl) ? "Rendering context for WebGL acquired" : "Error: Failed to get the rendering context for WebGL"));

            var angle = 0;
            var modelList = document.getElementById("modelList");
            loadModel(modelList.options[modelList.selectedIndex].value);
			var intervalL = null, intervalR = null, intervalU = null, intervalDo = null;
			var intervalW = null, intervalA = null, intervalS = null, intervalD = null;
			var intervalR = null, intervalF = null;
	
			// Set up key listeners to move through the world.
			window.onkeydown = 
			function(e) {
				if(e.keyCode == 37 && intervalL == null) {
					intervalL = setInterval(function() {
							// User pressed left arrow.  Pan (Look left)
							viewMatrix = camera.panLeft();
							model.atPosition = [camera.getAt()[0], camera.getAt()[1], camera.getAt()[2]];
					}, 30);
				}
				if(e.keyCode == 39 && intervalR == null) {
					intervalR = setInterval(function() {
							// User pressed right arrow.  Pan (Look right)
							viewMatrix = camera.panRight();
							model.atPosition = [camera.getAt()[0], camera.getAt()[1], camera.getAt()[2]];
					}, 30);
				}
				if(e.keyCode == 38 && intervalU == null) {
					intervalU = setInterval(function() {
							// User pressed up arrow.  Tilt (Look up)
							viewMatrix = camera.tiltUp();
							model.atPosition = [camera.getAt()[0], camera.getAt()[1], camera.getAt()[2]];
					}, 30);
				}
				if(e.keyCode == 40 && intervalDo == null) {
					intervalDo = setInterval(function() {
							// User pressed down arrow.  Tilt (Look down)
							viewMatrix = camera.tiltDown();
							model.atPosition = [camera.getAt()[0], camera.getAt()[1], camera.getAt()[2]];
					}, 30);
				}
				if(e.keyCode == 65 && intervalA == null) {
					intervalA = setInterval(function() {
							// User pressed 'a' key. Truck (Step left)
							viewMatrix = camera.truckLeft();
							// The light source is always at the eye.
							model.lightPosition = [camera.getEye()[0], camera.getEye()[1], camera.getEye()[2]];
					}, 30);
				}
				if(e.keyCode == 68 && intervalD == null) {
					intervalD = setInterval(function() {
							// User pressed 'd' key. Truck (Step right)
							viewMatrix = camera.truckRight();
							// The light source is always at the eye.
							model.lightPosition = [camera.getEye()[0], camera.getEye()[1], camera.getEye()[2]];
					}, 30);
				}
				if(e.keyCode == 82 && intervalR == null) {
					intervalR = setInterval(function() {
							// User pressed 'r' key. Dolly (Step in)
							viewMatrix = camera.dollyToward();
					}, 30);
				}
				if(e.keyCode == 70 && intervalF == null) {
					intervalF = setInterval(function() {
							// User pressed 'f' key. Dolly (Step back)
							viewMatrix = camera.dollyBack();
					}, 30);
				}
				if(e.keyCode == 87 && intervalW == null) {
					intervalW = setInterval(function() {
							// User pressed 'w' key. Pedestal (move down)
							viewMatrix = camera.pedestalUp();
							model.lightPosition = [camera.getEye()[0], camera.getEye()[1], camera.getEye()[2]];
					}, 30);
				}
				if(e.keyCode == 83 && intervalS == null) {
					intervalS = setInterval(function() {
							// User pressed 's' key. Pedestal (move down)
							viewMatrix = camera.pedestalDown();
							model.lightPosition = [camera.getEye()[0], camera.getEye()[1], camera.getEye()[2]];
					}, 30);
				}
			}
			// Clear previous keydown interval.
			window.onkeyup = function(e) {
				if(e.keyCode == 37) {
					clearInterval(intervalL);
					intervalL = null;
				}
				if(e.keyCode == 39) {
					clearInterval(intervalR);
				intervalR = null;
				}
				if(e.keyCode == 38) {
					clearInterval(intervalU);
					intervalU = null;
				}
				if(e.keyCode == 40) {
					clearInterval(intervalDo);
					intervalDo = null;
				}
				if(e.keyCode == 65) {
					clearInterval(intervalA);
					intervalA = null;
				}
				if(e.keyCode == 68) {
					clearInterval(intervalD);
					intervalD = null;
				}
				if(e.keyCode == 82) {
					clearInterval(intervalR);
					intervalR = null;
				}
				if(e.keyCode == 70) {
					clearInterval(intervalF);
					intervalF = null;
				}
				if(e.keyCode == 87) {
					clearInterval(intervalW);
					intervalW = null;
				}
				if(e.keyCode == 83) {
					clearInterval(intervalS);
					intervalS = null;
				}

			}
			
            function draw() {
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                model.draw(projMatrix, viewMatrix);
                window.requestAnimationFrame(draw);
            }

            gl.clearColor(0, 0, 0, 1);
            gl.enable(gl.DEPTH_TEST);

			// Set initial view matrix.
			viewMatrix = camera.getViewMatrix();
            draw();

            this.changeFOV = function (val) {
                fov = val;
                projMatrix = camera.getProjMatrix(val, near, far);
            };
            this.changeNear = function (val) {
                near = val;
                projMatrix = camera.getProjMatrix(fov, val, far);
            };
            this.changeFar = function (val) {
                far = val;
                projMatrix = camera.getProjMatrix(fov, near, val);
            };

            return 1;
        }

        function main() {
            webgl = new WebGL();
        }