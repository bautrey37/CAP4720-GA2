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

        function loadModel(modelfilename) {
            modelfilename = "../model/" + modelfilename + "/models/model.json";
            model = new RenderableModel(gl, parseJSON(modelfilename));
            camera = new Camera(gl, model.getBounds(), [0, 1, 0]);
            projMatrix = camera.getProjMatrix(fov, near, far);
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

			// Set up key listeners to move through the world.
			window.onkeyup = 
			function(e) {
				if (e.keyCode == 37) {
					// User pressed left arrow.  Pan (Look left)
					viewMatrix = camera.panLeft();
				}
				else if (e.keyCode == 39) {
					// User pressed right arrow. Pan (Look right)
					viewMatrix = camera.panRight();
				}
				else if (e.keyCode == 38) {
					// User pressed up arrow. Tilt (Look up)
					viewMatrix = camera.tiltUp();
				}	
				else if (e.keyCode == 40) {
					// User pressed down arrow. Tilt (Look down)
					viewMatrix = camera.tiltDown();
				}
				else if (e.keyCode == 65) {
					// User pressed 'a' key. Truck (Step left)
					viewMatrix = camera.truckLeft();
					// The light source is always at the eye.
				model.lightPosition = [camera.getEye()[0], camera.getEye()[1], camera.getEye()[2]];
				}
				else if (e.keyCode == 68) {
					// User pressed 'd' key. Truck (Step right)
					viewMatrix = camera.truckRight();
					// The light source is always at the eye.
				model.lightPosition = [camera.getEye()[0], camera.getEye()[1], camera.getEye()[2]];
				}
				else if (e.keyCode == 87) {
					// User pressed 'w' key. Dolly (Step in)
					viewMatrix = camera.dollyToward();
				}
				else if (e.keyCode == 83) {
					// User pressed 's' key. Dolly (Step back)
					viewMatrix = camera.dollyBack();
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