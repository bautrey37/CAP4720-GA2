function Camera(gl, d, modelUp) // Compute a camera from model's bounding box dimensions
{
    var center = [(d.min[0] + d.max[0]) / 2, (d.min[1] + d.max[1]) / 2, (d.min[2] + d.max[2]) / 2];
    var diagonal = Math.sqrt(Math.pow((d.max[0] - d.min[0]), 2) + Math.pow((d.max[1] - d.min[1]), 2) + Math.pow((d.max[2] - d.min[2]), 2));
  
    var name = "auto";
    var at = center;
    var eye = [center[0], center[1] + diagonal * 0.5, center[2] + diagonal * 1.5];
    var up = [modelUp[0], modelUp[1], modelUp[2]];
    var fov = 32, near = 0.1, far = 10;
	var tiltAngle = 0;
	

    this.getViewMatrix = function (e) {
        if (e == undefined) e = eye;
        return new Matrix4().setLookAt(e[0], e[1], e[2], at[0], at[1], at[2], up[0], up[1], up[2]);
    };
	
	this.getEye = function() {
		return eye;
	}
	this.getAt = function() {
		return at;
	}
    this.getProjMatrix = function (FOV, n, f) {
        fov = FOV;
        near = diagonal * n;
        far = diagonal * f;
        addMessage("FOV: " + fov + ", near: " + (near / diagonal).toFixed(2) + ", far: " + (far / diagonal).toFixed(2));
        return new Matrix4().setPerspective(fov, gl.canvas.width / gl.canvas.height, near, far);
    };
	// User pressed left arrow. Pan (Look left)
	this.panLeft = function() {
		var m = this.getViewMatrix();
			// Get the camera's local y-axis (V-axis).
			var v = [m.elements[1], m.elements[5], m.elements[9]];
			// Rotate matrix by one degree.
			var rotM = new Matrix4().setTranslate(eye[0], eye[1], eye[2]).rotate(1.5, v[0], v[1], v[2]).translate(-eye[0], -eye[1], -eye[2]);
			// Multiply by old at vector.
			var newAt = rotM.multiplyVector4(new Vector4([at[0], at[1], at[2], 1]));
			at[0]=newAt.elements[0]; at[1]=newAt.elements[1]; at[2] =newAt.elements[2];
		
		// Set camera's new view matrix.
		return this.getViewMatrix();
	}
	// User pressed right arrow. Pan (Look right)
	this.panRight = function() {
		var m = this.getViewMatrix();
		// Get the camera's local y-axis (-axis).
		var v = [m.elements[1], m.elements[5], m.elements[9]];
		// Rotate matrix by one degree.
		var rotM = new Matrix4().setTranslate(eye[0], eye[1], eye[2]).rotate(-1.5, v[0], v[1], v[2]).translate(-eye[0], -eye[1], -eye[2]);
		// Multiply by old at vector.
		var newAt = rotM.multiplyVector4(new Vector4([at[0], at[1], at[2], 1]));
		at[0]=newAt.elements[0]; at[1]=newAt.elements[1]; at[2] =newAt.elements[2];
		
		// Set camera's new view matrix.
		return this.getViewMatrix();
	}
	// User pressed up arrow. Tilt (Look up)
	this.tiltUp = function() {		
		// Do not allow unlimited tilting.
		if (tiltAngle < 90) {
			tiltAngle++;
			
			var m = this.getViewMatrix();
			// Get the camera's local x-axis (U-axis).
			var u = [m.elements[0], m.elements[4], m.elements[8]];
			// Rotate matrix by one degree.
			var rotM = new Matrix4().setTranslate(eye[0], eye[1], eye[2]).rotate(1, u[0], u[1], u[2]).translate(-eye[0], -eye[1], -eye[2]);
			// Multiply by old at vector.
			var newAt = rotM.multiplyVector4(new Vector4([at[0], at[1], at[2], 1]));
			at[0]=newAt.elements[0]; at[1]=newAt.elements[1]; at[2] =newAt.elements[2];
		}
		// Set camera's new view matrix.
		return this.getViewMatrix();
	}
	// User pressed down arrow. Tilt (Look down)
	this.tiltDown = function() {
		// Do not allow unlimited tilting.
		if (tiltAngle > -90) {
			tiltAngle--;
	
			var m = this.getViewMatrix();
			// Get the camera's local x-axis (U-axis).
			var u = [m.elements[0], m.elements[4], m.elements[8]];
			// Rotate matrix by one degree.
			var rotM = new Matrix4().setTranslate(eye[0], eye[1], eye[2]).rotate(-1, u[0], u[1], u[2]).translate(-eye[0], -eye[1], -eye[2]);
			// Multiply by old at vector.
			var newAt = rotM.multiplyVector4(new Vector4([at[0], at[1], at[2], 1]));
			at[0]=newAt.elements[0]; at[1]=newAt.elements[1]; at[2]=newAt.elements[2];
		}
		// Set camera's new view matrix.
		return this.getViewMatrix();
	}
	// User pressed 'a' key. Truck (Step left)
	this.truckLeft = function() {
		var delta = diagonal * 0.05;
		var m = this.getViewMatrix();
		// Get the camera's local x-axis (U-axis).
		var u = [m.elements[0], m.elements[4], m.elements[8]];
		
		var newEye = new Matrix4()
					.setTranslate(-u[0] * delta, -u[1] * delta, -u[2] * delta)
					.multiplyVector4(new Vector4([eye[0], eye[1], eye[2], 1]));
					
		var newAt = new Matrix4()
					.setTranslate(-u[0] * delta, -u[1] * delta, -u[2] * delta)
					.multiplyVector4(new Vector4([at[0], at[1], at[2], 1]));
					
		eye[0] = newEye.elements[0]; eye[1] = newEye.elements[1]; eye[2] = newEye.elements[2];
		at[0] = newAt.elements[0]; at[1] = newAt.elements[1]; at[2] = newAt.elements[2];
		
		return this.getViewMatrix();
	}
	// User pressed 'd' key. Truck (Step right)
	this.truckRight = function() {
		var delta = diagonal * 0.05;
		var m = this.getViewMatrix();
		// Get the camera's local x-axis (U-axis).
		var u = [m.elements[0], m.elements[4], m.elements[8]];
		
		var newEye = new Matrix4()
					.setTranslate(u[0] * delta, u[1] * delta, u[2] * delta)
					.multiplyVector4(new Vector4([eye[0], eye[1], eye[2], 1]));
					
		var newAt = new Matrix4()
					.setTranslate(u[0] * delta, u[1] * delta, u[2] * delta)
					.multiplyVector4(new Vector4([at[0], at[1], at[2], 1]));
					
		eye[0] = newEye.elements[0]; eye[1] = newEye.elements[1]; eye[2] = newEye.elements[2];
		at[0] = newAt.elements[0]; at[1] = newAt.elements[1]; at[2] = newAt.elements[2];
		
		return this.getViewMatrix();
		
	}
	// User pressed 'r' key. Dolly (Step in)
	this.dollyToward = function() {
		var delta = .03;
		var w = [eye[0] - at[0], eye[1] - at[1], eye[2] - at[2]];
		var newEye = new Matrix4()
					.setTranslate(-w[0] * delta, -w[1] * delta, -w[2] * delta)
					.multiplyVector4(new Vector4([eye[0], eye[1], eye[2], 1]));
		var newAt = new Matrix4()
					.setTranslate(-w[0] * delta, -w[1] * delta, -w[2] * delta)
					.multiplyVector4(new Vector4([at[0], at[1], at[2], 1]));
					
		eye[0] = newEye.elements[0]; eye[1] = newEye.elements[1]; eye[2] = newEye.elements[2];
		at[0] = newAt.elements[0]; at[1] = newAt.elements[1]; at[2] = newAt.elements[2];
		
		return this.getViewMatrix();
		
	}
	// User pressed 'f' key. Dolly (Step back)
	this.dollyBack = function() {
		var delta = .03;
		var w = [eye[0] - at[0], eye[1] - at[1], eye[2] - at[2]];
		var newEye = new Matrix4()
					.setTranslate(w[0] * delta, w[1] * delta, w[2] * delta)
					.multiplyVector4(new Vector4([eye[0], eye[1], eye[2], 1]));
		var newAt = new Matrix4()
					.setTranslate(w[0] * delta, w[1] * delta, w[2] * delta)
					.multiplyVector4(new Vector4([at[0], at[1], at[2], 1]));
					
		eye[0] = newEye.elements[0]; eye[1] = newEye.elements[1]; eye[2] = newEye.elements[2];
		at[0] = newAt.elements[0]; at[1] = newAt.elements[1]; at[2] = newAt.elements[2];
	
		
		return this.getViewMatrix();

	}
	
	// User pressed 'w' key. Pedestal (Move up)
	this.pedestalUp = function() {
	console.log('got here');
		var delta = diagonal * 0.05;
		
		var newEye = new Matrix4()
					.setTranslate(up[0] * delta, up[1] * delta, up[2] * delta)
					.multiplyVector4(new Vector4([eye[0], eye[1], eye[2], 1]));
		var newAt = new Matrix4()
					.setTranslate(up[0] * delta, up[1] * delta, up[2] * delta)
					.multiplyVector4(new Vector4([at[0], at[1], at[2], 1]));
					
		eye[0] = newEye.elements[0]; eye[1] = newEye.elements[1]; eye[2] = newEye.elements[2];
		at[0] = newAt.elements[0]; at[1] = newAt.elements[1]; at[2] = newAt.elements[2];
		
		return this.getViewMatrix();
	}
	
	// User pressed 's' key. Pedestal (Move down)
	this.pedestalDown = function() {
	console.log('got here');
		var delta = diagonal * 0.05;
		
		var newEye = new Matrix4()
					.setTranslate(-up[0] * delta, -up[1] * delta, -up[2] * delta)
					.multiplyVector4(new Vector4([eye[0], eye[1], eye[2], 1]));
		var newAt = new Matrix4()
					.setTranslate(-up[0] * delta, -up[1] * delta, -up[2] * delta)
					.multiplyVector4(new Vector4([at[0], at[1], at[2], 1]));
					
		eye[0] = newEye.elements[0]; eye[1] = newEye.elements[1]; eye[2] = newEye.elements[2];
		at[0] = newAt.elements[0]; at[1] = newAt.elements[1]; at[2] = newAt.elements[2];
		
		return this.getViewMatrix();
	}
}
