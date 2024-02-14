<script>
    import { T } from '@threlte/core'
    import { useHitTest } from '@threlte/xr'

    let ref
    useHitTest((hitMatrix, hit) => {
      if (!ref) return
    
      if (hit) {
        ref.visible = true
        ref.matrix.copy(hitMatrix)
      } else {
        ref.visible = false
      }
    })
</script>

<T.Mesh bind:ref>
    <T.SphereGeometry args={[0.1]} />
    <T.MeshBasicMaterial />
</T.Mesh>