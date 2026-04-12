	let Block = {
		top: 0x4,
		bottom: 0x8,
		north: 0x20,
		south: 0x10,
		east: 0x2,
		west: 0x1,
	}
	let Sides = {
		top: 0,
		bottom: 1,
		north: 2,
		south: 3,
		east: 4,
		west: 5,
	}

	// GLSL Shader code (written in script tags at the top of the file)
	let vertexShaderSrc3D = document.getElementById("blockVertexShader").text
	let fragmentShaderSrc3D = document.getElementById("blockFragmentShader").text
	let vertexShaderSrc2D = document.getElementById("2dVertexShader").text
	let fragmentShaderSrc2D = document.getElementById("2dFragmentShader").text

	function createProgramObject(curContext, vetexShaderSource, fragmentShaderSource) {
		let vertexShaderObject = curContext.createShader(curContext.VERTEX_SHADER)
		curContext.shaderSource(vertexShaderObject, vetexShaderSource)
		curContext.compileShader(vertexShaderObject)
		if (!curContext.getShaderParameter(vertexShaderObject, curContext.COMPILE_STATUS)) {
			throw curContext.getShaderInfoLog(vertexShaderObject)
		}

		let fragmentShaderObject = curContext.createShader(curContext.FRAGMENT_SHADER)
		curContext.shaderSource(fragmentShaderObject, fragmentShaderSource)
		curContext.compileShader(fragmentShaderObject)
		if (!curContext.getShaderParameter(fragmentShaderObject, curContext.COMPILE_STATUS)) {
			throw curContext.getShaderInfoLog(fragmentShaderObject)
		}

		let programObject = curContext.createProgram()
		curContext.attachShader(programObject, vertexShaderObject)
		curContext.attachShader(programObject, fragmentShaderObject)
		curContext.linkProgram(programObject)
		if (!curContext.getProgramParameter(programObject, curContext.LINK_STATUS)) {
			throw "Error linking shaders."
		}

		return programObject
	}

	let program3D, program2D

	function objectify(x, y, z, width, height, textureX, textureY) {
		return {
			x: x,
			y: y,
			z: z,
			w: width,
			h: height,
			tx: textureX,
			ty: textureY
		}
	}
	let shapes = {
		/*
			[
				[(-x, -z), (+x, -z), (+x, +z), (-x, +z)], // minX = 0,  minZ = 2,  maxX = 6, maxZ = 8
				[(-x, +z), (+x, +z), (+x, -z), (-x, -z)], // minX = 9,  minZ = 10, maxX = 3, maxZ = 4
				[(+x, +y), (-x, +y), (-x, -y), (+x, -y)], // minX = 6,  minY = 7,  maxX = 0, maxY = 1
				[(-x, +y), (+x, +y), (+x, -y), (-x, -y)], // minX = 9,  minY = 10, maxX = 3, maxY = 4
				[(+y, -z), (+y, +z), (-y, +z), (-y, -z)], // minY = 10, minZ = 11, maxY = 4, maxZ = 5
				[(+y, +z), (+y, -z), (-y, -z), (-y, +z)]  // minY = 7,  minZ = 8,  maxY = 1, maxZ = 2
			]
			*/
		cube: {
			verts: [
				// x, y, z, width, height, textureX, textureY
				// 0, 0, 0 is the corner on the top left of the texture
				[objectify( 0,  0,  0, 16, 16, 0, 0)], //bottom
				[objectify( 0, 16, 16, 16, 16, 0, 0)], //top
				[objectify(16, 16, 16, 16, 16, 0, 0)], //north
				[objectify( 0, 16,  0, 16, 16, 0, 0)], //south
				[objectify(16, 16,  0, 16, 16, 0, 0)], //east
				[objectify( 0, 16, 16, 16, 16, 0, 0)]  //west
			],
			cull: {
				top: 3,
				bottom: 3,
				north: 3,
				south: 3,
				east: 3,
				west: 3
			},
			texVerts: [],
			varients: [],
			buffer: null,
			size: 6
		},
		slab: {
			verts: [
				[objectify( 0, 0,  0, 16, 16, 0, 0)], //bottom
				[objectify( 0, 8, 16, 16, 16, 0, 0)], //top
				[objectify(16, 8, 16, 16, 8, 0, 0)], //north
				[objectify( 0, 8,  0, 16, 8, 0, 0)], //south
				[objectify(16, 8,  0, 16, 8, 0, 0)], //east
				[objectify( 0, 8, 16, 16, 8, 0, 0)]  //west
			],
			cull: {
				top: 0,
				bottom: 3,
				north: 1,
				south: 1,
				east: 1,
				west: 1
			},
			texVerts: [],
			buffer: null,
			size: 6,
			varients: [],
			flip: true,
			rotate: false
		},
		stair: {
			verts: [
				[objectify( 0, 0,  0, 16, 16, 0, 0)], //bottom
				[objectify( 0, 8,  8, 16, 8, 0, 8), objectify( 0, 16,  16, 16, 8, 0, 0)], //top
				[objectify(16, 16, 16, 16, 16, 0, 0)], //north
				[objectify( 0, 8,  0, 16, 8, 0, 0), objectify( 0, 16,  8, 16, 8, 0, 0)], //south
				[objectify(16, 8, 0, 8, 8, 8, 0), objectify(16, 16, 8, 8, 16, 0, 0)], //east
				[objectify( 0, 8, 8, 8, 8, 0, 0), objectify( 0, 16, 16, 8, 16, 8, 0)]  //west
			],
			cull: {
				top: 0,
				bottom: 3,
				north: 3,
				south: 0,
				east: 0,
				west: 0
			},
			texVerts: [],
			buffer: null,
			size: 10,
			varients: [],
			flip: true,
			rotate: true
		},
	}
	win.shapes = shapes

	function compareArr(arr, out) {
		let minX = 1000
		let maxX = -1000
		let minY = 1000
		let maxY = -1000
		let minZ = 1000
		let maxZ = -1000
		let min = Math.min
		let max = Math.max
		let num = 0
		for (let i = 0; i < arr.length; i += 3) {
			num = arr[i]
			minX = minX > num ? num : minX
			maxX = maxX < num ? num : maxX
			num = arr[i + 1]
			minY = minY > num ? num : minY
			maxY = maxY < num ? num : maxY
			num = arr[i + 2]
			minZ = minZ > num ? num : minZ
			maxZ = maxZ < num ? num : maxZ
		}
		out[0] = minX
		out[1] = minY
		out[2] = minZ
		out[3] = maxX
		out[4] = maxY
		out[5] = maxZ
		return out
	}

	function initShapes() {
		function mapCoords(rect, face) {
			let x = rect.x
			let y = rect.y
			let z = rect.z
			let w = rect.w
			let h = rect.h
			let tx = rect.tx
			let ty = rect.ty
			let tex = [tx+w,ty, tx,ty, tx,ty+h, tx+w,ty+h]
			let pos = null
			switch(face) {
				case 0: // Bottom
					pos = [x,y,z, x+w,y,z, x+w,y,z+h, x,y,z+h]
					break
				case 1: // Top
					pos = [x,y,z, x+w,y,z, x+w,y,z-h, x,y,z-h]
					break
				case 2: // North
					pos = [x,y,z, x-w,y,z, x-w,y-h,z, x,y-h,z]
					break
				case 3: // South
					pos = [x,y,z, x+w,y,z, x+w,y-h,z, x,y-h,z]
					break
				case 4: // East
					pos = [x,y,z, x,y,z+w, x,y-h,z+w, x,y-h,z]
					break
				case 5: // West
					pos = [x,y,z, x,y,z-w, x,y-h,z-w, x,y-h,z]
					break
			}
			pos = pos.map(c => c / 16 - 0.5)
			let minmax = compareArr(pos, [])
			pos.max = minmax.splice(3, 3)
			pos.min = minmax
			tex = tex.map(c => c / 16 / 16)
			
			return {
				pos: pos,
				tex: tex
			}
		}
		
		// 90 degree clockwise rotation; returns a new shape object
		function rotate(shape) {
			let verts = shape.verts
			let texVerts = shape.texVerts
			let cull = shape.cull
			let pos = []
			tex = []
			for (let i = 0; i < verts.length; i++) {
				let side = verts[i]
				pos[i] = []
				tex[i] = []
				for (let j = 0; j < side.length; j++) {
					let face = side[j]
					let c = []
					pos[i][j] = c
					for (let k = 0; k < face.length; k += 3) {
						c[k] = face[k + 2]
						c[k + 1] = face[k + 1]
						c[k + 2] = -face[k]
					}
					
					tex[i][j] = texVerts[i][j].slice() // Copy texture verts exactly
					if (i === 0) {
						// Bottom
						c.push(...c.splice(0, 3))
						tex[i][j].push(...tex[i][j].splice(0, 2))
					}
					if (i === 1) {
						// Top
						c.unshift(...c.splice(-3, 3))
						tex[i][j].unshift(...tex[i][j].splice(-2, 2))
					}

					let minmax = compareArr(c, [])
					c.max = minmax.splice(3, 3)
					c.min = minmax
				}
			}
			let temp = tex[2] // North
			tex[2] = tex[5] // North = West
			tex[5] = tex[3] // West = South
			tex[3] = tex[4] // South = East
			tex[4] = temp // East = North

			temp = pos[2] // North
			pos[2] = pos[5] // North = West
			pos[5] = pos[3] // West = South
			pos[3] = pos[4] // South = East
			pos[4] = temp // East = North

			let cull2 = {
				top: cull.top,
				bottom: cull.bottom,
				north: cull.west,
				west: cull.south,
				south: cull.east,
				east: cull.north
			}

			let buffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos.flat(2)), gl.STATIC_DRAW)

			return {
				verts: pos,
				texVerts: tex,
				cull: cull2,
				rotate: true,
				flip: shape.flip,
				buffer: buffer,
				size: shape.size,
				varients: shape.varients
			}
		}

		// Reflect over the y plane; returns a new shape object
		function flip(shape) {
			let verts = shape.verts
			let texVerts = shape.texVerts
			let cull = shape.cull
			let pos = []
			tex = []
			for (let i = 0; i < verts.length; i++) {
				let side = verts[i]
				pos[i] = []
				tex[i] = []
				for (let j = 0; j < side.length; j++) {
					let face = side[j].slice().reverse()
					let c = []
					pos[i][j] = c
					for (let k = 0; k < face.length; k += 3) {
						c[k] = face[k + 2]
						c[k + 1] = -face[k + 1]
						c[k + 2] = face[k]
					}
					let minmax = compareArr(c, [])
					c.max = minmax.splice(3, 3)
					c.min = minmax

					tex[i][j] = texVerts[i][j].slice() // Copy texture verts exactly
				}
			}
			let temp = pos[0] // Bottom
			pos[0] = pos[1] // Bottom = Top
			pos[1] = temp // Top = Bottom

			temp = tex[0] // Bottom
			tex[0] = tex[1] // Bottom = Top
			tex[1] = temp // Top = Bottom

			let cull2 = {
				top: cull.bottom,
				bottom: cull.top,
				north: (cull.north & 1) << 1 | (cull.north & 2) >> 1,
				west: (cull.west & 1) << 1 | (cull.west & 2) >> 1,
				south: (cull.south & 1) << 1 | (cull.south & 2) >> 1,
				east: (cull.east & 1) << 1 | (cull.east & 2) >> 1
			}

			let buffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos.flat(2)), gl.STATIC_DRAW)

			return {
				verts: pos,
				texVerts: tex,
				cull: cull2,
				rotate: shape.rotate,
				flip: shape.flip,
				buffer: buffer,
				size: shape.size,
				varients: shape.varients
			}
		}

		for (let shape in shapes) {
			let obj = shapes[shape]
			let verts = obj.verts
			
			// Populate the vertex coordinates
			for (let i = 0; i < verts.length; i++) {
				let side = verts[i]
				let texArr = []
				obj.texVerts.push(texArr)
				for (let j = 0; j < side.length; j++) {
					let face = side[j]
					let mapped = mapCoords(face, i)
					side[j] = mapped.pos
					texArr.push(mapped.tex)
				}
			}

			if (obj.rotate) {
				let v = obj.varients
				let east = rotate(obj)
				let south = rotate(east)
				let west = rotate(south)
				v[0] = obj
				v[2] = south
				v[4] = east
				v[6] = west
			}
			if (obj.flip) {
				let v = obj.varients
				v[1] = flip(obj)
				if (obj.rotate) {
					v[3] = flip(v[2])
					v[5] = flip(v[4])
					v[7] = flip(v[6])
				}
			}

			obj.buffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts.flat(2)), gl.STATIC_DRAW)
		}

		for (let i = 0; i < BLOCK_COUNT; i++) {
			let baseBlock = blockData[i]
			let slabBlock = Object.create(baseBlock)
			let stairBlock = Object.create(baseBlock)
			slabBlock.shape = shapes.slab
			baseBlock.shape = shapes.cube
			stairBlock.shape = shapes.stair
			blockData[i | SLAB] = slabBlock
			blockData[i | STAIR] = stairBlock
			let v = slabBlock.shape.varients
			for (let j = 0; j < v.length; j++) {
				if (v[j]) {
					let block = Object.create(baseBlock)
					block.shape = v[j]
					blockData[i | SLAB | j << 10] = block
				}
			}
			v = stairBlock.shape.varients
			for (let j = 0; j < v.length; j++) {
				if (v[j]) {
					let block = Object.create(baseBlock)
					block.shape = v[j]
					blockData[i | STAIR | j << 10] = block
				}
			}
		}
	}
	let indexOrder;
	(function() {
		let arr = []
		for (let i = 0; i < 100000; i++) {
			arr.push(0 + i * 4, 1 + i * 4, 2 + i * 4, 0 + i * 4, 2 + i * 4, 3 + i * 4)
		}
		indexOrder = new Uint32Array(arr)
	})()

	let hexagonVerts
	let slabIconVerts
	let stairIconVerts
	let blockIcons
	{
		let side = Math.sqrt(3) / 2
		let s = side
		let q = s / 2
		hexagonVerts = new Float32Array([
			0, 1, 1, side, 0.5, 1, 0, 0, 1, -side, 0.5, 1,
			0, 0, 1, side, 0.5, 1, side, -0.5, 1, 0, -1, 1,
			-side, 0.5, 1, 0, 0, 1, 0, -1, 1, -side, -0.5, 1,
		])

		slabIconVerts = new Float32Array([
			0, 0.5, 1, side, 0, 1, 0, -0.5, 1, -side, 0, 1,
			0, -0.5, 1, side, 0, 1, side, -0.5, 1, 0, -1, 1,
			-side, 0, 1, 0, -0.5, 1, 0, -1, 1, -side, -0.5, 1,
		])

		stairIconVerts = [
			-s,0.5,0,0,1,         0,1,1,0,1,         q,0.75,1,0.5,1,    -q,0.25,0,0.5,1,    // top of the top step
			-q,-0.25,0,0,1,       q,0.25,1,0,1,      s,0,1,0.5,1,        0,-0.5,0,0.5,1,    // top of the bottom step
			-q,0.25,0,0,0.6,      q,0.75,1,0,0.6,    q,0.25,1,0.5,0.6,  -q,-0.25,0,0.5,0.6, // front of the top step
			0,-0.5,0,0,0.6,       s,0,1,0,0.6,       s,-0.5,1,0.5,0.6,   0,-1,0,0.5,0.6,    // front of the bottom step
			-s,0.5,0,0,0.8,      -q,0.25,0.5,0,0.8, -q,-0.75,0.5,1,0.8, -s,-0.5,0,1,0.8,    // side of the top step
			-q,-0.25,0.5,0.5,0.8, 0,-0.5,1,0.5,0.8,  0,-1,1,1,0.8,      -q,-0.75,0.5,1,0.8, // side of the bottom step
		]
	}
	function genIcons() {
		blockIcons = [null]
		blockIcons.lengths = []
		let texOrder = [ 1, 2, 3 ]
		let shadows = [ 1, 0.4, 0.7 ]
		let scale = 0.16 / height * inventory.size
		for (let i = 1; i < BLOCK_COUNT; i++) {
			let data = []
			let block = blockData[i]
			for (let j = 11; j >= 0; j--) {
				data.push(-hexagonVerts[j * 3 + 0] * scale)
				data.push(hexagonVerts[j * 3 + 1] * scale)
				data.push(0.1666666)
				data.push(textureCoords[textureMap[block.textures[texOrder[Math.floor(j / 4)]]]][(j * 2 + 0) % 8])
				data.push(textureCoords[textureMap[block.textures[texOrder[Math.floor(j / 4)]]]][(j * 2 + 1) % 8])
				data.push(shadows[Math.floor(j / 4)])
			}
			let buffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
			blockIcons[i] = buffer
			blockIcons.lengths[i] = 6 * 3

			data = []
			for (let j = 11; j >= 0; j--) {
				let tex = textureCoords[textureMap[block.textures[texOrder[Math.floor(j / 4)]]]]

				data.push(-slabIconVerts[j * 3 + 0] * scale)
				data.push(slabIconVerts[j * 3 + 1] * scale)
				data.push(0.1666666)
				data.push(tex[(j * 2 + 0) % 8])
				data.push(tex[(j * 2 + 1) % 8])
				data.push(shadows[Math.floor(j / 4)])
			}
			buffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
			blockIcons[i | SLAB] = buffer
			blockIcons.lengths[i | SLAB] = 6 * 3

			data = []
			let v = stairIconVerts
			for (let j = 23; j >= 0; j--) {
				let num = Math.floor(j / 8)
				let tex = textureCoords[textureMap[block.textures[texOrder[num]]]]
				let tx = tex[0]
				let ty = tex[1]
				data.push(-v[j * 5 + 0] * scale)
				data.push(v[j * 5 + 1] * scale)
				data.push(0.1666666)
				data.push(tx + v[j * 5 + 2] / 16)
				data.push(ty + v[j * 5 + 3] / 16)
				data.push(shadows[num])
			}
			buffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
			blockIcons[i | STAIR] = buffer
			blockIcons.lengths[i | STAIR] = 6 * 6
		}
	}

	function uniformMatrix(cacheId, programObj, vrName, transpose, matrix) {
		let vrLocation = glCache[cacheId]
		if(vrLocation === undefined) {
			vrLocation = gl.getUniformLocation(programObj, vrName)
			glCache[cacheId] = vrLocation
		}
		gl.uniformMatrix4fv(vrLocation, transpose, matrix)
	}
	function vertexAttribPointer(cacheId, programObj, vrName, size, VBO) {
		let vrLocation = glCache[cacheId]
		if(vrLocation === undefined) {
			vrLocation = gl.getAttribLocation(programObj, vrName)
			glCache[cacheId] = vrLocation
		}
		if (vrLocation !== -1) {
			gl.enableVertexAttribArray(vrLocation)
			gl.bindBuffer(gl.ARRAY_BUFFER, VBO)
			gl.vertexAttribPointer(vrLocation, size, gl.FLOAT, false, 0, 0)

		}
	}

	//Generate buffers for every block face and store them
	let sideEdgeBuffers
	let indexBuffer

	function cross(v1, v2, result) {
		let x = v1.x,
			y = v1.y,
			z = v1.z,
			x2 = v2.x,
			y2 = v2.y,
			z2 = v2.z
		result.x = y * z2 - y2 * z
		result.y = z * x2 - z2 * x
		result.z = x * y2 - x2 * y
	}

	let matrix = new Float32Array(16); // A temperary matrix that may store random data.
	let projection = new Float32Array(16)
	let defaultModelView = new Float32Array([ -10,0,0,0,0,10,0,0,0,0,-10,0,0,0,0,1 ])
	class Matrix {
		constructor(arr) {
			this.elements = new Float32Array(arr || 16)
		}
		translate(x, y, z) {
			let a = this.elements
			a[3] += a[0] * x + a[1] * y + a[2] * z
			a[7] += a[4] * x + a[5] * y + a[6] * z
			a[11] += a[8] * x + a[9] * y + a[10] * z
			a[15] += a[12] * x + a[13] * y + a[14] * z
		}
		rotX(angle) {
			let elems = this.elements
			let c = Math.cos(angle)
			let s = Math.sin(angle)
			let t = elems[1]
			elems[1] = t * c + elems[2] * s
			elems[2] = t * -s + elems[2] * c
			t = elems[5]
			elems[5] = t * c + elems[6] * s
			elems[6] = t * -s + elems[6] * c
			t = elems[9]
			elems[9] = t * c + elems[10] * s
			elems[10] = t * -s + elems[10] * c
			t = elems[13]
			elems[13] = t * c + elems[14] * s
			elems[14] = t * -s + elems[14] * c
		}
		rotY(angle) {
			let c = Math.cos(angle)
			let s = Math.sin(angle)
			let elems = this.elements
			let t = elems[0]
			elems[0] = t * c + elems[2] * -s
			elems[2] = t * s + elems[2] * c
			t = elems[4]
			elems[4] = t * c + elems[6] * -s
			elems[6] = t * s + elems[6] * c
			t = elems[8]
			elems[8] = t * c + elems[10] * -s
			elems[10] = t * s + elems[10] * c
			t = elems[12]
			elems[12] = t * c + elems[14] * -s
			elems[14] = t * s + elems[14] * c
		}
		transpose() {
			let matrix = this.elements
			let temp = matrix[4]
			matrix[4] = matrix[1]
			matrix[1] = temp

			temp = matrix[8]
			matrix[8] = matrix[2]
			matrix[2] = temp

			temp = matrix[6]
			matrix[6] = matrix[9]
			matrix[9] = temp

			temp = matrix[3]
			matrix[3] = matrix[12]
			matrix[12] = temp

			temp = matrix[7]
			matrix[7] = matrix[13]
			matrix[13] = temp

			temp = matrix[11]
			matrix[11] = matrix[14]
			matrix[14] = temp
		}
		copyArray(from) {
			let to = this.elements
			for (let i = 0; i < from.length; i++) {
				to[i] = from[i]
			}
		}
		copyMatrix(from) {
			let to = this.elements
			from = from.elements
			for (let i = 0; i < from.length; i++) {
				to[i] = from[i]
			}
		}
	}

	class Plane {
		constructor(nx, ny, nz) {
			this.set(nx, ny, nz)
		}
		set(nx, ny, nz) {
			// Pre-computed chunk offsets to reduce branching during culling
			this.dx = nx > 0 ? 16 : 0
			this.dy = ny > 0
			this.dz = nz > 0 ? 16 : 0

			// Normal vector for the plane
			this.nx = nx
			this.ny = ny
			this.nz = nz
		}
	}

