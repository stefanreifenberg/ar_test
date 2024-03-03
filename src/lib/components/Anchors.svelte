<script>
    import { pendingAnchorStoreData } from '$lib/store.js'
    import * as THREE from 'three'
	import { T,useTask } from '@threlte/core'
	import { useRatk } from '$lib/ratk.js'
    import { onMount } from 'svelte'
    import { useXR } from '@threlte/xr'

    const { isPresenting } = useXR()

    const vec3 = new THREE.Vector3()

    $: console.log("isPresenting", $isPresenting)

	const ratk = useRatk()
    let anchors = []

    $: console.log("anchors", anchors)

    $: pendingAnchorsData = $pendingAnchorStoreData

    function buildAnchorMarker(anchor, isRecovered) {
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const material = new THREE.MeshBasicMaterial({
            //color: isRecovered ? 0xff0000 : 0x00ff00,
            color: 0x00ff00,
        });
        const cube = new THREE.Mesh(geometry, material);
        anchor.add(cube);
        //anchors = [...ratk.anchors]
        anchors.push(anchor)
        anchors = anchors
        //console.log("anchors", anchors)
        // console.log(
        //     `anchor created (id: ${anchor.anchorID}, isPersistent: ${anchor.isPersistent}, isRecovered: ${isRecovered})`,
        // );
    }

    let anchorsLoaded = false
   
    $: if(anchorsLoaded) {
        console.log("all anchors loaded")
        //start()
        stop()
    }

    const { start, stop } = useTask((delta) => {
    // do something
      if($isPresenting && !anchorsLoaded) {
        console.log("initilizing persistent anchors")
        ratk.restorePersistentAnchors().then(() => {
                    // if there are more than seven anchors, remove all of them
                    console.log("ratk.anchors",ratk.anchors)
                    ratk.anchors.forEach((anchor) => {
                        buildAnchorMarker(anchor, true);
                    });
                    anchorsLoaded = true
                });
      }
       
    }, { autoStart: true })

    useTask((delta) => {

       

        // if (pendingAnchorsData) {
        //     const isPersistent = true
        //     let anchorPosition
        //     let anchorQuaternion
            
        //     const matrix = pendingAnchorsData
        //     const position = new THREE.Vector3()
        //     const quaternion = new THREE.Quaternion()
        //     const scale = new THREE.Vector3()
        //     matrix.decompose(position, quaternion, scale)
        //     anchorPosition = position
        //     anchorQuaternion = quaternion

        //     const geometry = new THREE.BoxGeometry(1, 1, 1);
        //     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        //     // create an anchor
        //     console.log('creating anchor')
        //     console.log("ratk",ratk)
        //     console.log("ratk.anchors",ratk.anchors)

        //     ratk.createAnchor(anchorPosition, anchorQuaternion, false)
        //         .then((anchor /* RATK Anchor object extends Object3D */) => {

        //             console.log('anchor', anchor)

        //             // Attach a new THREE.Mesh to the anchor
        //             anchor.add(new THREE.Mesh(geometry, material));
        //             anchors = [...ratk.anchors]
        //         });
        // }
        // pendingAnchorsData = null
  })
   

</script>

<!-- {#each anchors as anchor}
    
	<T is={anchor} visible={true} />
{/each} -->

{#each anchors as anchor, index (index)}
  <T is={anchor} />
{/each}

