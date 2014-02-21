function makePerlinArray(w, h) {
	var arr = new Array(h * w);
	for(var y = 0; y < h; ++y) {
		for(var x = 0; x < w; ++x) {
			arr[y * w + x] = _perlinCell(x, y);
		}
	}
	return arr;
}

function _perlinCell(x, y) {
	total = 0;
	p = 0.25
	n = 10; // 10 octaves

	for(var i = 0; i < n; ++i) {
		frequency = Math.pow(2, i);
		amplitude = Math.pow(p, i);
		total = total + _generateInterpolatedNoise(x * frequency, y * frequency) * amplitude;
	}

	return total
}

function _generateInterpolatedNoise(x, y) {
	

	var intX = parseInt(x);
	var fractionalX = x - intX;
	var intY = parseInt(y);
	var fractionalY = y - intY;

	v1 = _smoothedNoise(intX, intY);
	v2 = _smoothedNoise(intX + 1, intY);
	v3 = _smoothedNoise(intX, intY + 1);
	v4 = _smoothedNoise(intX + 1, intY + 1);

	i1 = _lerp(v1, v2, fractionalX);
	i2 = _lerp(v3, v4, fractionalY);

	return _lerp(i1, i2, fractionalY);
}

function _smoothedNoise(x, y) {
	corners = (_noise(x-1,y-1) + _noise(x+1,y-1) + _noise(x-1,y+1) + _noise(x+1,y+1)) / 16.0;
	sides = (_noise(x-1,y) + _noise(x+1,y) + _noise(x, y-1) + _noise(x,y+1)) / 8.0;
	centre = _noise(x,y) / 4.0;
	return corners+sides+centre;
}

function _noise(x,y) {
	n = x + y * 57;
	n = (n << 13) ^ n;
	return ( 1.0 - ( (n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);
}

function _lerp(a, b, n) {
	return (a * (1 - n)) + (b * n);
}

// todo... implement the rest of the perlin function
	// then use it to make clouds.