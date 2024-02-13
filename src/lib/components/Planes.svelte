<script lang="js">
	import * as THREE from 'three'
	import { T,useThrelte } from '@threlte/core'
	import { useRatk } from '$lib/ratk.js'

	const ratk = useRatk()
	const group = new THREE.Group()
	const { renderer } = useThrelte()

	let enabled = false
	let planes = []
	let walls = []

	const vec3 = new THREE.Vector3()

	ratk.onPlaneAdded = (plane) => {
		planes = [...ratk.planes]

		renderer.xr.getSession().initiateRoomCapture();

		if (planes.size == 0) {
			
			renderer.xr.getSession().initiateRoomCapture();
		}

		for (const plane of ratk.planes) {
			if (plane.planeMesh === undefined) {
				continue
			}
			plane.planeMesh.material = new THREE.MeshBasicMaterial({
				wireframe: true,
				color: Math.random() * 0xffffff,
			});

			plane.planeMesh.geometry.computeBoundingBox()
		}

		// @ts-expect-error
		const xrPlane = plane._xrPlane

		if (xrPlane.orientation !== 'vertical') {
			return
		}

		walls.splice(0, walls.length)

		for (const plane of ratk.planes) {
			if (xrPlane.orientation !== 'vertical') {
				continue
			}

			if (plane.planeMesh === undefined) {
				continue
			}

			walls.push(plane)
		}

		walls = walls

		const [wall] = walls

		if (!wall) {
			enabled = false
			return
		}

		group.position.set(wall.position.x, 0, wall.position.z)
		group.lookAt(0, 0, 0)
		enabled = true
	}

	
</script>

{#each walls as wall}
	<T is={wall} visible={true}/>
{/each}

{#if enabled}
	<T is={group}>
		<slot />
	</T>
{/if}

{#each planes as plane}
	{@const size = plane.planeMesh?.geometry.boundingBox?.getSize(vec3) ?? { x: 0, z: 0 }}
	<T is={plane} visible={true} />
{/each}