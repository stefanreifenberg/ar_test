<script>
    import { Text } from '@threlte/extras'
    import { useReflow } from '@threlte/flex'
    import { forwardEventHandlers } from '@threlte/core'
    export let text
    export let color = '#000'
    export let z = 0
    
    export let anchorX = '50%'
    export let anchorY = '50%'
    export let fontSize = 0.11
    
    const fontUrl = '/fonts/Barlow-Regular.ttf'
    const reflow = useReflow()
  </script>
  <Text
    font={fontUrl}
    position.z={z}
    {text}
    {anchorX}
    {anchorY}
    fontSize={fontSize}
    {color}
    on:sync={reflow}
  />