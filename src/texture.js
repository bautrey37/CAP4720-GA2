/**
 * Stores texture code
 */
function loadModelTexture(modelData, pathname) {
    var imageDictionary = {};
    for (var i = 0; i < modelData.materials.length; i++) {
        if (modelData.materials[i].diffuseTexture) {
            var filename = modelData.materials[i].diffuseTexture[0];
            console.log(filename);
            if (imageDictionary[filename] === undefined) {
                imageDictionary[filename] = setTexture(gl, pathname + filename);
            }
            modelData.materials[i].diffuseTexObj = imageDictionary[filename];
        }
    }
}

function createTexture(imageFileName) {
    var tex = gl.createTexture();
    var img = new Image();
    img.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); //converts texture origin to be from top left to bottom left
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    img.src = imageFileName;
}

var imagecount = 0;
function setTexture(gl, textureFileName) {
    var tex = gl.createTexture();
    tex.width = 0;
    tex.height = 0;
    var img = new Image();
    imagecount++;
    img.onload = function () {
        function isPowerOfTwo(x) {
            return (x & (x - 1)) == 0;
        }

        var nPOT = false; // nPOT: notPowerOfTwo
        console.log(textureFileName + " loaded : " + img.width + "x" + img.height);
        tex.complete = img.complete;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        if (!isPowerOfTwo(img.width) || !isPowerOfTwo(img.height)) nPOT = true;
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        //void texImage2D(enum target, int level, enum internalformat, enum format, enum type, Object object);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, (nPOT) ? gl.CLAMP_TO_EDGE : gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, (nPOT) ? gl.CLAMP_TO_EDGE : gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, ((nPOT) ? gl.LINEAR : gl.LINEAR_MIPMAP_LINEAR));
        if (!nPOT)gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        tex.width = img.width;
        tex.height = img.height;
        imagecount--;
    };
    img.src = textureFileName;
    return tex;
}
