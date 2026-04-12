	let getShadows = {
		shade: [ 1, 0.85, 0.7, 0.6, 0.3 ],
		ret: [],
		blocks: [],
		top: function(x, y, z, block) { // Actually the bottom... How did these get flipped?
			let blocks = this.blocks
			let ret = this.ret
			blocks[0] = blockData[getBlock(x-1, y-1, z-1, block)].shadow
			blocks[1] = blockData[getBlock(x, y-1, z-1, block)].shadow
			blocks[2] = blockData[getBlock(x+1, y-1, z-1, block)].shadow
			blocks[3] = blockData[getBlock(x-1, y-1, z, block)].shadow
			blocks[4] = blockData[getBlock(x, y-1, z, block)].shadow
			blocks[5] = blockData[getBlock(x+1, y-1, z, block)].shadow
			blocks[6] = blockData[getBlock(x-1, y-1, z+1, block)].shadow
			blocks[7] = blockData[getBlock(x, y-1, z+1, block)].shadow
			blocks[8] = blockData[getBlock(x+1, y-1, z+1, block)].shadow

			ret[0] = this.shade[blocks[0] + blocks[1] + blocks[3] + blocks[4]]*0.75
			ret[1] = this.shade[blocks[1] + blocks[2] + blocks[4] + blocks[5]]*0.75
			ret[2] = this.shade[blocks[5] + blocks[4] + blocks[8] + blocks[7]]*0.75
			ret[3] = this.shade[blocks[4] + blocks[3] + blocks[7] + blocks[6]]*0.75
			return ret
		},
		bottom: function(x, y, z, block) { // Actually the top
			let blocks = this.blocks
			let ret = this.ret
			blocks[0] = blockData[getBlock(x-1, y+1, z-1, block)].shadow
			blocks[1] = blockData[getBlock(x, y+1, z-1, block)].shadow
			blocks[2] = blockData[getBlock(x+1, y+1, z-1, block)].shadow
			blocks[3] = blockData[getBlock(x-1, y+1, z, block)].shadow
			blocks[4] = blockData[getBlock(x, y+1, z, block)].shadow
			blocks[5] = blockData[getBlock(x+1, y+1, z, block)].shadow
			blocks[6] = blockData[getBlock(x-1, y+1, z+1, block)].shadow
			blocks[7] = blockData[getBlock(x, y+1, z+1, block)].shadow
			blocks[8] = blockData[getBlock(x+1, y+1, z+1, block)].shadow

			ret[0] = this.shade[blocks[4] + blocks[3] + blocks[7] + blocks[6]]
			ret[1] = this.shade[blocks[5] + blocks[4] + blocks[8] + blocks[7]]
			ret[2] = this.shade[blocks[1] + blocks[2] + blocks[4] + blocks[5]]
			ret[3] = this.shade[blocks[0] + blocks[1] + blocks[3] + blocks[4]]
			return ret
		},
		north: function(x, y, z, block) {
			let blocks = this.blocks
			let ret = this.ret
			blocks[0] = blockData[getBlock(x-1, y-1, z+1, block)].shadow
			blocks[1] = blockData[getBlock(x, y-1, z+1, block)].shadow
			blocks[2] = blockData[getBlock(x+1, y-1, z+1, block)].shadow
			blocks[3] = blockData[getBlock(x-1, y, z+1, block)].shadow
			blocks[4] = blockData[getBlock(x, y, z+1, block)].shadow
			blocks[5] = blockData[getBlock(x+1, y, z+1, block)].shadow
			blocks[6] = blockData[getBlock(x-1, y+1, z+1, block)].shadow
			blocks[7] = blockData[getBlock(x, y+1, z+1, block)].shadow
			blocks[8] = blockData[getBlock(x+1, y+1, z+1, block)].shadow

			ret[0] = this.shade[blocks[5] + blocks[4] + blocks[8] + blocks[7]]*0.95
			ret[1] = this.shade[blocks[4] + blocks[3] + blocks[7] + blocks[6]]*0.95
			ret[2] = this.shade[blocks[0] + blocks[1] + blocks[3] + blocks[4]]*0.95
			ret[3] = this.shade[blocks[1] + blocks[2] + blocks[4] + blocks[5]]*0.95
			return ret
		},
		south: function(x, y, z, block) {
			let blocks = this.blocks
			let ret = this.ret
			blocks[0] = blockData[getBlock(x-1, y-1, z-1, block)].shadow
			blocks[1] = blockData[getBlock(x-1, y, z-1, block)].shadow
			blocks[2] = blockData[getBlock(x-1, y+1, z-1, block)].shadow
			blocks[3] = blockData[getBlock(x, y-1, z-1, block)].shadow
			blocks[4] = blockData[getBlock(x, y, z-1, block)].shadow
			blocks[5] = blockData[getBlock(x, y+1, z-1, block)].shadow
			blocks[6] = blockData[getBlock(x+1, y-1, z-1, block)].shadow
			blocks[7] = blockData[getBlock(x+1, y, z-1, block)].shadow
			blocks[8] = blockData[getBlock(x+1, y+1, z-1, block)].shadow

			ret[0] = this.shade[blocks[1] + blocks[2] + blocks[4] + blocks[5]]*0.95
			ret[1] = this.shade[blocks[5] + blocks[4] + blocks[8] + blocks[7]]*0.95
			ret[2] = this.shade[blocks[4] + blocks[3] + blocks[7] + blocks[6]]*0.95
			ret[3] = this.shade[blocks[0] + blocks[1] + blocks[3] + blocks[4]]*0.95
			return ret
		},
		east: function(x, y, z, block) {
			let blocks = this.blocks
			let ret = this.ret
			blocks[0] = blockData[getBlock(x+1, y-1, z-1, block)].shadow
			blocks[1] = blockData[getBlock(x+1, y, z-1, block)].shadow
			blocks[2] = blockData[getBlock(x+1, y+1, z-1, block)].shadow
			blocks[3] = blockData[getBlock(x+1, y-1, z, block)].shadow
			blocks[4] = blockData[getBlock(x+1, y, z, block)].shadow
			blocks[5] = blockData[getBlock(x+1, y+1, z, block)].shadow
			blocks[6] = blockData[getBlock(x+1, y-1, z+1, block)].shadow
			blocks[7] = blockData[getBlock(x+1, y, z+1, block)].shadow
			blocks[8] = blockData[getBlock(x+1, y+1, z+1, block)].shadow

			ret[0] = this.shade[blocks[1] + blocks[2] + blocks[4] + blocks[5]]*0.8
			ret[1] = this.shade[blocks[5] + blocks[4] + blocks[8] + blocks[7]]*0.8
			ret[2] = this.shade[blocks[4] + blocks[3] + blocks[7] + blocks[6]]*0.8
			ret[3] = this.shade[blocks[0] + blocks[1] + blocks[3] + blocks[4]]*0.8
			return ret
		},
		west: function(x, y, z, block) {
			let blocks = this.blocks
			let ret = this.ret
			blocks[0] = blockData[getBlock(x-1, y-1, z-1, block)].shadow
			blocks[1] = blockData[getBlock(x-1, y, z-1, block)].shadow
			blocks[2] = blockData[getBlock(x-1, y+1, z-1, block)].shadow
			blocks[3] = blockData[getBlock(x-1, y-1, z, block)].shadow
			blocks[4] = blockData[getBlock(x-1, y, z, block)].shadow
			blocks[5] = blockData[getBlock(x-1, y+1, z, block)].shadow
			blocks[6] = blockData[getBlock(x-1, y-1, z+1, block)].shadow
			blocks[7] = blockData[getBlock(x-1, y, z+1, block)].shadow
			blocks[8] = blockData[getBlock(x-1, y+1, z+1, block)].shadow

			ret[0] = this.shade[blocks[7] + blocks[8] + blocks[4] + blocks[5]]*0.8
			ret[1] = this.shade[blocks[5] + blocks[4] + blocks[2] + blocks[1]]*0.8
			ret[2] = this.shade[blocks[4] + blocks[3] + blocks[1] + blocks[0]]*0.8
			ret[3] = this.shade[blocks[6] + blocks[7] + blocks[3] + blocks[4]]*0.8
			return ret
		},
	}

	function interpolateShadows(shadows, x, y) {
		let sx = (shadows[1] - shadows[0]) * x + shadows[0]
		let sx2 = (shadows[3] - shadows[2]) * x + shadows[2]
		return (sx2 - sx) * y + sx
	}

	class Section {
		constructor(x, y, z, size, chunk) {
			this.x = x
			this.y = y
			this.z = z
			this.size = size
			this.arraySize = size * size * size
			this.blocks = new Int32Array(this.arraySize)
			this.compressed = new Uint8Array(this.arraySize)
			this.renderData = []
			this.renderLength = 0
			this.faces = 0
			this.hasVisibleBlocks = false
			this.chunk = chunk
			this.edited = false
			this.caves = !caves
			this.pallete = [0]
			this.palleteMap = {"0": 0}
			this.palleteSize = 0
		}
		getBlock(x, y, z) {
			let s = this.size
			return this.blocks[x * s * s + y * s + z]
		}
		setBlock(x, y, z, blockId) {
			let s = this.size
			this.blocks[x * s * s + y * s + z] = blockId
		}
		deleteBlock(x, y, z) {
			let s = this.size
			this.blocks[x * s * s + y * s + z] = 0
		}
		optimize() {
			let visible = false
			let pos = 0
			let xx = this.x
			let yy = this.y
			let zz = this.z
			let blockState = 0
			let palleteIndex = 0
			let index = 0
			let s = this.size
			let blocks = this.blocks
			this.hasVisibleBlocks = false
			this.renderLength = 0
			let localBlocks = world.getAdjacentSubchunks(xx, yy, zz)

			//Check all the blocks in the subchunk to see if they're visible.
			for (let i = 0; i < s; i++) {
				for (let j = 0; j < s; j++) {
					for (let k = 0; k < s; k++, index++) {
						blockState = blocks[index]

						if (this.palleteMap[blockState] === undefined) {
							this.palleteMap[blockState] = this.pallete.length
							palleteIndex = this.pallete.length
							this.pallete.push(blockState)
						} else {
							palleteIndex = this.palleteMap[blockState]
						}

						visible = blockState && (hideFace(i-1, j, k, localBlocks, blockState, getBlock, "west", "east")
						| hideFace(i+1, j, k, localBlocks, blockState, getBlock, "east", "west") << 1
						| hideFace(i, j-1, k, localBlocks, blockState, getBlock, "bottom", "top") << 2
						| hideFace(i, j+1, k, localBlocks, blockState, getBlock, "top", "bottom") << 3
						| hideFace(i, j, k-1, localBlocks, blockState, getBlock, "south", "north") << 4
						| hideFace(i, j, k+1, localBlocks, blockState, getBlock, "north", "south") << 5)
						if (visible) {
							pos = (i | j << 4 | k << 8) << 19
							this.renderData[this.renderLength++] = 1 << 31 | pos | visible << 13 | palleteIndex
							this.hasVisibleBlocks = true
						}
					}
				}
			}
		}
		updateBlock(x, y, z, world) {
			if (!world.meshQueue.includes(this.chunk)) {
				world.meshQueue.push(this.chunk)
			}
			let i = x
			let j = y
			let k = z
			let s = this.size
			x += this.x
			y += this.y
			z += this.z
			let blockState = this.blocks[i * s * s + j * s + k]
			let visible = blockState && (hideFace(x-1, y, z, 0, blockState, world.getBlock, "west", "east")
			| hideFace(x+1, y, z, 0, blockState, world.getBlock, "east", "west") << 1
			| hideFace(x, y-1, z, 0, blockState, world.getBlock, "bottom", "top") << 2
			| hideFace(x, y+1, z, 0, blockState, world.getBlock, "top", "bottom") << 3
			| hideFace(x, y, z-1, 0, blockState, world.getBlock, "south", "north") << 4
			| hideFace(x, y, z+1, 0, blockState, world.getBlock, "north", "south") << 5)
			let pos = (i | j << 4 | k << 8) << 19
			let index = -1

			// Find index of current block in this.renderData
			for (let i = 0; i < this.renderLength; i++) {
				if ((this.renderData[i] & 0x7ff80000) === pos) {
					index = i
					break
				}
			}

			// Update pallete
			if (this.palleteMap[blockState] === undefined) {
				this.palleteMap[blockState] = this.pallete.length
				this.pallete.push(blockState)
			}

			if (index < 0 && !visible) {
				// Wasn't visible before, isn't visible after.
				return
			}
			if (!visible) {
				// Was visible before, isn't visible after.
				this.renderData.splice(index, 1)
				this.renderLength--
				this.hasVisibleBlocks = !!this.renderLength
				return
			}
			if (visible && index < 0) {
				// Wasn't visible before, is visible after.
				index = this.renderLength++
				this.hasVisibleBlocks = true
			}
			this.renderData[index] = 1 << 31 | pos | visible << 13 | this.palleteMap[blockState]
		}
		genMesh(barray, index) {
			if (!this.renderLength) {
				return index
			}
			let length = this.renderLength
			let rData = this.renderData
			let x = 0, y = 0, z = 0, loc = 0, data = 0, sides = 0, tex = null, x2 = 0, y2 = 0, z2 = 0, verts = null, texVerts = null, texShapeVerts = null, tx = 0, ty = 0
			let wx = this.x, wy = this.y, wz = this.z
			let blocks = world.getAdjacentSubchunks(wx, wy, wz)
			let block = null

			let shadows = null
			let blockSides = Object.keys(Block)
			let side = ""
			let shapeVerts = null
			let shapeTexVerts = null
			let pallete = this.pallete
			let intShad = interpolateShadows
			
			for (let i = 0; i < length; i++) {
				data = rData[i]
				block = blockData[pallete[data & 0x1fff]]
				tex = block.textures
				sides = data >> 13 & 0x3f
				loc = data >> 19 & 0xfff
				x = loc & 15
				y = loc >> 4 & 15
				z = loc >> 8 & 15

				x2 = x + this.x
				y2 = y + this.y
				z2 = z + this.z

				shapeVerts = block.shape.verts
				shapeTexVerts = block.shape.texVerts

				let texNum = 0
				for (let n = 0; n < 6; n++) {
					side = blockSides[n]
					if (sides & Block[side]) {
						shadows = getShadows[side](x, y, z, blocks)
						let directionalFaces = shapeVerts[Sides[side]]
						// if (directionalFaces.length > 1) {
						// 	let average = (shadows[0] + shadows[1] + shadows[2] + shadows[3]) / 4
						// 	shadows[0] = average
						// 	shadows[1] = average
						// 	shadows[2] = average
						// 	shadows[3] = average
						// }
						for (let facei = 0; facei < directionalFaces.length; facei++) {
							verts = directionalFaces[facei]
							texVerts = textureCoords[textureMap[tex[texNum]]]
							tx = texVerts[0]
							ty = texVerts[1]
							texShapeVerts = shapeTexVerts[n][facei]

							barray[index] = verts[0] + x2
							barray[index+1] = verts[1] + y2
							barray[index+2] = verts[2] + z2
							barray[index+3] = tx + texShapeVerts[0]
							barray[index+4] = ty + texShapeVerts[1]
							barray[index+5] = shadows[0]

							barray[index+6] = verts[3] + x2
							barray[index+7] = verts[4] + y2
							barray[index+8] = verts[5] + z2
							barray[index+9] = tx + texShapeVerts[2]
							barray[index+10] = ty + texShapeVerts[3]
							barray[index+11] = shadows[1]

							barray[index+12] = verts[6] + x2
							barray[index+13] = verts[7] + y2
							barray[index+14] = verts[8] + z2
							barray[index+15] = tx + texShapeVerts[4]
							barray[index+16] = ty + texShapeVerts[5]
							barray[index+17] = shadows[2]

							barray[index+18] = verts[9] + x2
							barray[index+19] = verts[10] + y2
							barray[index+20] = verts[11] + z2
							barray[index+21] = tx + texShapeVerts[6]
							barray[index+22] = ty + texShapeVerts[7]
							barray[index+23] = shadows[3]
							index += 24
						}
					}
					texNum++
				}
			}
			return index
		}
		carveCaves() {
			let wx = this.x + 16, wz = this.z + 16, wy = this.y + 16
			for (let x = this.x, xx = 0; x < wx; x++, xx++) {
				for (let z = this.z, zz = 0; z < wz; z++, zz++) {
					wy = this.chunk.tops[zz * 16 + xx]
					for (let y = this.y; y < wy; y++) {
						if (isCave(x, y, z)) {
							carveSphere(x, y, z)
						}
					}
				}
			}
			this.caves = true
		}
		tick() {
			for (let i = 0; i < 3; i++) {
				let rnd = Math.random() * this.blocks.length | 0
				if ((this.blocks[rnd]) === blockIds.grass) {
					// Spread grass

					let x = (rnd >> 8) + this.x
					let y = (rnd >> 4 & 15) + this.y
					let z = (rnd & 15) + this.z
					if (!blockData[world.getBlock(x, y + 1, z)].transparent) {
						world.setBlock(x, y, z, blockIds.dirt, false)
						return
					}

					let rnd2 = Math.random() * 27 | 0
					let x2 = rnd2 % 3 - 1
					rnd2 = (rnd2 - x2 - 1) / 3
					let y2 = rnd2 % 3 - 1
					rnd2 = (rnd2 - y2 - 1) / 3
					z += rnd2 - 1
					x += x2
					y += y2

					if (world.getBlock(x, y, z) === blockIds.dirt && world.getBlock(x, y + 1, z) === blockIds.air) {
						world.setBlock(x, y, z, blockIds.grass, false)
					}
				}
			}
		}
	}
	let emptySection = new Section(0, 0, 0, 16)
	let fullSection = new Section(0, 0, 0, 16)
	fullSection.blocks.fill(blockIds.bedrock)

	class Chunk {
		constructor(x, z) {
			this.x = x
			this.z = z
			this.maxY = 0
			this.minY = 255
			this.sections = []
			this.cleanSections = []
			this.tops = new Uint8Array(16 * 16); // Store the heighest block at every (x,z) coordinate
			this.optimized = false
			this.generated = false; // Terrain
			this.populated = superflat; // Trees and ores
			this.lazy = false
			this.edited = false
			this.loaded = false
			this.caves = !caves
		}
		getBlock(x, y, z) {
			let s = y >> 4
			return this.sections.length > s ? this.sections[s].getBlock(x, y & 15, z) : 0
		}
		setBlock(x, y, z, blockID, hidden, user) {
			if (!this.sections[y >> 4]) {
				do {
					this.sections.push(new Section(this.x, this.sections.length * 16, this.z, 16, this))
				} while (!this.sections[y >> 4])
			}
			if (user && !this.sections[y >> 4].edited) {
				this.cleanSections[y >> 4] = this.sections[y >> 4].blocks.slice()
				this.sections[y >> 4].edited = true
				this.edited = true
			}
			this.sections[y >> 4].setBlock(x, y & 15, z, blockID, hidden)
		}
		optimize() {
			for (let i = 0; i < this.sections.length; i++) {
				this.sections[i].optimize()
			}
			if (!world.meshQueue.includes(this)) {
				world.meshQueue.push(this)
			}
			this.optimized = true
		}
		render() {
			if (!this.buffer) {
				return
			}
			if (p.canSee(this.x, this.minY, this.z, this.maxY)) {
				renderedChunks++
				gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
				gl.vertexAttribPointer(glCache.aVertex, 3, gl.FLOAT, false, 24, 0)
				gl.vertexAttribPointer(glCache.aTexture, 2, gl.FLOAT, false, 24, 12)
				gl.vertexAttribPointer(glCache.aShadow, 1, gl.FLOAT, false, 24, 20)
				gl.drawElements(gl.TRIANGLES, 6 * this.faces, gl.UNSIGNED_INT, 0)
			}
		}
		updateBlock(x, y, z, world, lazy) {
			if (this.buffer) {
				this.lazy = lazy
				if (this.sections.length > y >> 4) {
					this.sections[y >> 4].updateBlock(x, y & 15, z, world)
				}
			}
		}
		deleteBlock(x, y, z, user) {
			if (!this.sections[y >> 4]) {
				return
			}
			if (user && !this.sections[y >> 4].edited) {
				this.cleanSections[y >> 4] = this.sections[y >> 4].blocks.slice()
				this.sections[y >> 4].edited = true
				this.edited = true
			}
			this.sections[y >> 4].deleteBlock(x, y & 15, z)
			this.minY = y < this.minY ? y : this.minY
			this.maxY = y > this.maxY ? y : this.maxY
		}
		carveCaves() {
			for (let i = 0; i < this.sections.length; i++) {
				if (!this.sections[i].caves) {
					this.sections[i].carveCaves()
					if (i + 1 >= this.sections.length) {
						this.caves = true
					}
					return
				}
			}
		}
		populate() {
			randomSeed(hash(this.x, this.z) * 210000000)
			let wx = 0, wz = 0, ground = 0, top = 0, rand = 0, place = false

			for (let i = 0; i < 16; i++) {
				for (let k = 0; k < 16; k++) {
					wx = this.x + i
					wz = this.z + k
					ground = this.tops[k * 16 + i]
					if (trees && random() < 0.005 && this.getBlock(i, ground, k)) {

						top = ground + Math.floor(4.5 + random(2.5))
						rand = Math.floor(random(4096))
						let tree = random() < 0.6 ? blockIds.oakLog : ++top && blockIds.birchLog

						//Center
						for (let j = ground + 1; j <= top; j++) {
							this.setBlock(i, j, k, tree)
						}
						this.setBlock(i, top + 1, k, blockIds.leaves)
						this.setBlock(i, ground, k, blockIds.dirt)

						//Bottom leaves
						for (let x = -2; x <= 2; x++) {
							for (let z = -2; z <= 2; z++) {
								if (x || z) {
									if ((x * z & 7) === 4) {
										place = rand & 1
										rand >>>= 1
										if (place) {
											world.spawnBlock(wx + x, top - 2, wz + z, blockIds.leaves)
										}
									} else {
										world.spawnBlock(wx + x, top - 2, wz + z, blockIds.leaves)
									}
								}
							}
						}

						//2nd layer leaves
						for (let x = -2; x <= 2; x++) {
							for (let z = -2; z <= 2; z++) {
								if (x || z) {
									if ((x * z & 7) === 4) {
										place = rand & 1
										rand >>>= 1
										if (place) {
											world.spawnBlock(wx + x, top - 1, wz + z, blockIds.leaves)
										}
									} else {
										world.spawnBlock(wx + x, top - 1, wz + z, blockIds.leaves)
									}
								}
							}
						}

						//3rd layer leaves
						for (let x = -1; x <= 1; x++) {
							for (let z = -1; z <= 1; z++) {
								if (x || z) {
									if (x & z) {
										place = rand & 1
										rand >>>= 1
										if (place) {
											world.spawnBlock(wx + x, top, wz + z, blockIds.leaves)
										}
									} else {
										world.spawnBlock(wx + x, top, wz + z, blockIds.leaves)
									}
								}
							}
						}

						//Top leaves
						world.spawnBlock(wx + 1, top + 1, wz, blockIds.leaves)
						world.spawnBlock(wx, top + 1, wz - 1, blockIds.leaves)
						world.spawnBlock(wx, top + 1, wz + 1, blockIds.leaves)
						world.spawnBlock(wx - 1, top + 1, wz, blockIds.leaves)
					}

					// Blocks of each per chunk in Minecraft
					// Coal: 185.5
					// Iron: 111.5
					// Gold: 10.4
					// Redstone: 29.1
					// Diamond: 3.7
					// Lapis: 4.1
					ground -= 4

					if (random() < 3.7 / 256) {
						let y = random() * 16 | 0 + 1
						y = y < ground ? y : ground
						if (this.getBlock(i, y, k)) {
							this.setBlock(i, y < ground ? y : ground, k, blockIds.diamondOre)
						}
					}

					if (random() < 111.5 / 256) {
						let y = random() * 64 | 0 + 1
						y = y < ground ? y : ground
						if (this.getBlock(i, y, k)) {
							this.setBlock(i, y < ground ? y : ground, k, blockIds.ironOre)
						}
					}

					if (random() < 185.5 / 256) {
						let y = random() * ground | 0 + 1
						y = y < ground ? y : ground
						if (this.getBlock(i, y, k)) {
							this.setBlock(i, y < ground ? y : ground, k, blockIds.coalOre)
						}
					}

					if (random() < 10.4 / 256) {
						let y = random() * 32 | 0 + 1
						y = y < ground ? y : ground
						if (this.getBlock(i, y, k)) {
							this.setBlock(i, y < ground ? y : ground, k, blockIds.goldOre)
						}
					}

					if (random() < 29.1 / 256) {
						let y = random() * 16 | 0 + 1
						y = y < ground ? y : ground
						if (this.getBlock(i, y, k)) {
							this.setBlock(i, y < ground ? y : ground, k, blockIds.redstoneOre)
						}
					}

					if (random() < 4.1 / 256) {
						let y = random() * 32 | 0 + 1
						y = y < ground ? y : ground
						if (this.getBlock(i, y, k)) {
							this.setBlock(i, y < ground ? y : ground, k, blockIds.lapisOre)
						}
					}
				}
			}

			this.populated = true
		}
		genMesh() {
			let start = win.performance.now()
			let barray = bigArray
			let index = 0
			for (let i = 0; i < this.sections.length; i++) {
				index = this.sections[i].genMesh(barray, index)
			}
			let arrayDone = win.performance.now()

			if (!this.buffer) {
				this.buffer = gl.createBuffer()
			}
			let data = barray.slice(0, index)

			let maxY = 0
			let minY = 255
			let y = 0
			for (let i = 1; i < data.length; i += 6) {
				y = data[i]
				maxY = Math.max(maxY, y)
				minY = Math.min(minY, y)
			}
			this.maxY = maxY
			this.minY = minY
			this.faces = data.length / 24
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
			gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)
			this.lazy = false
		}
		tick() {
			if (this.edited) {
				for (let i = 0; i < this.sections.length; i++) {
					if (this.sections[i].edited) {
						this.sections[i].tick()
					}
				}
			}
		}
		load() {
			let chunkX = this.x >> 4
			let chunkZ = this.z >> 4
			let load = null
			
			for (let i = 0; i < world.loadFrom.length; i++) {
				load = world.loadFrom[i]
				if (load.x === chunkX && load.z === chunkZ) {
					let y = load.y * 16
					for (let j in load.blocks) {
						world.setBlock((j >> 8 & 15) + this.x, (j >> 4 & 15) + y, (j & 15) + this.z, load.blocks[j])
					}
					world.loadFrom.splice(i--, 1)
				}
			}
			this.loaded = true
		}
	}

	let analytics = {
		totalTickTime: 0,
		worstFrameTime: 0,
		totalRenderTime: 0,
		totalFrameTime: 0,
		lastUpdate: 0,
		frames: 1,
		displayedTickTime: "0",
		displayedRenderTime: "0",
		displayedFrameTime: "0",
		displayedwFrameTime: 0,
		fps: 0,
	}
	function chunkDist(c) {
		let dx = p.x - c.x
		let dz = p.z - c.z
		if (dx > 16) {
			dx -= 16
		} else if (dx > 0) {
			dx = 0
		}
		if (dz > 16) {
			dz -= 16
		} else if (dz > 0) {
			dz = 0
		}
		return Math.sqrt(dx * dx + dz * dz)
	}
	function sortChunks(c1, c2) { //Sort the list of chunks based on distance from the player
		let dx1 = p.x - c1.x - 8
		let dy1 = p.z - c1.z - 8
		let dx2 = p.x - c2.x - 8
		let dy2 = p.z - c2.z - 8
		return dx1 * dx1 + dy1 * dy1 - (dx2 * dx2 + dy2 * dy2)
	}
	function fillReqs(x, z) {
		// Chunks must all be loaded first.
		var done = true
		for (let i = x - 2; i <= x + 2; i++) {
			for (let j = z - 2; j <= z + 2; j++) {
				let chunk = world.loaded[(i + world.offsetX) * world.lwidth + j + world.offsetZ]
				if (!chunk.generated) {
					world.generateQueue.push(chunk)
					done = false
				}
				if (!chunk.populated && i >= x - 1 && i <= x + 1 && j >= z - 1 && j <= z + 1) {
					world.populateQueue.push(chunk)
					done = false
				}
			}
		}
		return done
	}
	function maxDist(x, z, x2, z2) {
		let ax = Math.abs(x2 - x)
		let az = Math.abs(z2 - z)
		return Math.max(ax, az)
	}
	function renderFilter(chunk) {
		return maxDist(chunk.x >> 4, chunk.z >> 4, p.cx, p.cz) <= settings.renderDistance
	}

	function debug(message) {
		let ellapsed = performance.now() - debug.start
		if (ellapsed > 30) {
			console.log(message, ellapsed.toFixed(2), "milliseconds")
		}
	}

	let fogDist = 16
	class World {
		constructor() {
			generatedChunks = 0
			fogDist = 16
			p.y = superflat ? 6 : (Math.round(noise(8 * generator.smooth, 8 * generator.smooth) * generator.height) + 2 + generator.extra)

			//Initialize the world's arrays
			this.chunks = []
			this.loaded = []
			this.sortedChunks = []
			this.offsetX = 0
			this.offsetZ = 0
			this.lwidth = 0
			this.chunkGenQueue = []
			this.populateQueue = []
			this.generateQueue = []
			this.meshQueue = []
			this.loadFrom = []
			this.lastChunk = ","
		}
		genChunk(chunk) {
			let x = chunk.x >> 4
			let z = chunk.z >> 4
			let trueX = chunk.x
			let trueZ = chunk.z

			if (chunk.generated) {
				return false
			}
			let hide = !loadString
			let smoothness = generator.smooth
			let hilliness = generator.height
			let gen = 0
			for (let i = 0; i < 16; i++) {
				for (let k = 0; k < 16; k++) {
					gen = superflat ? 4 : Math.round(noise((trueX + i) * smoothness, (trueZ + k) * smoothness) * hilliness) + generator.extra
					chunk.tops[k * 16 + i] = gen

					chunk.setBlock(i, gen, k, blockIds.grass)
					chunk.setBlock(i, gen - 1, k, blockIds.dirt)
					chunk.setBlock(i, gen - 2, k, blockIds.dirt)
					chunk.setBlock(i, gen - 3, k, blockIds.dirt)
					for (let j = 1; j < gen - 3; j++) {
						chunk.setBlock(i, j, k, blockIds.stone)
					}
					chunk.setBlock(i, 0, k, blockIds.bedrock)
				}
			}
			chunk.generated = true
		}
		getAdjacentSubchunks(x, y, z) {
			let minChunkX = x - 16 >> 4
			let maxChunkX = x + 16 >> 4
			let minChunkY = y - 16 >> 4
			let maxChunkY = y + 16 >> 4
			let minChunkZ = z - 16 >> 4
			let maxChunkZ = z + 16 >> 4
			let section = null
			let ret = []
			for (x = minChunkX; x <= maxChunkX; x++) {
				for (let y = minChunkY; y <= maxChunkY; y++) {
					for (z = minChunkZ; z <= maxChunkZ; z++) {
						if (y < 0) {
							ret.push(fullSection.blocks)
						} else if (this.chunks[x] && this.chunks[x][z]) {
							section = this.chunks[x][z].sections[y] || emptySection
							ret.push(section.blocks)
						} else {
							ret.push(emptySection.blocks)
						}
					}
				}
			}
			return ret
		}
		updateBlock(x, y, z, lazy) {
			let chunk = this.chunks[x >> 4] && this.chunks[x >> 4][z >> 4]
			if (chunk && chunk.buffer) {
				chunk.updateBlock(x & 15, y, z & 15, this, lazy)
			}
		}
		getWorldBlock(x, y, z) {
			if (!this.chunks[x >> 4] || !this.chunks[x >> 4][z >> 4]) {
				return blockIds.air
			}
			return this.chunks[x >> 4][z >> 4].getBlock(x & 15, y, z & 15)
		}
		getBlock(x, y, z) {
			let X = (x >> 4) + this.offsetX
			let Z = (z >> 4) + this.offsetZ
			if (y > maxHeight) {
				return blockIds.air
			} else if (y < 0) {
				return blockIds.bedrock
			} else if (X < 0 || X >= this.lwidth || Z < 0 || Z >= this.lwidth) {
				return this.getWorldBlock(x, y, z)
			}
			return this.loaded[X * this.lwidth + Z].getBlock(x & 15, y, z & 15)
		}
		setBlock(x, y, z, blockID, lazy) {
			if (!this.chunks[x >> 4] || !this.chunks[x >> 4][z >> 4]) {
				return
			}
			let chunk = this.chunks[x >> 4][z >> 4]

			let xm = x & 15
			let zm = z & 15
			if (blockID) {
				chunk.setBlock(xm, y, zm, blockID, false, !lazy)
			} else {
				chunk.deleteBlock(xm, y, zm, !lazy)
			}

			if (lazy) {
				return
			}

			//Update the 6 adjacent blocks and 1 changed block
			if (xm && xm !== 15 && zm && zm !== 15) {
				chunk.updateBlock(xm - 1, y, zm, this, lazy)
				chunk.updateBlock(xm + 1, y, zm, this, lazy)
				chunk.updateBlock(xm, y - 1, zm, this, lazy)
				chunk.updateBlock(xm, y + 1, zm, this, lazy)
				chunk.updateBlock(xm, y, zm - 1, this, lazy)
				chunk.updateBlock(xm, y, zm + 1, this, lazy)
			}
			else {
				this.updateBlock(x - 1, y, z, lazy)
				this.updateBlock(x + 1, y, z, lazy)
				this.updateBlock(x, y - 1, z, lazy)
				this.updateBlock(x, y + 1, z, lazy)
				this.updateBlock(x, y, z - 1, lazy)
				this.updateBlock(x, y, z + 1, lazy)
			}

			chunk.updateBlock(xm, y, zm, this, lazy)

			// Update the corner chunks so shadows in adjacent chunks update correctly
			if (xm | zm === 0) { this.updateBlock(x - 1, y, z - 1, lazy); }
			if (xm === 15 && zm === 0) { this.updateBlock(x + 1, y, z - 1, lazy); }
			if (xm === 0 && zm === 15) { this.updateBlock(x - 1, y, z + 1, lazy); }
			if (xm & zm === 15) { this.updateBlock(x + 1, y, z + 1, lazy); }
		}
		spawnBlock(x, y, z, blockID) {
			//Sets a block anywhere without causing block updates around it. Only to be used in world gen.

			let chunkX = x >> 4
			let chunkZ = z >> 4
			if (!this.chunks[chunkX]) {
				this.chunks[chunkX] = []
			}
			let chunk = this.chunks[chunkX][chunkZ]
			if (!chunk) {
				chunk = new Chunk(chunkX * 16, chunkZ * 16)
				this.chunks[chunkX][chunkZ] = chunk
			}
			if (chunk.buffer) {
				//Only used if spawning a block post-gen
				this.setBlock(x, y, z, blockID, true)
			} else if (!chunk.getBlock(x & 15, y, z & 15)) {
				chunk.setBlock(x & 15, y, z & 15, blockID, false)
			}
		}
		tick() {
			let tickStart = win.performance.now()
			let maxChunkX = (p.x >> 4) + settings.renderDistance
			let maxChunkZ = (p.z >> 4) + settings.renderDistance
			let chunk = maxChunkX + "," + maxChunkZ
			if (chunk !== this.lastChunk) {
				this.lastChunk = chunk
				this.loadChunks()
				this.chunkGenQueue.sort(sortChunks)
			}

			if (Key.leftMouse && !Key.control && p.lastBreak < Date.now() - 250 && screen === "play") {
				changeWorldBlock(0)
			}
			if ((Key.rightMouse || Key.leftMouse && Key.control) && p.lastPlace < Date.now() - 250) {
				newWorldBlock()
			}
			if (Key.leftMouse && p.autoBreak && !Key.control) {
				changeWorldBlock(0)
			}

			for (let i = 0; i < this.sortedChunks.length; i++) {
				this.sortedChunks[i].tick()
			}

			do {
				let doneWork = false
				debug.start = performance.now()
				if (this.meshQueue.length) {
					// Update all chunk meshes.
					let len = this.meshQueue.length - 1
					do {
						this.meshQueue.pop().genMesh()
					} while(this.meshQueue.length)
					doneWork = true
					debug("Meshes")
				}

				if (this.generateQueue.length && !doneWork) {
					let chunk = this.generateQueue.pop()
					this.genChunk(chunk)
					doneWork = true
				}
				if (this.populateQueue.length && !doneWork) {
					let chunk = this.populateQueue[this.populateQueue.length - 1]
					if (!chunk.caves) {
						chunk.carveCaves()
						debug("Carve caves")
					} else if (!chunk.populated) {
						chunk.populate()
						this.populateQueue.pop()
					}
					doneWork = true
				}

				if (this.chunkGenQueue.length && !doneWork) {
					let chunk = this.chunkGenQueue[0]
					if (!fillReqs(chunk.x >> 4, chunk.z >> 4)) {}
					else if (!chunk.loaded) {
						chunk.load()
					} else if (!chunk.optimized) {
						chunk.optimize(this)
						debug("Optimize")
					} else if (!chunk.buffer) {
						chunk.genMesh()
						debug("Initial mesh")
					} else {
						this.chunkGenQueue.shift()
						generatedChunks++
					}
					doneWork = true
				}
				if (!doneWork) {
					break
				}
			} while(win.performance.now() - tickStart < 5)
		}
		render() {
			initModelView(p)
			gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

			p2.x = Math.round(p.x)
			p2.y = Math.round(p.y)
			p2.z = Math.round(p.z)

			renderedChunks = 0

			let dist = (settings.renderDistance) * 16
			if (this.chunkGenQueue.length) {
				this.chunkGenQueue.sort(sortChunks)
				let chunk = this.chunkGenQueue[0]
				dist = Math.min(dist, chunkDist(chunk))
			}
			if (dist !== fogDist) {
				if (fogDist < dist - 0.1) fogDist += (dist - fogDist) / 120
				else if (fogDist > dist + 0.1) fogDist += (dist - fogDist) / 30
				else fogDist = dist
			}
			gl.uniform3f(glCache.uPos, p.x, p.y, p.z)
			gl.uniform1f(glCache.uDist, fogDist)

			let c = this.sortedChunks
			for (let chunk of c) {
				chunk.render()
			}

			gl.uniform3f(glCache.uPos, 0, 0, 0)

			if(hitBox.pos) {
				blockOutlines = true
				blockFill = false
				block2(hitBox.pos[0], hitBox.pos[1], hitBox.pos[2], 0, p)
				blockOutlines = false
				blockFill = true
			}
		}
		loadChunks() {
			let renderDistance = settings.renderDistance + 2
			let cx = p.x >> 4
			let cz = p.z >> 4
			p.cx = cx
			p.cz = cz
			let minChunkX = cx - renderDistance
			let maxChunkX = cx + renderDistance
			let minChunkZ = cz - renderDistance
			let maxChunkZ = cz + renderDistance

			this.offsetX = -minChunkX
			this.offsetZ = -minChunkZ
			this.lwidth = renderDistance * 2 + 1
			this.chunkGenQueue.length = 0

			if (this.loaded.length > this.lwidth * this.lwidth) {
				this.loaded.length = this.lwidth * this.lwidth
			}

			let i = 0
			for (let x = minChunkX; x <= maxChunkX; x++) {
				for (let z = minChunkZ; z <= maxChunkZ; z++) {
					let chunk
					if (!this.chunks[x]) {
						this.chunks[x] = []
					}
					if (!this.chunks[x][z]) {
						chunk = new Chunk(x * 16, z * 16)
						if (maxDist(cx, cz, x, z) <= settings.renderDistance) {
							this.chunkGenQueue.push(chunk)
						}
						this.chunks[x][z] = chunk
					}
					chunk = this.chunks[x][z]
					if (!chunk.buffer && !this.chunkGenQueue.includes(chunk) && maxDist(cx, cz, x, z) <= settings.renderDistance) {
						this.chunkGenQueue.push(chunk)
					}
					this.loaded[i++] = chunk
				}
			}
			this.sortedChunks = this.loaded.filter(renderFilter)
			this.sortedChunks.sort(sortChunks)
		}
		getSaveString() {
			let edited = []
			for (let x in this.chunks) {
				for (let z in this.chunks[x]) {
					let chunk = this.chunks[x][z]
					if (chunk.edited) {
						for (let y = 0; y < chunk.sections.length; y++) {
							if (chunk.sections[y].edited) {
								edited.push([ chunk.sections[y], chunk.cleanSections[y] ])
							}
						}
					}
				}
			}

			let pallete = {}
			for (let chunks of edited) {
				let changes = false
				chunks[0].blocks.forEach((id, i) => {
					if (id !== chunks[1][i]) {
						pallete[id] = true
						changes = true
					}
				})
				if (!changes) {
					chunks[0].edited = false
				}
			}

			let blocks = Object.keys(pallete).map(n => Number(n))
			pallete = {}
			blocks.forEach((block, index) => pallete[block] = index)

			let rnd = Math.round
			let options = p.flying | superflat << 1 | p.spectator << 2 | caves << 3 | trees << 4

			let str = world.name + ";" + worldSeed.toString(36) + ";"
				+ rnd(p.x).toString(36) + "," + rnd(p.y).toString(36) + "," + rnd(p.z).toString(36) + ","
				+ (p.rx * 100 | 0).toString(36) + "," + (p.ry * 100 | 0).toString(36) + "," + options.toString(36) + ";"
				+ version + ";"
				+ blocks.map(b => b.toString(36)).join(",") + ";"

			for (let i = 0; i < edited.length; i++) {
				if (!edited[i][0].edited) {
					continue
				}
				let real = edited[i][0]
				let blocks = real.blocks
				let original = edited[i][1]
				str += (real.x / 16).toString(36) + "," + (real.y / 16).toString(36) + "," + (real.z / 16).toString(36) + ","
				for (let j = 0; j < original.length; j++) {
					if (blocks[j] !== original[j]) {
						str += (pallete[blocks[j]] << 12 | j).toString(36) + ","
					}
				}
				str = str.substr(0, str.length - 1); //Remove trailing comma
				str += ";"
			}
			if (str.match(/;$/)) str = str.substr(0, str.length - 1)
			return str
		}
		loadSave(str) {
			let data = str.split(";")
			if (!str.includes("Alpha")) {
				return this.loadOldSave(str)
			}

			this.name = data.shift()
			worldSeed = parseInt(data.shift(), 36)
			seedHash(worldSeed)
			caveNoise = openSimplexNoise(worldSeed)
			noiseSeed(worldSeed)

			let playerData = data.shift().split(",")
			p.x = parseInt(playerData[0], 36)
			p.y = parseInt(playerData[1], 36)
			p.z = parseInt(playerData[2], 36)
			p.rx = parseInt(playerData[3], 36) / 100
			p.ry = parseInt(playerData[4], 36) / 100
			let options = parseInt(playerData[5], 36)
			p.flying = options & 1
			p.spectator = options >> 2 & 1
			superflat = options >> 1 & 1
			caves = options >> 3 & 1
			trees = options >> 4 & 1

			let version = data.shift()
			this.version = version

			// if (version.split(" ")[1].split(".").join("") < 70) {
			// 	alert("This save code is for an older version. 0.7.0 or later is needed")
			// }

			let pallete = data.shift().split(",").map(n => parseInt(n, 36))
			this.loadFrom = []

			for (let i = 0; data.length; i++) {
				let blocks = data.shift().split(",")
				this.loadFrom.push({
					x: parseInt(blocks.shift(), 36),
					y: parseInt(blocks.shift(), 36),
					z: parseInt(blocks.shift(), 36),
					blocks: [],
				})
				for (let j = 0; j < blocks.length; j++) {
					let block = parseInt(blocks[j], 36)
					let index = block & 0xffffff
					let pid = block >> 12
					this.loadFrom[i].blocks[index] = pallete[pid]
				}
			}
		}
		loadOldSave(str) {
			let data = str.split(";");
			worldSeed = parseInt(data.shift(), 36);
			this.id = Date.now()
			this.name = "Old World " + (Math.random() * 1000 | 0)
			seedHash(worldSeed);
			caveNoise = openSimplexNoise(worldSeed);
			noiseSeed(worldSeed);
			let playerData = data.shift().split(",");
			p.x = parseInt(playerData[0], 36);
			p.y = parseInt(playerData[1], 36);
			p.z = parseInt(playerData[2], 36);
			p.rx = parseInt(playerData[3], 36) / 100;
			p.ry = parseInt(playerData[4], 36) / 100;
			let editCount = parseInt(data.shift(), 36);

			this.loadFrom = [];

			let coords = data.shift().split(",").map(function(n) {
				return parseInt(n, 36);
			});
			for (let j = 0; j < coords.length; j += 3) {
				this.loadFrom.push({
					x: coords[j],
					y: coords[j + 1],
					z: coords[j + 2],
					blocks: [],
				})
			}

			for (let i = 0; data.length > 0; i++) {
				let blocks = data.shift().split(",");
				for (let j = 0; j < blocks.length; j++) {
					let block = parseInt(blocks[j], 36);
					let index = block >> 8;
					let id = block & 0x7f | (block & 0x80) << 1;
					this.loadFrom[i].blocks[index] = id;
				}
			}
		}
	}

	let defineWorld = function() {
		let tickStart = win.performance.now()
		world.tick()
		analytics.totalTickTime += win.performance.now() - tickStart
		let renderStart = win.performance.now()
		world.render()
		analytics.totalRenderTime += win.performance.now() - renderStart
	}
