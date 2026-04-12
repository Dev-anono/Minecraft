	let win = window.parent
	let doc = document
	let console = win.console
	let world

	let seedHash
	let hash = (function() {
		let seed = Math.random() * 2100000000 | 0
		let PRIME32_2 = 1883677709
		let PRIME32_3 = 2034071983
		let PRIME32_4 = 668265263
		let PRIME32_5 = 374761393

		seedHash = function(s) {
			seed = s | 0
		}

		return function(x, y) {
			let h32 = 0

			h32 = seed + PRIME32_5 | 0
			h32 += 8

			h32 += Math.imul(x, PRIME32_3)
			h32 = Math.imul(h32 << 17 | h32 >> 32 - 17, PRIME32_4)
			h32 += Math.imul(y, PRIME32_3)
			h32 = Math.imul(h32 << 17 | h32 >> 32 - 17, PRIME32_4)

			h32 ^= h32 >> 15
			h32 *= PRIME32_2
			h32 ^= h32 >> 13
			h32 *= PRIME32_3
			h32 ^= h32 >> 16

			return h32 / 2147483647
		}
	})()
	let worldSeed

	//The noise and random functions are copied from the processing.js source code; these others are polyfills made by me to avoid needing to remove all the pjs draw calls
	let currentRandom = null
	function Marsaglia(i1, i2) {
	// from http://www.math.uni-bielefeld.de/~sillke/ALGORITHMS/random/marsaglia-c
		let z = (i1 | 0) || 362436069, w = i2 || hash(521288629, z) * 2147483647 | 0

		let nextInt = function() {
			z=36969*(z&65535)+(z>>>16) & 0xFFFFFFFF
			w=18000*(w&65535)+(w>>>16) & 0xFFFFFFFF
			return ((z&0xFFFF)<<16 | w&0xFFFF) & 0xFFFFFFFF
		}

		this.nextDouble = function() {
			let i = nextInt() / 4294967296
			return i < 0 ? 1 + i : i
		}
		this.nextInt = nextInt
	}
	let randomSeed = function(seed) {
		currentRandom = (new Marsaglia(seed)).nextDouble
	}
	let random = function(min, max) {
		if (!max) {
			if (min) {
				max = min
				min = 0
			} else {
				min = 0
				max = 1
			}
		}
		return currentRandom() * (max - min) + min
	}
	let noiseProfile = { generator: undefined, octaves: 4, fallout: 0.5, seed: undefined }
	function PerlinNoise(seed) {
		let rnd = seed !== undefined ? new Marsaglia(seed) : Marsaglia.createRandomized()
		let i, j
		// http://www.noisemachine.com/talk1/17b.html
		// http://mrl.nyu.edu/~perlin/noise/
		// generate permutation
		let perm = new Uint8Array(512)
		for(i=0;i<256;++i) {
			perm[i] = i
		}
		for(i=0;i<256;++i) {
			let t = perm[j = rnd.nextInt() & 0xFF]; perm[j] = perm[i]; perm[i] = t
		}
		// copy to avoid taking mod in perm[0]
		for(i=0;i<256;++i) {
			perm[i + 256] = perm[i]
		}

		function grad3d(i,x,y,z) {
			let h = i & 15; // convert into 12 gradient directions
			let u = h<8 ? x : y,
				v = h<4 ? y : h===12||h===14 ? x : z
			return ((h&1) === 0 ? u : -u) + ((h&2) === 0 ? v : -v)
		}

		function grad2d(i,x,y) {
			let v = (i & 1) === 0 ? x : y
			return (i&2) === 0 ? -v : v
		}

		function grad1d(i,x) {
			return (i&1) === 0 ? -x : x
		}

		function lerp(t,a,b) {
			return a + t * (b - a)
		}

		this.noise3d = function(x, y, z) {
			let X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255
			x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z)
			let fx = (3-2*x)*x*x, fy = (3-2*y)*y*y, fz = (3-2*z)*z*z
			let p0 = perm[X]+Y, p00 = perm[p0] + Z, p01 = perm[p0 + 1] + Z,
				p1 = perm[X + 1] + Y, p10 = perm[p1] + Z, p11 = perm[p1 + 1] + Z
			return lerp(fz,
				lerp(fy, lerp(fx, grad3d(perm[p00], x, y, z), grad3d(perm[p10], x-1, y, z)),
					lerp(fx, grad3d(perm[p01], x, y-1, z), grad3d(perm[p11], x-1, y-1,z))),
				lerp(fy, lerp(fx, grad3d(perm[p00 + 1], x, y, z-1), grad3d(perm[p10 + 1], x-1, y, z-1)),
					lerp(fx, grad3d(perm[p01 + 1], x, y-1, z-1), grad3d(perm[p11 + 1], x-1, y-1,z-1))))
		}

		this.noise2d = function(x, y) {
			let X = Math.floor(x)&255, Y = Math.floor(y)&255
			x -= Math.floor(x); y -= Math.floor(y)
			let fx = (3-2*x)*x*x, fy = (3-2*y)*y*y
			let p0 = perm[X]+Y, p1 = perm[X + 1] + Y
			return lerp(fy,
				lerp(fx, grad2d(perm[p0], x, y), grad2d(perm[p1], x-1, y)),
				lerp(fx, grad2d(perm[p0 + 1], x, y-1), grad2d(perm[p1 + 1], x-1, y-1)))
		}

		this.noise1d = function(x) {
			let X = Math.floor(x)&255
			x -= Math.floor(x)
			let fx = (3-2*x)*x*x
			return lerp(fx, grad1d(perm[X], x), grad1d(perm[X+1], x-1))
		}
	}
	let noiseSeed = function(seed) {
		noiseProfile.seed = seed
		noiseProfile.generator = new PerlinNoise(noiseProfile.seed)
	}
	let noise = function(x, y, z) {
		let generator = noiseProfile.generator
		let effect = 1, k = 1, sum = 0
		for(let i = 0; i < noiseProfile.octaves; ++i) {
			effect *= noiseProfile.fallout
			switch (arguments.length) {
				case 1:
					sum += effect * (1 + generator.noise1d(k*x))/2; break
				case 2:
					sum += effect * (1 + generator.noise2d(k*x, k*y))/2; break
				case 3:
					sum += effect * (1 + generator.noise3d(k*x, k*y, k*z))/2; break
			}
			k *= 2
		}
		return sum
	}

	let caveNoise
	// Copied and modified from https://github.com/blindman67/SimplexNoiseJS
	function openSimplexNoise(clientSeed) {
		const SQ4 = 2
		const toNums = function(s) { return s.split(",").map(function(s) { return new Uint8Array(s.split("").map(function(v) { return Number(v) })) }) }
		const decode = function(m, r, s) { return new Int8Array(s.split("").map(function(v) { return parseInt(v, r) + m })) }
		const toNumsB32 = function(s) { return s.split(",").map(function(s) { return parseInt(s, 32) }) }
		const NORM_3D = 1.0 / 206.0
		const SQUISH_3D = 1 / 3
		const STRETCH_3D = -1 / 6
		var base3D = toNums("0000110010101001,2110210120113111,110010101001211021012011")
		const gradients3D = decode(-11, 23, "0ff7mf7fmmfffmfffm07f70f77mm7ff0ff7m0f77m77f0mf7fm7ff0077707770m77f07f70")
		var lookupPairs3D = function() { return new Uint16Array(toNumsB32("0,2,1,1,2,2,5,1,6,0,7,0,10,2,12,2,41,1,45,1,50,5,51,5,g6,0,g7,0,h2,4,h6,4,k5,3,k7,3,l0,5,l1,5,l2,4,l5,3,l6,4,l7,3,l8,d,l9,d,la,c,ld,e,le,c,lf,e,m8,k,ma,i,p9,l,pd,n,q8,k,q9,l,15e,j,15f,m,16a,i,16e,j,19d,n,19f,m,1a8,f,1a9,h,1aa,f,1ad,h,1ae,g,1af,g,1ag,b,1ah,a,1ai,b,1al,a,1am,9,1an,9,1bg,b,1bi,b,1eh,a,1el,a,1fg,8,1fh,8,1qm,9,1qn,9,1ri,7,1rm,7,1ul,6,1un,6,1vg,8,1vh,8,1vi,7,1vl,6,1vm,7,1vn,6")) }
		var p3D = decode(-1, 5, "112011210110211120110121102132212220132122202131222022243214231243124213241324123222113311221213131221123113311112202311112022311112220342223113342223311342223131322023113322023311320223113320223131322203311322203131")
		const setOf = function(count) { var a = [],i = 0; while (i < count) { a.push(i++) } return a }
		const doFor = function(count, cb) { var i = 0; while (i < count && cb(i++) !== true) {} }

		function shuffleSeed(seed,count){
			seed = seed * 1664525 + 1013904223 | 0
			count -= 1
			return count > 0 ? shuffleSeed(seed, count) : seed
		}
		const types = {
			_3D : {
				base : base3D,
				squish : SQUISH_3D,
				dimensions : 3,
				pD : p3D,
				lookup : lookupPairs3D,
			}
		}

		function createContribution(type, baseSet, index) {
			var i = 0
			const multiplier = baseSet[index ++]
			const c = { next : undefined }
			while(i < type.dimensions) {
				const axis = ("xyzw")[i]
				c[axis + "sb"] = baseSet[index + i]
				c["d" + axis] = - baseSet[index + i++] - multiplier * type.squish
			}
			return c
		}

		function createLookupPairs(lookupArray, contributions){
			var i
			const a = lookupArray()
			const res = new Map()
			for (i = 0; i < a.length; i += 2) { res.set(a[i], contributions[a[i + 1]]); }
			return res
		}

		function createContributionArray(type) {
			const conts = []
			const d = type.dimensions
			const baseStep = d * d
			var k, i = 0
			while (i < type.pD.length) {
				const baseSet = type.base[type.pD[i]]
				let previous, current
				k = 0
				do {
					current = createContribution(type, baseSet, k)
					if (!previous) { conts[i / baseStep] = current; }
					else { previous.next = current; }
					previous = current
					k += d + 1
				} while(k < baseSet.length)

				current.next = createContribution(type, type.pD, i + 1)
				if (d >= 3) { current.next.next = createContribution(type, type.pD, i + d + 2) }
				if (d === 4) { current.next.next.next = createContribution(type, type.pD, i + 11) }
				i += baseStep
			}
			const result = [conts, createLookupPairs(type.lookup, conts)]
			type.base = undefined
			type.lookup = undefined
			return result
		}

		let temp = createContributionArray(types._3D)
		const contributions3D = temp[0], lookup3D = temp[1]
		const perm = new Uint8Array(256)
		const perm3D = new Uint8Array(256)
		const source = new Uint8Array(setOf(256))
		var seed = shuffleSeed(clientSeed, 3)
		doFor(256, function(i) {
			i = 255 - i
			seed = shuffleSeed(seed, 1)
			var r = (seed + 31) % (i + 1)
			r += r < 0 ? i + 1 : 0
			perm[i] = source[r]
			perm3D[i] = (perm[i] % 24) * 3
			source[r] = source[i]
		})
		base3D = undefined
		lookupPairs3D = undefined
		p3D = undefined

		return function(x, y, z) {
			const pD = perm3D
			const p = perm
			const g = gradients3D
			const stretchOffset = (x + y + z) * STRETCH_3D
			const xs = x + stretchOffset, ys = y + stretchOffset, zs = z + stretchOffset
			const xsb = Math.floor(xs), ysb = Math.floor(ys), zsb = Math.floor(zs)
			const squishOffset	= (xsb + ysb + zsb) * SQUISH_3D
			const dx0 = x - (xsb + squishOffset), dy0 = y - (ysb + squishOffset), dz0 = z - (zsb + squishOffset)
			const xins = xs - xsb, yins = ys - ysb, zins = zs - zsb
			const inSum = xins + yins + zins
			var c = lookup3D.get(
				(yins - zins + 1) |
				((xins - yins + 1) << 1) |
				((xins - zins + 1) << 2) |
				(inSum << 3) |
				((inSum + zins) << 5) |
				((inSum + yins) << 7) |
				((inSum + xins) << 9)
			)
			var i, value = 0
			while (c !== undefined) {
				const dx = dx0 + c.dx, dy = dy0 + c.dy, dz = dz0 + c.dz
				let attn = 2 - dx * dx - dy * dy - dz * dz
				if (attn > 0) {
					i = pD[(((p[(xsb + c.xsb) & 0xFF] + (ysb + c.ysb)) & 0xFF) + (zsb + c.zsb)) & 0xFF]
					attn *= attn
					value += attn * attn * (g[i++] * dx + g[i++] * dy + g[i] * dz)
				}
				c = c.next
			}
			return value * NORM_3D + 0.5
		}
	}

	let PVector = function(x, y, z) {
		this.x = x
		this.y = y
		this.z = z
		this.set = function(x, y, z) {
			if (y === undefined) {
				this.x = x.x
				this.y = x.y
				this.z = x.z
			} else {
				this.x = x
				this.y = y
				this.z = z
			}
		}
		this.normalize = function() {
			let mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
			this.x /= mag
			this.y /= mag
			this.z /= mag
		}
		this.add = function(v) {
			this.x += v.x
			this.y += v.y
			this.z += v.z
		}
		this.mult = function(m) {
			this.x *= m
			this.y *= m
			this.z *= m
		}
	}
	let fill = function(r, g, b) {
		if (g === undefined) {
			g = r
			b = r
		}
		ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")"
	}
	let stroke = function(r, g, b) {
		if (g === undefined) {
			g = r
			b = r
		}
		ctx.strokeStyle = "rgb(" + r + ", " + g + ", " + b + ")"
	}
	let line = function(x1, y1, x2, y2) {
		ctx.moveTo(x1, y1)
		ctx.lineTo(x2, y2)
	}
	function text(txt, x, y, h) {
		h = h || 0

		let lines = txt.split("\n")
		for (let i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], x, y + h * i)
		}
	}
	function textSize(size) {
		ctx.font = size + 'px Poppins' // VT323
	}
	let strokeWeight = function(num) {
		ctx.lineWidth = num
	}
	const ARROW = "arrow"
	const HAND = "pointer"
	const CROSS = "crosshair"
	let cursor = function(type) {
		canvas.style.cursor = type
	}
	randomSeed(Math.random() * 10000000 | 0)

	async function createDatabase() {
		return await new Promise(async (resolve, reject) => {
			let request = window.indexedDB.open("MineKhan", 1)

			request.onupgradeneeded = function(event) {
				let DB = event.target.result
				// Worlds will contain and ID containing the timestamp at which the world was created, a "saved" timestamp,
				// and a "data" string that's identical to the copy/paste save string
				let store = DB.createObjectStore("worlds", { keyPath: "id" })
				store.createIndex("id", "id", { unique: true })
				store.createIndex("data", "data", { unique: false })
			}

			request.onsuccess = function(e) {
				resolve(request.result)
			}

			request.onerror = function(e) {
				console.error(e)
				reject(e)
			}
		})
	}
	async function loadFromDB(id) {
		return await new Promise(async (resolve, reject) => {
			let db = await createDatabase()
			let trans = db.transaction("worlds", "readwrite")
			let store = trans.objectStore("worlds")
			let req = id ? store.get(id) : store.getAll()
			req.onsuccess = function(e) {
				resolve(req.result)
				db.close()
			}
			req.onerror = function(e) { 
				resolve(null)
				db.close()
			}
		})
	}
	async function saveToDB(id, data) {
		return new Promise(async (resolve, reject) => {
			let db = await createDatabase()
			let trans = db.transaction("worlds", "readwrite")
			let store = trans.objectStore("worlds")
			let req = store.put({ id: id, data: data })
			req.onsuccess = function() {
				resolve(req.result)
			}
			req.onerror = function(e) {
				reject(e)
			}
		})
	}
	async function deleteFromDB(id) {
		return new Promise(async (resolve, reject) => {
			let db = await createDatabase()
			let trans = db.transaction("worlds", "readwrite")
			let store = trans.objectStore("worlds")
			let req = store.delete(id)
			req.onsuccess = function() {
				resolve(req.result)
			}
			req.onerror = function(e) {
				reject(e)
			}
		})
	}

	function save() {
		saveToDB(world.id, {
			id: world.id,
			edited: Date.now(),
			name: world.name,
			version: version,
			code: world.getSaveString()
		}).then(() => world.edited = Date.now()).catch(e => console.error(e))
	}

	// Expose these functions to the global scope for debugging
	win.saveToDB = saveToDB
	win.loadFromDB = loadFromDB
	win.createDatabase = createDatabase
	win.deleteFromDB = deleteFromDB

	//globals
	//{
	let version = "Alpha"
	let reach = 100 // Max distance player can place or break blocks
	let sky = [0.33, 0.54, 0.72] // 0 to 1 RGB color scale
	let superflat = false
	let trees = true
	let caves = true

	let blockIds = {}
	blockData.forEach(block => blockIds[block.name] = block.id)
	win.blockData = blockData
	win.blockIds = blockIds

	let currentFov

	// Configurable and savable settings
	let settings = {
		renderDistance: 10,
		fov: 70, // Field of view in degrees
		mouseSense: 100 // Mouse sensitivity as a percentage of the default
	}
	let locked = true
	let generatedChunks
	let mouseX, mouseY, mouseDown
	let width = window.innerWidth
	let height = window.innerHeight

	if (height === 400) alert("Canvas is too small. Click the \"Settings\" button to the left of the \"Vote Up\" button under the editor and change the height to 600.")

	let generator = {
		height: 80, // Height of the hills
		smooth: 0.01, // Smoothness of the terrain
		extra: 30, // Extra height added to the world.
		caveSize: 0.00 // Redefined right above where it's used
	}
	let maxHeight = 255
	let blockOutlines = false
	let blockFill = true
	let updateHUD = true
	const CUBE     = 0
	const SLAB     = 0x100 // 9th bit
	const STAIR    = 0x200 // 10th bit
	const FLIP     = 0x400 // 11th bit
	const NORTH    = 0 // 12th and 13th bits for the 4 directions
	const SOUTH    = 0x800
	const EAST     = 0x1000
	const WEST     = 0x1800
	const ROTATION = 0x1800 // Mask for the direction bits
	let blockMode  = CUBE
	let tex
	let textureMap
	let dirtBuffer
	let dirtTexture
	let textureCoords
	let texCoordsBuffers
	let mainbg, dirtbg // Background images
	let bigArray = win.bigArray || new Float32Array(600000)
	win.bigArray = bigArray

	// Callback functions for all the screens; will define them further down the page
	let drawScreens = {
		"main menu": () => {},
		"options": () => {},
		"play": () => {},
		"pause": () => {},
		"creation menu": () => {},
		"inventory": () => {},
		"multiplayer menu": () => {},
		"comingsoon menu": () => {},
		"loadsave menu": () => {},
	}
	let html = {
		pause: {
			enter: [window.message],
			exit: [window.savebox, window.saveDirections, window.message]
		},
		"loadsave menu": {
			enter: [window.worlds, window.boxCenterTop, window.quota],
			exit: [window.worlds, window.boxCenterTop, window.quota],
			onenter: () => {
				window.boxCenterTop.placeholder = "Enter Save String (Optional)"
				if (navigator && navigator.storage && navigator.storage.estimate) {
					navigator.storage.estimate().then(data => {
						window.quota.innerText = `${data.usage.toLocaleString()} / ${data.quota.toLocaleString()} bytes (${(100 * data.usage / data.quota).toLocaleString(undefined, { maximumSignificantDigits: 2 })}%) of your quota used`
					}).catch(console.error)
				}
				window.boxCenterTop.onmousedown = e => {
					let elem = document.getElementsByClassName("selected")
					if (elem && elem[0]) {
						elem[0].classList.remove("selected")
					}
					selectedWorld = 0
					Button.draw()
				}
			},
			onexit: () => {
				window.boxCenterTop.onmousedown = null
			}
		},
		"creation menu": {
			enter: [window.boxCenterTop],
			exit: [window.boxCenterTop],
			onenter: () => {
				window.boxCenterTop.placeholder = "Enter World Name"
				window.boxCenterTop.value = ""
			}
		},
		loading: {
			onenter: startLoad
		},
		editworld: {
			enter: [window.boxCenterTop],
			exit: [window.boxCenterTop],
			onenter: () => {
				window.boxCenterTop.placeholder = "Enter World Name"
				window.boxCenterTop.value = ""
			}
		}
	}

	let screen = "main menu"
	let previousScreen = screen
	function changeScene(newScene) {
		if (screen === "options") {
			saveToDB("settings", settings).catch(e => console.error(e))
		}

		if (html[screen] && html[screen].exit) {
			for (let element of html[screen].exit) {
				element.classList.add("hidden")
			}
		}

		if (html[newScene] && html[newScene].enter) {
			for (let element of html[newScene].enter) {
				element.classList.remove("hidden")
			}
		}

		if (html[newScene] && html[newScene].onenter) {
			html[newScene].onenter()
		}
		if (html[screen] && html[screen].onexit) {
			html[screen].onexit()
		}

		previousScreen = screen
		screen = newScene
		mouseDown = false
		drawScreens[screen]()
		Button.draw()
		Slider.draw()
	}
	let hitBox = {}
	let holding = 0
	let Key = {}
	let modelView = win.modelView || new Float32Array(16)
	win.modelView = modelView
	let glCache
	let worlds, selectedWorld = 0
	let freezeFrame = 0
	let p
	let vec1 = new PVector(), vec2 = new PVector(), vec3 = new PVector()
	let move = {
		x: 0,
		y: 0,
		z: 0,
		ang: Math.sqrt(0.5),
	}
	let p2 = {
		x: 0,
		y: 0,
		z: 0,
	}
	let place
	let inventory = {
		hotbar: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
		main: [],
		hotbarSlot: 0,
		size: 40 * Math.min(width, height) / 600,
		holding: 0,
	}
	//}

	function play() {
		canvas.onblur()
		p.lastBreak = Date.now()
		updateHUD = true
		use3d()
		gl.clearColor(sky[0], sky[1], sky[2], 1.0)
		getPointer()
		fill(255, 255, 255)
		textSize(10)
		changeScene("play")
	}

	let gl
	function getPointer() {
		if (canvas.requestPointerLock) {
			canvas.requestPointerLock()
		}
	}
	function releasePointer() {
		if (doc.exitPointerLock) {
			doc.exitPointerLock()
		}
	}
