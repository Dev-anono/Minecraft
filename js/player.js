	let controls = function() {
		move.x = 0
		move.z = 0
		let dt = (win.performance.now() - p.lastUpdate) / 33
		dt = dt > 2 ? 2 : dt

		if(Key.w) move.z += p.speed
		if(Key.s) move.z -= p.speed
		if(Key.a) move.x += p.speed
		if(Key.d) move.x -= p.speed
		if (p.flying) {
			if(Key[" "]) p.velocity.y += 0.06 * dt
			if(Key.shift) p.velocity.y -= 0.06 * dt
		}
		if(Key.arrowleft) p.ry -= 0.1 * dt
		if(Key.arrowright) p.ry += 0.1 * dt
		if(Key.arrowup) p.rx += 0.1 * dt
		if(Key.arrowdown) p.rx -= 0.1 * dt

		if (!p.sprinting && Key.q && !p.sneaking && Key.w) {
			p.FOV(settings.fov + 10, 250)
			p.sprinting = true
		}

		if(p.sprinting) {
			move.x *= p.sprintSpeed
			move.z *= p.sprintSpeed
		}
		if(p.flying) {
			move.x *= p.flySpeed
			move.z *= p.flySpeed
		}
		if (!move.x && !move.z) {
			if (p.sprinting) {
				p.FOV(settings.fov, 100)
			}
			p.sprinting = false
		} else if(Math.abs(move.x) > 0 && Math.abs(move.z) > 0) {
			move.x *= move.ang
			move.z *= move.ang
		}

		//Update the velocity, rather than the position.
		let co = Math.cos(p.ry)
		let si = Math.sin(p.ry)
		let friction = p.onGround ? 1 : 0.3
		p.velocity.x += (co * move.x - si * move.z) * friction * dt
		p.velocity.z += (si * move.x + co * move.z) * friction * dt

		const TAU = Math.PI * 2
		const PI1_2 = Math.PI / 2
		while(p.ry > TAU) p.ry -= TAU
		while(p.ry < 0)   p.ry += TAU
		if(p.rx > PI1_2)  p.rx = PI1_2
		if(p.rx < -PI1_2) p.rx = -PI1_2

		p.setDirection()
	}

	// Mouse sensitivity variable, used for the settings buttons and in the "mmoved" function
	let mouseS = 300
