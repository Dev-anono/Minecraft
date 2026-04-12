	class Slider {
		constructor(x, y, w, h, scenes, label, min, max, settingName, callback) {
			this.x = x
			this.y = y
			this.h = h
			this.w = Math.max(w, 350)
			this.name = settingName
			this.scenes = Array.isArray(scenes) ? scenes : [scenes]
			this.label = label
			this.min = min
			this.max = max
			this.sliding = false
			this.callback = callback
		}
		draw() {
			if (!this.scenes.includes(screen)) {
				return
			}
			let current = (settings[this.name] - this.min) / (this.max - this.min)

			// Outline
			ctx.beginPath()
			strokeWeight(2)
			stroke(0)
			fill(85)
			ctx.rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h)
			ctx.stroke()
			ctx.fill()

			// Slider bar
			let value = Math.round(settings[this.name])
			ctx.beginPath()
			fill(130)
			let x = this.x - (this.w - 10) / 2 + (this.w - 10) * current - 5
			ctx.fillRect(x, this.y - this.h / 2, 10, this.h)

			//Label
			fill(255, 255, 255)
			textSize(16)
			ctx.textAlign = 'center'
			text(`${this.label}: ${value}`, this.x, this.y + this.h / 8)
		}
		click() {
			if (!mouseDown || !this.scenes.includes(screen)) {
				return false
			}

			if (mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2 && mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2) {
				let current = (mouseX - this.x + this.w / 2) / this.w
				if (current < 0) current = 0
				if (current > 1) current = 1
				this.sliding = true
				settings[this.name] = current * (this.max - this.min) + this.min
				this.callback(current * (this.max - this.min) + this.min)
				this.draw()
			}
		}
		drag() {
			if (!this.sliding || !this.scenes.includes(screen)) {
				return false
			}

			let current = (mouseX - this.x + this.w / 2) / this.w
			if (current < 0) current = 0
			if (current > 1) current = 1
			settings[this.name] = current * (this.max - this.min) + this.min
			this.callback(current * (this.max - this.min) + this.min)
		}
		release() {
			this.sliding = false
		}

		static draw() {
			for (let slider of Slider.all) {
				slider.draw()
			}
		}
		static click() {
			for (let slider of Slider.all) {
				slider.click()
			}
		}
		static release() {
			for (let slider of Slider.all) {
				slider.release()
			}
		}
		static drag() {
			if (mouseDown) {
				for (let slider of Slider.all) {
					slider.drag()
				}
			}
		}
		static add(x, y, w, h, scenes, label, min, max, defaut, callback) {
			Slider.all.push(new Slider(x, y, w, h, scenes, label, min, max, defaut, callback))
		}
	}
	Slider.all = []
	class Button {
		constructor(x, y, w, h, labels, scenes, callback, disabled, hoverText) {
			this.x = x
			this.y = y
			this.h = h
			this.w = w
			this.index = 0
			this.disabled = disabled || (() => false)
			this.hoverText = !hoverText || typeof hoverText === "string" ? (() => hoverText) : hoverText
			this.scenes = Array.isArray(scenes) ? scenes : [scenes]
			this.labels = Array.isArray(labels) ? labels : [labels]
			this.callback = callback
		}

		mouseIsOver() {
			return mouseX >= this.x - this.w / 2 && mouseX <= this.x + this.w / 2 && mouseY >= this.y - this.h / 2 && mouseY <= this.y + this.h / 2
		}
		draw() {
			if (!this.scenes.includes(screen)) {
				return
			}
			let hovering = this.mouseIsOver()
			let disabled = this.disabled()
			let hoverText = this.hoverText()

			// Outline
			ctx.beginPath()
			if (hovering && !disabled) {
				strokeWeight(7)
				stroke(255)
				cursor(HAND)
			} else {
				strokeWeight(3)
				stroke(0)
			}
			if (disabled) {
				fill(60)
			} else {
				fill(120)
			}
			ctx.rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h)
			ctx.stroke()
			ctx.fill()

			//Label
			fill(255)
			textSize(16)
			ctx.textAlign = 'center'
			text(this.labels[this.index], this.x, this.y + this.h / 8)
			
			if (hovering && hoverText) {
				hoverbox.innerText = hoverText
				hoverbox.classList.remove("hidden")
				if (mouseY < height / 2) {
					hoverbox.style.bottom = ""
					hoverbox.style.top = mouseY + 10 + "px"
				} else {
					hoverbox.style.top = ""
					hoverbox.style.bottom = height - mouseY + 10 + "px"
				}
				if (mouseX < width / 2) {
					hoverbox.style.right = ""
					hoverbox.style.left = mouseX + 10 + "px"
				} else {
					hoverbox.style.left = ""
					hoverbox.style.right = width - mouseX + 10 + "px"
				}
			}
		}
		click() {
			if (this.disabled() || !mouseDown || !this.scenes.includes(screen)) {
				return false
			}

			if (this.mouseIsOver()) {
				this.index = (this.index + 1) % this.labels.length
				this.callback(this.labels[this.index])
				return true
			}
		}

		static draw() {
			hoverbox.classList.add("hidden")
			for (let button of Button.all) {
				button.draw()
			}
		}
		static click() {
			for (let button of Button.all) {
				if (button.click()) {
					Button.draw()
					break
				}
			}
		}
		static add(x, y, w, h, labels, scenes, callback, disabled, hoverText) {
			Button.all.push(new Button(x, y, w, h, labels, scenes, callback, disabled, hoverText))
		}
	}
	Button.all = []

	var initEverything
	function initButtons() {
		Button.all = []
		Slider.all = []
		const nothing = () => false
		const always = () => true

		// Main menu buttons
		Button.add(width / 2, height / 2 - 20, 400, 40, "Singleplayer", "main menu", r => changeScene("loadsave menu"))
		Button.add(width / 2, height / 2 + 35, 400, 40, "Multiplayer", "main menu", nothing, always, "Multiplayer isn't possible at this time.")
		Button.add(width / 2, height / 2 + 90, 400, 40, "Options", "main menu", r => changeScene("options"))

		// Creation menu buttons
		Button.add(width / 2, 135, 300, 40, ["World Type: Normal", "World Type: Superflat"], "creation menu", r => superflat = r === "World Type: Superflat")
		Button.add(width / 2, 185, 300, 40, ["Trees: On", "Trees: Off"], "creation menu", r => trees = r === "Trees: On", function() {
			if (superflat) {
				this.index = 1
				trees = false
			}
			return superflat
		})
		Button.add(width / 2, 235, 300, 40, ["Caves: On", "Caves: Off"], "creation menu", r => caves = r === "Caves: On", function() {
			if (superflat) {
				this.index = 1
				caves = false
			}
			return superflat
		})
		Button.add(width / 2, 285, 300, 40, "Game Mode: Creative", "creation menu", nothing, always, "Coming Soon\n\nPlease stop asking for survival features. I don't want to half-implement anything, and I don't currently have the systems in place to create a full-featured survival mode. It'll come in due time.")
		Button.add(width / 2, 335, 300, 40, "Difficulty: Peaceful", "creation menu", nothing, always, "Coming soon\n\nPlease stop asking for mobs. Adding them will take a very long time. I know a lot of people want them, so just be patient.")
		Button.add(width / 2, height - 90, 300, 40, "Create New World", "creation menu", r => {
			world = new World()
			world.id = Date.now()
			let name = boxCenterTop.value || "World"
			let number = ""
			while(true) {
				let match = false
				for (let id in worlds) {
					if (worlds[id].name === name + number) {
						match = true
						break
					}
				}
				if (match) {
					number = number ? number + 1 : 1
				} else {
					name = name + number
					break
				}
			}
			world.name = name.replace(/;/g, "\u037e")
			win.world = world
			world.loadChunks()
			world.chunkGenQueue.sort(sortChunks)
			changeScene("loading")
		})
		Button.add(width / 2, height - 40, 300, 40, "Cancel", "creation menu", r => changeScene(previousScreen))

		// Loadsave menu buttons
		const selected = () => !selectedWorld || !worlds[selectedWorld]
		let w4 = Math.min(width / 4 - 10, 220)
		let x4 = w4 / 2 + 5
		let w2 = Math.min(width / 2 - 10, 450)
		let x2 = w2 / 2 + 5
		let mid = width / 2
		Button.add(mid - 3 * x4, height - 30, w4, 40, "Edit", "loadsave menu", r => changeScene("editworld"), () => (selected() || !worlds[selectedWorld].edited))
		Button.add(mid - x4, height - 30, w4, 40, "Delete", "loadsave menu", r => {
			if (worlds[selectedWorld] && confirm(`Are you sure you want to delete ${worlds[selectedWorld].name}?`)) {
				deleteFromDB(selectedWorld)
				window.worlds.removeChild(document.getElementById(selectedWorld))
				delete worlds[selectedWorld]
				selectedWorld = 0
			}
		}, () => (selected() || !worlds[selectedWorld].edited), "Delete the world forever.")
		Button.add(mid + x4, height - 30, w4, 40, "Export", "loadsave menu", r => {
			boxCenterTop.value = worlds[selectedWorld].code
		}, selected, "Export the save code into the text box above for copy/paste.")
		Button.add(mid + 3 * x4, height - 30, w4, 40, "Cancel", "loadsave menu", r => changeScene("main menu"))
		Button.add(mid - x2, height - 75, w2, 40, "Play Selected World", "loadsave menu", r => {
			world = new World()
			win.world = world

			let code
			if (!selectedWorld) {
				code = boxCenterTop.value
			} else {
				let data = worlds[selectedWorld]
				if (data) {
					code = data.code
					world.id = data.id
					world.edited = data.edited
				}
			}
			
			if (code) {
				try {
					world.loadSave(code)
					world.id = world.id || Date.now()
				}
				catch(e) {
					alert("Unable to load save")
					return
				}
				changeScene("loading")
			}
		}, () => !(!selectedWorld && boxCenterTop.value) && !worlds[selectedWorld])
		Button.add(mid + x2, height - 75, w2, 40, "Create New World", "loadsave menu", r => changeScene("creation menu"))

		Button.add(mid, height / 2, w2, 40, "Save", "editworld", r => {
			let w = worlds[selectedWorld]
			w.name = boxCenterTop.value.replace(/;/g, "\u037e")
			let split = w.code.split(";")
			split[0] = w.name
			w.code = split.join(";")
			saveToDB(w.id, w).then(success => {
				initWorldsMenu()
				changeScene("loadsave menu")
			}).catch(e => console.error(e))
		})
		Button.add(mid, height / 2 + 50, w2, 40, "Back", "editworld", r => changeScene(previousScreen))

		// Pause buttons
		Button.add(width / 2, 225, 300, 40, "Resume", "pause", play)
		Button.add(width / 2, 275, 300, 40, "Options", "pause", r => changeScene("options"))
		Button.add(width / 2, 325, 300, 40, "Save", "pause", save, nothing, () => `Save the world to your computer/browser. Doesn't work in incognito.\n\nLast saved ${timeString(Date.now() - world.edited)}.`)
		Button.add(width / 2, 375, 300, 40, "Get Save Code", "pause", r => {
			savebox.classList.remove("hidden")
			saveDirections.classList.remove("hidden")
			savebox.value = world.getSaveString()
		})
		Button.add(width / 2, 425, 300, 40, "Exit Without Saving", "pause", r => {
			savebox.value = world.getSaveString()
			initWorldsMenu()
			changeScene("main menu")
		})
		
		// Options buttons
		Button.add(width / 2, 455, width / 3, 40, "Back", "options", r => changeScene(previousScreen))
		
		// Comingsoon menu buttons
		Button.add(width / 2, 395, width / 3, 40, "Back", "comingsoon menu", r => changeScene(previousScreen))

		// Multiplayer buttons
		Button.add(width / 2, 395, width / 3, 40, "¯\\_(ツ)_/¯", "multiplayer menu", r => changeScene("main menu"))

		// Settings Sliders
		Slider.add(width/2, 245, width / 3, 40, "options", "Render Distance", 1, 32, "renderDistance", val => settings.renderDistance = Math.round(val))
		Slider.add(width/2, 305, width / 3, 40, "options", "FOV", 30, 110, "fov", val => {
			p.FOV(val)
			if (world) {
				p.setDirection()
				world.render()
			}
		})
		Slider.add(width/2, 365, width / 3, 40, "options", "Mouse Sensitivity", 30, 400, "mouseSense", val => settings.mouseSense = val)
	}
	function initTextures() {
		let textureSize = 256
		let scale = 1 / 16
		let texturePixels = new Uint8Array(textureSize * textureSize * 4)
		textureMap = {}
		textureCoords = []

		setPixel = function(textureNum, x, y, r, g, b, a) {
			let texX = textureNum & 15
			let texY = textureNum >> 4
			let offset = (texY * 16 + y) * 1024 + texX * 64 + x * 4
			texturePixels[offset] = r
			texturePixels[offset + 1] = g
			texturePixels[offset + 2] = b
			texturePixels[offset + 3] = a !== undefined ? a : 255
		}
		getPixels = function(str) {
			// var w = parseInt(str.substr(0, 2), 36)
			// var h = parseInt(str.substr(2, 2), 36)
			var colors = []
			var pixels = []
			var dCount = 0
			for (;str[4 + dCount] === "0"; dCount++) {}
			var ccount = parseInt(str.substr(4+dCount, dCount+1), 36)
			for (var i = 0; i < ccount; i++) {
				var num = parseInt(str.substr(5 + 2*dCount + i * 7, 7), 36)
				colors.push([ num >>> 24 & 255, num >>> 16 & 255, num >>> 8 & 255, num & 255 ])
			}
			for (let i = 5 + 2*dCount + ccount * 7; i < str.length; i++) {
				let num = parseInt(str[i], 36)
				pixels.push(colors[num][0], colors[num][1], colors[num][2], colors[num][3])
			}
			return pixels
		};

		{
			// Specify the texture coords for each index
			const s = scale
			for (let i = 0; i < 256; i++) {
				let texX = i & 15
				let texY = i >> 4
				let offsetX = texX * s
				let offsetY = texY * s
				textureCoords.push(new Float32Array([ offsetX, offsetY, offsetX + s, offsetY, offsetX + s, offsetY + s, offsetX, offsetY + s ]))
			}

			// Set all of the textures into 1 big tiled texture
			let n = 0
			for (let i in textures) {
				if (typeof textures[i] === "function") {
					textures[i](n)
				} else if (typeof textures[i] === "string") {
					let pix = getPixels(textures[i])
					for (let j = 0; j < pix.length; j += 4) {
						setPixel(n, j >> 2 & 15, j >> 6, pix[j], pix[j+1], pix[j+2], pix[j+3])
					}
				}
				textureMap[i] = n
				n++
			}

			//Set the hitbox texture to 1 pixel
			let arr = new Float32Array(192)
			for (let i = 0; i < 192; i += 2) {
				arr[i] = textureCoords[textureMap.hitbox][0] + 0.01
				arr[i + 1] = textureCoords[textureMap.hitbox][1] + 0.01
			}
			textureCoords[textureMap.hitbox] = arr
		}

		// Big texture with everything in it
		tex = gl.createTexture()
		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, tex)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureSize, textureSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, texturePixels)
		gl.generateMipmap(gl.TEXTURE_2D)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
		gl.uniform1i(glCache.uSampler, 0)

		// Dirt texture for the background
		let dirtPixels = new Uint8Array(getPixels(textures.dirt))
		dirtTexture = gl.createTexture()
		gl.activeTexture(gl.TEXTURE1)
		gl.bindTexture(gl.TEXTURE_2D, dirtTexture)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 16, 16, 0, gl.RGBA, gl.UNSIGNED_BYTE, dirtPixels)
		gl.generateMipmap(gl.TEXTURE_2D)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)

		genIcons()
	}
	function drawIcon(x, y, id) {
		id = id < 0xff ? (id | blockMode) : id
		x =  x / (3 * height) - 0.1666 * width / height
		y = y / (3 * height) - 0.1666
		initModelView(null, x, y, 0, 0, 0)

		let buffer = blockIcons[id]
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
		gl.vertexAttribPointer(glCache.aVertex, 3, gl.FLOAT, false, 24, 0)
		gl.vertexAttribPointer(glCache.aTexture, 2, gl.FLOAT, false, 24, 12)
		gl.vertexAttribPointer(glCache.aShadow, 1, gl.FLOAT, false, 24, 20)
		gl.drawElements(gl.TRIANGLES, blockIcons.lengths[id], gl.UNSIGNED_INT, 0)
	}

	function hotbar() {
		FOV(90)

		for(let i = 0; i < inventory.hotbar.length; i ++) {
			if(inventory.hotbar[i]) {
				let x = width / 2 - inventory.hotbar.length / 2 * inventory.size + (i + 0.5) * inventory.size + 25
				let y = height - inventory.size
				drawIcon(x, y, inventory.hotbar[i])
			}
		}
	}
	function hud() {
		if (p.spectator) {
			return
		}

		hotbar()

		let s = inventory.size
		let x = width / 2 + 0.5
		let y = height / 2 + 0.5

		// Crosshair
		if (!p.spectator) {
			ctx.lineWidth = 1
			ctx.strokeStyle = "white"
			ctx.beginPath()
			ctx.moveTo(x - 10, y)
			ctx.lineTo(x + 10, y)
			ctx.moveTo(x, y - 10)
			ctx.lineTo(x, y + 10)
			ctx.stroke()
		}

		//Hotbar
		x = width / 2 - 9 / 2 * s + 0.5 + 25
		y = height - s * 1.5 + 0.5

		ctx.strokeStyle = "black"
		ctx.lineWidth = 2
		ctx.beginPath()
		ctx.moveTo(x, y)
		ctx.lineTo(x + s * 9, y)
		ctx.moveTo(x, y + s)
		ctx.lineTo(x + s * 9, y + s)
		for(let i = 0; i <= 9; i++) {
			ctx.moveTo(x + i * s, y)
			ctx.lineTo(x + i * s, y + s)
		}
		ctx.stroke()

		ctx.strokeStyle = "white"
		ctx.lineWidth = 2
		ctx.beginPath()

		ctx.strokeRect(width / 2 - 9 / 2 * s + inventory.hotbarSlot * s + 25, height - s * 1.5, s, s)

		let str = "Average Frame Time: " + analytics.displayedFrameTime + "ms\n"
		+ "Worst Frame Time: " + analytics.displayedwFrameTime + "ms\n"
		+ "Render Time: " + analytics.displayedRenderTime + "ms\n"
		+ "Tick Time: " + analytics.displayedTickTime + "ms\n"
		+ "Rendered Chunks: " + renderedChunks.toLocaleString() + " / " + world.loaded.length + "\n"
		+ "Generated Chunks: " + generatedChunks.toLocaleString() + "\n"
		+ "FPS: " + analytics.fps

		if (p.autoBreak) {
			text("Super breaker enabled", 5, height - 89, 12)
		}

		ctx.textAlign = 'right'
		text(p2.x + ", " + p2.y + ", " + p2.z, width - 10, 15, 0)
		ctx.textAlign = 'left'
		text(str, 5, height - 77, 12)
	}
	function drawInv() {
		let x = 0
		let y = 0
		let s = inventory.size
		let s2 = s / 2
		let perRow = 13

		gl.clearColor(0, 0, 0, 0)
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
		ctx.fillStyle = "rgb(127, 127, 127)"
		ctx.fillRect(0, 0, canvas.width, canvas.height)
		FOV(90)

		// Draw the grid
		ctx.lineWidth = 1
		ctx.strokeStyle = "black"
		ctx.beginPath()
		for (y = 0; y < 10; y++) {
			ctx.moveTo(50.5 - s2, 50.5 - s2 + y * s)
			ctx.lineTo(50.5 - s2 + s * perRow, 50.5 - s2 + y * s)
		}
		y--
		for (x = 0; x < perRow + 1; x++) {
			ctx.moveTo(50.5 - s2 + s * x, 50.5 - s2)
			ctx.lineTo(50.5 - s2 + s * x, 50.5 - s2 + y * s)
		}

		// Hotbar
		x = width / 2 - inventory.hotbar.length / 2 * s + 0.5 + 25
		y = height - s * 1.5 + 0.5
		ctx.moveTo(x, y)
		ctx.lineTo(x + s * 9, y)
		ctx.moveTo(x, y + s)
		ctx.lineTo(x + s * 9, y + s)
		for(let i = 0; i <= inventory.hotbar.length; i ++) {
			ctx.moveTo(x + i * s, y)
			ctx.lineTo(x + i * s, y + s)
		}
		ctx.stroke()

		let overHot = (mouseX - x) / s | 0
		if (mouseX < x + 9 * s && mouseX > x && mouseY > y && mouseY < y + s) {
			x += s * overHot
			ctx.lineWidth = 2
			ctx.strokeStyle = "white"
			ctx.beginPath()
			ctx.strokeRect(x, y, s, s)
		}

		//Box highlight in inv
		let overInv = Math.round((mouseY - 50) / s) * perRow + Math.round((mouseX - 50) / s)
		if (overInv >= 0 && overInv < BLOCK_COUNT - 1 && mouseX < 50 - s2 + perRow * s && mouseX > 50 - s2) {
			x = overInv % perRow * s + 50 - s2
			y = (overInv / perRow | 0) * s + 50 - s2
			ctx.lineWidth = 2
			ctx.strokeStyle = "white"
			ctx.beginPath()
			ctx.strokeRect(x, y, s, s)
		}

		if (inventory.holding) {
			drawIcon(mouseX, mouseY, inventory.holding)
		}
		for (let i = 1; i < BLOCK_COUNT; i++) {
			x = (i - 1) % perRow * s + 50
			y = ((i - 1) / perRow | 0) * s + 50
			drawIcon(x, y, i)
		}

		hotbar()
		//hud()
		ctx.drawImage(gl.canvas, 0, 0)
	}
	function clickInv() {
		let s = inventory.size
		let s2 = s / 2
		let perRow = 13
		let over = Math.round((mouseY - 50) / s) * perRow + Math.round((mouseX - 50) / s)
		let x = width / 2 - 9 / 2 * s + 25
		let y = height - s * 1.5
		let overHot = (mouseX - x) / s | 0
		if (mouseX < x + 9 * s && mouseX > x && mouseY > y && mouseY < y + s) {
			let temp = inventory.hotbar[overHot]
			inventory.hotbar[overHot] = inventory.holding
			inventory.holding = temp
		} else if (over >= 0 && over < BLOCK_COUNT - 1 && mouseX < 50 - s2 + perRow * s && mouseX > 50 - s2) {
			inventory.holding = over + 1
		} else {
			inventory.holding = 0
		}

		drawScreens.inventory()
	}

	let unpauseDelay = 0
	function mmoved(e) {
		let mouseS = settings.mouseSense / 30000
		p.rx -= e.movementY * mouseS
		p.ry += e.movementX * mouseS

		while(p.ry > Math.PI*2) {
			p.ry -= Math.PI*2
		}
		while(p.ry < 0) {
			p.ry += Math.PI*2
		}
		if(p.rx > Math.PI / 2) {
			p.rx = Math.PI / 2
		}
		if(p.rx < -Math.PI / 2) {
			p.rx = -Math.PI / 2
		}
	}
	function trackMouse(e) {
		cursor("")
		mouseX = e.x
		mouseY = e.y
		drawScreens[screen]()
		Button.draw()
		Slider.draw()
		Slider.drag()
	}
	document.onmousemove = trackMouse
	document.onpointerlockchange = function() {
		if (doc.pointerLockElement === canvas) {
			doc.onmousemove = mmoved
		} else {
			doc.onmousemove = trackMouse
			if (screen === "play" && !freezeFrame) {
				changeScene("pause")
				unpauseDelay = Date.now() + 1000
			}
		}
		for (let key in Key) {
			Key[key] = false
		}
	}
	canvas.onmousedown = function(e) {
		mouseX = e.x
		mouseY = e.y
		mouseDown = true
		let block, index
		switch(e.button) {
			case 0:
				Key.leftMouse = true
				break
			case 1:
				Key.middleMouse = true
				if (!hitBox.pos) break
				updateHUD = true
				block = world.getBlock(hitBox.pos[0], hitBox.pos[1], hitBox.pos[2]) & 0x3ff
				index = inventory.hotbar.indexOf(block)
				if (index >= 0) {
					inventory.hotbarSlot = index
				} else {
					inventory.hotbar[inventory.hotbarSlot] = block
				}
				break
			case 2:
				Key.rightMouse = true
				break
		}
		if(screen === "play") {
			if (doc.pointerLockElement !== canvas) {
				getPointer()
				p.lastBreak = Date.now()
			} else {
				place = false
				if(e.button === 0) {
					if(Key.control) {
						place = true
					} else {
						changeWorldBlock(0)
					}
				}
				holding = inventory.hotbar[inventory.hotbarSlot]
				if(e.button === 2 && holding) {
					place = true
				}
				if(place) {
					newWorldBlock()
				}
			}
		} else if (screen === "inventory") {
			clickInv()
		}

		Button.click()
		Slider.click()
	}
	canvas.onmouseup = function(e) {
		switch(e.button) {
			case 0:
				Key.leftMouse = false
				break
			case 1:
				Key.middleMouse = false
				break
			case 2:
				Key.rightMouse = false
				break
		}
		mouseDown = false
		Slider.release()
	}
	canvas.onkeydown = function(e) {
		let k = e.key.toLowerCase()
		if (k === " ") {
			e.preventDefault()
		}
		if (e.repeat || Key[k]) {
			return
		}
		Key[k] = true

		if (k === "t") {
			initTextures()
		}

		if (k === "enter") {
			blockMode = blockMode === CUBE ? SLAB : (blockMode === SLAB ? STAIR : CUBE)
			updateHUD = true
		}

		if (screen === "play") {
			if(k === "p") {
				releasePointer()
				changeScene("pause")
			}

			if(k === "b") {
				p.autoBreak = !p.autoBreak
				updateHUD = true
			}

			if (k === " " && !p.spectator) {
				if (Date.now() < p.lastJump + 400) {
					p.flying ^= true
				} else {
					p.lastJump = Date.now()
				}
			}

			if (k === "z") {
				p.FOV(10, 300)
			}

			if (k === "shift" && !p.flying) {
				p.sneaking = true
				if (p.sprinting) {
					p.FOV(settings.fov, 100)
				}
				p.sprinting = false
				p.speed = 0.03
				p.bottomH = 1.32
			}

			if (k === "l") {
				p.spectator = !p.spectator
				p.flying = true
				p.onGround = false
				updateHUD = true
			}

			if (k === "e") {
				changeScene("inventory")
				releasePointer()
			}

			if (k === ";") {
				releasePointer()
				freezeFrame = true
			}

			if(Number(k)) {
				inventory.hotbarSlot = Number(k) - 1
				holding = inventory.hotbar[inventory.hotbarSlot]
				updateHUD = true
			}
		} else if (screen === "pause") {
			if(k === "p") {
				play()
			}
		} else if (screen === "inventory") {
			if (k === "e") {
				play()
			}
			if (k === "enter") {
				drawScreens.inventory()
			}
		}
	}
	canvas.onkeyup = function(e) {
		let k = e.key.toLowerCase()
		Key[k] = false
		if(k === "escape" && (screen === "pause" || screen === "inventory" || screen === "options" && previousScreen === "pause") && Date.now() > unpauseDelay) {
			play()
		}
		if (screen === "play") {
			if (k === "z") {
				p.FOV(settings.fov, 300)
			}

			if (k === "shift" && p.sneaking) {
				p.sneaking = false
				p.speed = 0.075
				p.bottomH = 1.62
				// p.y += 0.3
			}
		}
	}
	canvas.onblur = function() {
		for (let key in Key) {
			Key[key] = false
		}
		mouseDown = false
		Slider.release()
	}
	canvas.oncontextmenu = function(e) {
		e.preventDefault()
	}
	window.onbeforeunload = e => { 
		if (screen === "play" && Key.control) {
			releasePointer()
			e.preventDefault()
			e.returnValue = "Q is the sprint button; Ctrl + W closes the page."
			return true
		}
	}
	canvas.onwheel = e => {
		e.preventDefault()
		e.stopPropagation()
		if (e.deltaY > 0) {
			inventory.hotbarSlot++
		} else if (e.deltaY < 0) {
			inventory.hotbarSlot--
		}
		if (inventory.hotbarSlot > 8) {
			inventory.hotbarSlot = 0
		} else if (inventory.hotbarSlot < 0) {
			inventory.hotbarSlot = 8
		}

		updateHUD = true
		holding = inventory.hotbar[inventory.hotbarSlot]
	}
	document.onwheel = e => {} // Shouldn't do anything, but it helps with a Khan Academy bug somewhat
	window.onresize = e => {
		width = window.innerWidth
		height = window.innerHeight
		canvas.height = height
		canvas.width = width
		gl.canvas.height = height
		gl.canvas.width = width
		gl.viewport(0, 0, width, height)
		initButtons()
		initBackgrounds()
		inventory.size = 40 * Math.min(width, height) / 600
		genIcons()
		use3d()
		p.FOV(p.currentFov + 0.0001)

		if (screen === "play") {
			play()
		} else {
			drawScreens[screen]()
			Button.draw()
			Slider.draw()
		}
	}
