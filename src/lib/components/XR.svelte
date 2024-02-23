<script>
	import * as THREE from 'three'
	import { T,useTask } from '@threlte/core'
	import { OrbitControls } from '@threlte/extras'
	import { XR, Controller, Hand, useHitTest } from '@threlte/xr'
	import { useRatk } from '$lib/ratk.js'
	import { pendingAnchorStoreData } from '$lib/store.js'

	const ratk = useRatk()
	let pendingAnchorsData = null
  
	const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05)
  
	let meshes = []
	let cursors = { left: THREE.Mesh, right: THREE.Mesh }
  
	const hands = ['left', 'right']
	//type Hands = (typeof hands)[number]
  
	const handleSelect = (hand) => () => {
	  if (!cursors[hand].visible) return

	  console.log('pendingAnchorsData', pendingAnchorsData)

	  

	  if (pendingAnchorsData) {

		const isPersistent = true
	  	const isRecovered = false

		const anchorPosition = new THREE.Vector3(1, 2, 3);
		const anchorQuaternion = new THREE.Quaternion(0, 0, 0, 1);

		// set pendingAnchorsData to pendingAnchorStoreData 
		pendingAnchorStoreData.set(pendingAnchorsData)

		} 
	
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
