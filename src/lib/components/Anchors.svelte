<script>
    import { pendingAnchorStoreData } from '$lib/store.js'
    import * as THREE from 'three'
	import { T,useTask } from '@threlte/core'
	import { useRatk } from '$lib/ratk.js'
    import { onMount } from 'svelte'

	const ratk = useRatk()
    let anchors = []

    $: console.log("anchors", anchors)

    $: pendingAnchorsData = $pendingAnchorStoreData

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
    onMount(() => {
        console.log("starting task")
        start()
        stop()
    })
    const { start, stop, started, task: someTask } = useTask('some-task',(delta) => {
    // do something
       console.log("initilizing persistent anchors")
        ratk.restorePersistentAnchors().then(() => {
                    // if there are more than seven anchors, remove all of them
                    ratk.anchors.forEach((anchor) => {
                        buildAnchorMarker(anchor, true);
                    });
                });
    }, { autoStart: false })

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
   

</script>

{#each anchors as anchor}
	<T is={anchor} visible={true} />
{/each}

