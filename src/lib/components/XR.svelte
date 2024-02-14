<script lang="ts">
	import * as THREE from 'three'
	import { T } from '@threlte/core'
	import { OrbitControls } from '@threlte/extras'
	import { XR, Controller, Hand, useHitTest } from '@threlte/xr'
  
	const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05)
  
	let meshes: THREE.Mesh[] = []
	let cursors = { left: undefined! as THREE.Mesh, right: undefined! as THREE.Mesh }
  
	const hands = ['left', 'right'] as const
	type Hands = (typeof hands)[number]
  
	const handleSelect = (hand: Hands) => () => {
	  if (!cursors[hand].visible) return
  
	  const material = new THREE.MeshBasicMaterial({
		//color: isRecovered ? 0xff0000 : 0x00ff00,
		color: 0x00ff00,
	});
	  const mesh = new THREE.Mesh(geometry, material)
	  cursors[hand].matrix.decompose(mesh.position, mesh.quaternion, mesh.scale)
	  //mesh.scale.y = Math.random() * 2 + 1
	  meshes.push(mesh)
	  meshes = meshes
	}
  
	const handleHitTest =
	  (hand: Hands) => (hitMatrix: THREE.Matrix4, hit: XRHitTestResult | undefined) => {
		if (!cursors[hand]) return
  
		if (hit) {
		  cursors[hand].visible = true
		  cursors[hand].matrix.copy(hitMatrix)
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
