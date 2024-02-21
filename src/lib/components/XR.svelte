<script>
	import * as THREE from 'three'
	import { T } from '@threlte/core'
	import { OrbitControls } from '@threlte/extras'
	import { XR, Controller, Hand, useHitTest } from '@threlte/xr'
	import { useRatk } from '$lib/ratk.js'

	const ratk = useRatk()
	let pendingAnchorsData = null

	function buildAnchorMarker(anchor, isRecovered) {
		const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
		const material = new THREE.MeshBasicMaterial({
			color: isRecovered ? 0xff0000 : 0x00ff00,
		});
		const cube = new THREE.Mesh(geometry, material);
		anchor.add(cube);
		console.log(
			`anchor created (id: ${anchor.anchorID}, isPersistent: ${anchor.isPersistent}, isRecovered: ${isRecovered})`,
		);
	}
  
	const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05)
  
	let meshes = []
	let cursors = { left: THREE.Mesh, right: THREE.Mesh }
  
	const hands = ['left', 'right']
	//type Hands = (typeof hands)[number]
  
	const handleSelect = (hand) => () => {
	  if (!cursors[hand].visible) return

	  console.log('pendingAnchorsData', pendingAnchorsData)

	  const isPersistent = true
	  const isRecovered = false

	  if (pendingAnchorsData) {

		
		const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() })
		const mesh = new THREE.Mesh(geometry, material)
		cursors[hand].matrix.decompose(mesh.position, mesh.quaternion, mesh.scale)

		// get the mesh position and quaternion
		// and create an anchor with it
		// ratk.createAnchor(mesh.position, mesh.quaternion, isPersistent, isRecovered)

		console.log(mesh)


		// ratk
		// 	.createAnchor(
		// 		mesh.position,
		// 		mesh.quaternion,
		// 		true,
		// 	)
		// 	.then((anchor) => {
		// 		buildAnchorMarker(anchor, false);
		// 	});
		// 	pendingAnchorsData = null;
	}

	//   const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
	// 	const material = new THREE.MeshBasicMaterial({
	// 		color: isRecovered ? 0xff0000 : 0x00ff00,
	// 	});
	// 	const cube = new THREE.Mesh(geometry, material);
	// 	//anchor.add(cube);
	// 	meshes.push(cube)
	// 	meshes = meshes

	// 	// console.log(
	// 	// 	`anchor created (id: ${anchor.anchorID}, isPersistent: ${anchor.isPersistent}, isRecovered: ${isRecovered})`,
	// 	// );
	// 	console.log('ratk.anchors', ratk.anchors)

	  //const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() })
	  //const mesh = new THREE.Mesh(geometry, material)
	  //cursors[hand].matrix.decompose(mesh.position, mesh.quaternion, mesh.scale)
	  //console.log('mesh', mesh)
	  //mesh.scale.y = Math.random() * 2 + 1
	 // meshes.push(mesh)
	 // meshes = meshes
	  
	 
	  
	
	}
  
	const handleHitTest =
	  (hand) => (hitMatrix, hit) => {
		if (!cursors[hand]) return
  
		if (hit) {
		  cursors[hand].visible = true
		  cursors[hand].matrix.copy(hitMatrix)

		  pendingAnchorsData = {
			position: cursors[hand].matrix,
			quaternion: cursors[hand].matrix,
		  };
		} else {
		  cursors[hand].visible = false
		}
	  }
  
	useHitTest(handleHitTest('left'), { source: 'leftInput' })
	useHitTest(handleHitTest('right'), { source: 'rightInput' })
  </script>

<XR frameRate={72}>
	<T.PerspectiveCamera slot="fallback" makeDefault position={[0, 0, 5]}>
		<OrbitControls />
	</T.PerspectiveCamera>

	{#each hands as hand}
    <Controller
      {hand}
      on:select={handleSelect(hand)}
    />
    <Hand
      {hand}
      on:pinchend={handleSelect(hand)}
    />
  {/each}

	<slot />
</XR>


<T.Mesh
  bind:ref={cursors.left}
  matrixAutoUpdate={false}
>
	<T.SphereGeometry
	args={[0.05]}
	/>
	<T.MeshBasicMaterial transparent opacity={0.5}/>
</T.Mesh>

<T.Mesh
  bind:ref={cursors.right}
  matrixAutoUpdate={false}
>
  <T.SphereGeometry
    args={[0.05]}
  />
  <T.MeshBasicMaterial transparent opacity={0.5}/>
</T.Mesh>

<T.HemisphereLight
  args={[0xffffff, 0xbbbbff, 1]}
  position={[0.5, 1, 0.25]}
/>

<T.AmbientLight intensity={0.5} />

{#each meshes as mesh, index (index)}
  <T is={mesh} />
{/each}
