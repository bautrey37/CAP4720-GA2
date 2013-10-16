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
        var far = 3.0;
		var mFlag = .001;

        function loadModel(modelfilename1) {
			
            modelfilename = "../model/" + modelfilename1 + "/models/model.json";
            model = new RenderableModel(gl, parseJSON(modelfilename));
            camera = new Camera(gl, model.getBounds(), [0, 1, 0]);
            projMatrix = camera.getProjMatrix(fov, near, far);
			viewMatrix = camera.getViewMatrix();
			if(modelfilename1 == "House"){
			 mFlag = .001;
			 
			}
			if(modelfilename1 == "DijonPalais"){
			 mFlag = .00001;
			}
			if(modelfilename1 == "House_of_parliament"){
			 mFlag = .0000001;
			}
			if(modelfilename1 == "Shrine"){
			 mFlag = .00001;
			}
			if(modelfilename1 == "crytek"){
			 mFlag = .001;
			}
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
	
			// Set up key listeners to move through the world.
			window.onkeydown = 
			function(e) {
				if(e.keyCode == 37 && intervalL == null) {
					intervalL = setInterval(function() {
							// User pressed left arrow.  Pan (Look left)
							viewMatrix = camera.panLeft();
					}, 100);
				}
				if(e.keyCode == 39 && intervalR == null) {
					intervalR = setInterval(function() {
							// User pressed right arrow.  Pan (Look right)
							viewMatrix = camera.panRight();
					}, 100);
				}
				if(e.keyCode == 38 && intervalU == null) {
					intervalU = setInterval(function() {
							// User pressed up arrow.  Tilt (Look up)
							viewMatrix = camera.tiltUp();
					}, 100);
				}
				if(e.keyCode == 40 && intervalDo == null) {
					intervalDo = setInterval(function() {
							// User pressed down arrow.  Tilt (Look down)
							viewMatrix = camera.tiltDown();
					}, 100);
				}
				if(e.keyCode == 65 && intervalA == null) {
					intervalA = setInterval(function() {
							// User pressed 'a' key. Truck (Step left)
							viewMatrix = camera.truckLeft();
							// The light source is always at the eye.
							model.lightPosition = [camera.getEye()[0], camera.getEye()[1], camera.getEye()[2]];
					}, 100);
				}
				if(e.keyCode == 68 && intervalD == null) {
					intervalD = setInterval(function() {
							// User pressed 'd' key. Truck (Step right)
							viewMatrix = camera.truckRight();
							// The light source is always at the eye.
							model.lightPosition = [camera.getEye()[0], camera.getEye()[1], camera.getEye()[2]];
					}, 100);
				}
				if(e.keyCode == 87 && intervalW == null) {
					intervalW = setInterval(function() {
							// User pressed 'w' key. Dolly (Step in)
							viewMatrix = camera.dollyToward(mFlag);
					}, 100);
				}
				if(e.keyCode == 83 && intervalS == null) {
					intervalS = setInterval(function() {
							// User pressed 's' key. Dolly (Step back)
							viewMatrix = camera.dollyBack(mFlag);
					}, 100);
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