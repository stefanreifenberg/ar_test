<script lang="js">
	import * as THREE from 'three'
	import { T,useThrelte } from '@threlte/core'
	import { useRatk } from '$lib/ratk.js'
	import { Text } from '@threlte/extras'

	const ratk = useRatk()
	const group = new THREE.Group()
	

	let enabled = true
	let meshes = []
    let objects = []

	const vec3 = new THREE.Vector3()

	ratk.onMeshAdded = (mesh) => {
		meshes = [...ratk.meshes]

		for (const mesh of ratk.meshes) {
			mesh.meshMesh.material = new THREE.MeshBasicMaterial({
                wireframe: true,
                color: Math.random() * 0xffffff,
            });

			mesh.geometry.computeBoundingBox();
		}

		objects.splice(0, objects.length)

		for (const mesh of ratk.meshes) {
			if (mesh.meshMesh === undefined) {
				continue
			}

			objects.push(mesh)
		}

		objects = objects

		const [object] = objects

		if (!object) {
			enabled = false
			return
		}

		group.position.set(object.position.x, object.position.y, object.position.z)
		group.lookAt(0, 0, 0)
		enabled = true
	}

	console.log('meshes', meshes)
	console.log('objects', objects)

	
</script>

{#each objects as object}
	<T is={object} visible={true}/>
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