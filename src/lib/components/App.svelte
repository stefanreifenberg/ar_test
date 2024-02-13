<script>
  import { Canvas } from '@threlte/core'
  import Scene from './Scene.svelte'
  import { ARButton } from '@threlte/xr'
  import XR from '$lib/components/XR.svelte'
  


  
</script>

<Canvas>
  <Scene />
  <XR>
    <slot />
  </XR>
</Canvas>

<ARButton
	sessionInit={{
		requiredFeatures: ['hit-test', 'plane-detection', 'mesh-detection', 'anchors']
	}}
/>