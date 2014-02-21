function makePerlinArray(w, h) {
	var arr = new Array(h * w);
	for(var y = 0; y < h; ++y) {
		for(var x = 0; x < w; ++x) {
			var q = _perlinCell(x, y);
			if(isNaN(q)) {
				q = 0.0;
			}
			arr[y * w + x] = q;
		}
	}
	return arr;
}

function normalizeArray(a) {
	var magnitude = Math.sqrt(_.reduce(a, function(memo, num) { return memo + (num*num); }, 0));
	return _.map(a, function(n) { return n / magnitude; });	
}

function _perlinCell(x, y) {
	var total = 0;
	var p = 0.76;
	var n = 10; // 10 octaves

	for(var i = 0; i < n; ++i) {
		var frequency = Math.pow(2, i);
		var amplitude = Math.pow(p, i);
		total += _generateInterpolatedNoise(x * frequency, y * frequency) * amplitude;
	}

	return total
}

function _generateInterpolatedNoise(x, y) {
	var intX = parseInt(x);
	var fractionalX = x - intX;
	var intY = parseInt(y);
	var fractionalY = y - intY;

	var v1 = _smoothedNoise(intX, intY);
	var v2 = _smoothedNoise(intX + 1, intY);
	var v3 = _smoothedNoise(intX, intY + 1);
	var v4 = _smoothedNoise(intX + 1, intY + 1);

	var i1 = _lerp(v1, v2, fractionalX);
	var i2 = _lerp(v3, v4, fractionalX);

	return _lerp(i1, i2, fractionalY);
}

function _smoothedNoise(x, y) {
	var corners = (_noise(x-1,y-1) + _noise(x+1,y-1) + _noise(x-1,y+1) + _noise(x+1,y+1)) / 16.0;
	var sides = (_noise(x-1,y) + _noise(x+1,y) + _noise(x, y-1) + _noise(x,y+1)) / 8.0;
	var centre = _noise(x,y) / 4.0;
	return corners+sides+centre;
}

function _noise(x,y) {
	var n = x + y * 57;
	n = (n << 13) ^ n;
	return ( 1.0 - ( (n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);
}

function _lerp(a, b, n) {
	return (a * (1 - n)) + (b * n);
}