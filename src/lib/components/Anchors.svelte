<script>
    import { pendingAnchorStoreData } from '$lib/store.js'
    import * as THREE from 'three'
	import { T,useTask } from '@threlte/core'
	import { useRatk } from '$lib/ratk.js'

	const ratk = useRatk()
    let anchors = []

    $: pendingAnchorsData = $pendingAnchorStoreData
    $: console.log('pendingAnchorsData anchors.svelte', pendingAnchorsData)

    useTask((delta) => {

        if (pendingAnchorsData) {
            const isPersistent = true
            let anchorPosition
            let anchorQuaternion
            
            const matrix = pendingAnchorsData
            const position = new THREE.Vector3()
            const quaternion = new THREE.Quaternion()
            const scale = new THREE.Vector3()
            matrix.decompose(position, quaternion, scale)
            anchorPosition = position
            anchorQuaternion = quaternion

            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

            // create an anchor
            console.log('creating anchor')
            console.log("ratk",ratk)
            console.log("ratk.anchors",ratk.anchors)

            ratk.createAnchor(anchorPosition, anchorQuaternion, isPersistent)
                .then((anchor /* RATK Anchor object extends Object3D */) => {

                    console.log('anchor', anchor)

                    // Attach a new THREE.Mesh to the anchor
                    anchor.add(new THREE.Mesh(geometry, material));
                    anchors = [...ratk.anchors]
                });
        }
        pendingAnchorsData = null
  })
    // check if the pendingAnchorsData is not null
   

</script>

{#each anchors as anchor}
	<T is={anchor} visible={true} />
{/each}

