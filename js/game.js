	function initPlayer() {
		p = new Camera()
		p.speed = 0.075
		p.velocity = new PVector(0, 0, 0)
		p.pos = new Float32Array(3)
		p.sprintSpeed = 1.5
		p.flySpeed = 2.5
		p.x = 8
		p.y = superflat ? 6 : (Math.round(noise(8 * generator.smooth, 8 * generator.smooth) * generator.height) + 2 + generator.extra)
		p.z = 8
		p.previousX = 8
		p.previousY = 70
		p.previousZ = 8
		p.w = 3 / 8
		p.bottomH = 1.62
		p.topH = 0.18
		p.onGround = false
		p.jumpSpeed = 0.3
		p.sprinting = false
		p.maxYVelocity = 1.5
		p.gravityStength = -0.032
		p.lastUpdate = win.performance.now()
		p.lastBreak = Date.now()
		p.lastPlace = Date.now()
		p.lastJump = Date.now()
		p.autoBreak = false
		p.flying = false
		p.sneaking = false
		p.spectator = false
		
		win.player = p
		win.p2 = p2
	}
	function initWorldsMenu() {
		while (window.worlds.firstChild) {
			window.worlds.removeChild(window.worlds.firstChild)
		}
		selectedWorld = 0
		window.boxCenterTop.value = ""

		const deselect = () => {
			let elem = document.getElementsByClassName("selected")
			if (elem && elem[0]) {
				elem[0].classList.remove("selected")
			}
		}

		function addWorld(name, version, size, id, edited) {
			let div = doc.createElement("div")
			div.className = "world"
			div.onclick = e => {
				deselect()
				div.classList.add("selected")
				selectedWorld = id
			}
			let br = "<br>"
			div.id = id
			div.innerHTML = "<strong>" + name + "</strong>" + br
			
			if (edited){
				let str = (new Date(edited).toLocaleDateString(undefined, {
					year: "numeric",
					month: "short",
					day: "numeric",
					hour: "numeric",
					minute: "2-digit"
				}))
				div.innerHTML += str + br
			}
			div.innerHTML += version + br
			div.innerHTML += `${size.toLocaleString()} bytes used`
			
			window.worlds.appendChild(div)
		}

		worlds = {}
		if (loadString) {
			try {
				let tempWorld = new World()
				tempWorld.loadSave(loadString)
				let now = Date.now()
				addWorld(`${tempWorld.name} (Pre-loaded)`, tempWorld.version, loadString.length, now)
				worlds[now] = {
					code: loadString,
					id: now
				}
			}
			catch(e) {
				console.log("Unable to load hardcoded save.")
				console.error(e)
			}
		}
		loadFromDB().then(res => {
			if(res && res.length) {
				let index = res.findIndex(obj => obj.id === "settings")
				if (index >= 0) {
					Object.assign(settings, res[index].data) // Stored data overrides any hardcoded settings
					p.FOV(settings.fov)
					res.splice(index, 1)
				}
			}
			
			if (res && res.length) {
				res = res.map(d => d.data).filter(d => d && d.code).sort((a, b) => b.edited - a.edited)
				for (let data of res) {
					addWorld(data.name, data.version, (data.code.length + 60), data.id, data.edited)
					worlds[data.id] = data
				}
			}
			window.worlds.onclick = Button.draw
			window.boxCenterTop.onkeyup = Button.draw
		}).catch(e => console.error(e))

		superflat = false
		trees = true
		caves = true
	}
	
	function initEverything() {
		console.log("Initializing world.")

		worldSeed = Math.random() * 2000000000 | 0
		seedHash(worldSeed)
		caveNoise = openSimplexNoise(worldSeed)
		noiseSeed(worldSeed)

		generatedChunks = 0

		initPlayer()
		initWebgl()

		if (win.location.origin === "https://www.kasandbox.org" && (loadString || MineKhan.toString().length !== 183240)) {
			// Prevent Ctrl F
			message.innerHTML = '.oot lanigiro eht tuo kcehc ot>rb<erus eb ,siht ekil uoy fI>rb<.dralliW yb >a/<nahKeniM>"wen_"=tegrat "8676731005517465/cm/sc/gro.ymedacanahk.www//:sptth"=ferh a< fo>rb<ffo-nips a si margorp sihT'.split("").reverse().join("")
		}

		initBackgrounds()
		
		drawScreens[screen]()
		Button.draw()
		Slider.draw()

		p.FOV(settings.fov)
		initWorldsMenu()
		initButtons()
	}

	// Define all the scene draw functions
	(function() {
		function title() {
			let title = "JSCRAFT"
			let subtext = "MINECRAFT IN JAVASCRIPT"
			let font = "Poppins"
			strokeWeight(1)
			ctx.textAlign = 'center'

			ctx.font = "bold 120px " + font
			fill(30)
			text(title, width / 2, 158)
			fill(40)
			text(title, width / 2, 155)
			ctx.font = "bold 121px " + font
			fill(50)
			text(title, width / 2, 152)
			fill(70)
			text(title, width / 2, 150)
			fill(90)
			ctx.font = "bold 122px " + font
			text(title, width / 2, 148)
			fill(110)
			text(title, width / 2, 145)

			ctx.font = "bold 32px " + font
			fill(50)
			text(subtext, width / 2-1, 180)
			text(subtext, width / 2+1, 180)
			text(subtext, width / 2, 179)
			text(subtext, width / 2, 181)
			ctx.font = "bold 32px " + font
			fill(150)
			text(subtext, width / 2, 180)
		}
		const clear = () => ctx.clearRect(0, 0, canvas.width, canvas.height)
		const dirt = () => ctx.putImageData(dirtbg, 0, 0)

		drawScreens["main menu"] = () => {
			ctx.putImageData(mainbg, 0, 0)
			title()
			fill(220)
			ctx.font = "20px Poppins"
			ctx.textAlign = 'left'
			text("JSCraft " + version, width - (width - 2), height - 2)
		}

		drawScreens.play = () => {
			controls()
			runGravity()
			resolveContactsAndUpdatePosition()

			if (updateHUD) {
				clear()
				gl.clearColor(0, 0, 0, 0)
				gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
				hud()
				ctx.drawImage(gl.canvas, 0, 0)
				updateHUD = false
				freezeFrame = false

				gl.clearColor(sky[0], sky[1], sky[2], 1.0)
			}
			defineWorld()
		}

		drawScreens.loading = () => {
			// This is really stupid, but it basically works by teleporting the player around to each chunk I'd like to load.
			// If chunks loaded from a save aren't generated, they're deleted from the save, so this loads them all.

			let sub = maxLoad - world.loadFrom.length - 9
			let standing = true
			if (world.loadFrom.length) {
				let load = world.loadFrom[0]
				p.x = load.x * 16
				p.y = load.y * 16
				p.z = load.z * 16
				standing = false
			} else {
				p.x = p2.x
				p.y = p2.y
				p.z = p2.z

				let cx = p.x >> 4
				let cz = p.z >> 4

				for (let x = cx - 1; x <= cx + 1; x++) {
					for (let z = cz - 1; z <= cz + 1; z++) {
						if (!world.chunks[x] || !world.chunks[x][z] || !world.chunks[x][z].buffer) {
							standing = false
						} else {
							sub++
						}
					}
				}
			}

			if (standing) {
				play()
				return
			}

			world.tick()

			let progress = Math.round(100 * sub / maxLoad)
			dirt()
			fill(255)
			textSize(30)
			ctx.textAlign = "center"
			text(`Loading... ${progress}% complete (${sub} / ${maxLoad})`, width / 2, height / 2)
		}

		drawScreens.inventory = drawInv

		drawScreens.pause = () => {
			strokeWeight(1)
			clear()
			ctx.drawImage(gl.canvas, 0, 0)

			textSize(60)
			fill(0, 0, 0)
			ctx.textAlign = 'center'
			text("Paused", width / 2, 60)
		}

		drawScreens.options = () => {
			clear()
		}
		drawScreens["creation menu"] = () => {
			dirt()
			ctx.textAlign = 'center'
			textSize(20)
			fill(255)
			text("Create New World", width / 2, 20)
		}
		drawScreens["loadsave menu"] = () => {
			dirt()
			ctx.textAlign = 'center'
			textSize(20)
			fill(255)
			text("Select World", width / 2, 20)
		}
		drawScreens.editworld = dirt
	})()

	// Give the font time to load and redraw the homescreen
	setTimeout(e => {
		drawScreens[screen]()
		Button.draw()
		Slider.draw()
	}, 100)

	let debugMenu = false
	function gameLoop() {
		let frameStart = win.performance.now()
		if (!gl) {
			initEverything()
			releasePointer()
		}

		if (screen === "play" || screen === "loading") {
			drawScreens[screen]()
		}

		if (Date.now() - analytics.lastUpdate > 500 && analytics.frames) {
			analytics.displayedTickTime = (analytics.totalTickTime / analytics.frames).toFixed(1)
			analytics.displayedRenderTime = (analytics.totalRenderTime / analytics.frames).toFixed(1)
			analytics.displayedFrameTime = (analytics.totalFrameTime / analytics.frames).toFixed(1)
			analytics.fps = Math.round(analytics.frames * 1000 / (Date.now() - analytics.lastUpdate))
			analytics.displayedwFrameTime = analytics.worstFrameTime.toFixed(1)
			analytics.frames = 0
			analytics.totalRenderTime = 0
			analytics.totalTickTime = 0
			analytics.totalFrameTime = 0
			analytics.worstFrameTime = 0
			analytics.lastUpdate = Date.now()
			updateHUD = true
		}

		analytics.frames++
		analytics.totalFrameTime += win.performance.now() - frameStart
		analytics.worstFrameTime = Math.max(win.performance.now() - frameStart, analytics.worstFrameTime)
		win.raf = requestAnimationFrame(gameLoop)
	}
	return gameLoop
}
