<script lang="js">
	import * as THREE from 'three'
	import { T,useThrelte } from '@threlte/core'
	import { useRatk } from '$lib/ratk.js'

	const ratk = useRatk()
	const group = new THREE.Group()
	

	let enabled = true
	let meshes = []

	const vec3 = new THREE.Vector3()

	ratk.onMeshAdded = (mesh) => {
		meshes = [...ratk.meshes]

		for (const mesh of ratk.meshes) {
			mesh.meshMesh.material = new THREE.MeshBasicMaterial({
                wireframe: true,
                color: Math.random() * 0xffffff,
            });

			meshMesh.geometry.computeBoundingBox();
		}

		meshes.splice(0, meshes.length)

		for (const mesh of ratk.meshes) {
			if (mesh.planeMesh === undefined) {
				continue
			}

			meshes.push(mesh)
		}

		meshes = meshes

		const [meshTest] = meshes

		if (!meshTest) {
			enabled = false
			return
		}

		group.position.set(wall.position.x, 0, wall.position.z)
		group.lookAt(0, 0, 0)
		enabled = true
	}

	
</script>

{#each meshes as mesh}
	<T is={mesh} visible={true}/>
{/each}

{#if enabled}
	<T is={group}>
		<slot />
	</T>
{/if}

{#each meshes as mesh}
	{@const size = mesh.meshMesh?.geometry.boundingBox?.getSize(vec3) ?? { x: 0, z: 0 }}
	<T is={mesh} visible={true} />
{/each}