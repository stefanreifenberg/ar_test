<script>
  import { T, useThrelte } from '@threlte/core'
  import { ContactShadows, Float, Grid, OrbitControls } from '@threlte/extras'
  import { ARButton, RealityAccelerator } from 'ratk';
  import { onMount } from 'svelte';

  const { renderer } = useThrelte()
  let arButton;

  onMount(() => {
    arButton = document.getElementById('ar-button');
    console.log(arButton);
  });


ARButton.convertToARButton(arButton, renderer, {
  sessionInit: {
    requiredFeatures: ['hit-test', 'plane-detection', 'mesh-detection', 'anchors'],
    optionalFeatures: [],
  },
});
</script>


<T.PerspectiveCamera
  makeDefault
  position={[-10, 10, 10]}
  fov={15}
>
  <OrbitControls
    enableZoom={true}
    enableDamping
    target.y={1.5}
  />
</T.PerspectiveCamera>

<T.DirectionalLight
  intensity={0.8}
  position.x={5}
  position.y={10}
/>
<T.AmbientLight intensity={0.2} />

<Grid
  position.y={-0.001}
  cellColor="#ffffff"
  sectionColor="#ffffff"
  sectionThickness={0}
  fadeDistance={25}
  cellSize={2}
/>
