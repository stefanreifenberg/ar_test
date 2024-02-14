<script>
  import { T } from '@threlte/core'
  import { Grid } from '@threlte/extras'
  import { createRatk } from '../ratk'
  import Planes from './Planes.svelte';
  import Meshes from './Meshes.svelte';

  createRatk()

</script>

<Meshes />
<!-- <Planes /> -->


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
