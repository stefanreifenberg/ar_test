<script>
    import { pendingAnchorStoreData } from '$lib/store.js'
    import * as THREE from 'three'
	import { T,useTask } from '@threlte/core'
	import { useRatk } from '$lib/ratk.js'
    import { onMount } from 'svelte'
    import { useXR } from '@threlte/xr'

    const { isPresenting } = useXR()

    const vec3 = new THREE.Vector3()
    const group = new THREE.Group()

    let enabled = false

	const ratk = useRatk()
    let anchors = []
    let testAnchors = []
    let objects = []

    $: pendingAnchorsData = $pendingAnchorStoreData

    function buildAnchorMarker(anchor, isRecovered) {

        anchors = [...ratk.anchors]

        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const material = new THREE.MeshBasicMaterial({
            color: isRecovered ? 0xff0000 : 0x00ff00,
        });
        const cube = new THREE.Mesh(geometry, material);
        anchor.add(cube);

        objects.splice(0, objects.length)

        for (const anchor of ratk.anchors) {
            objects.push(anchor)
        }

        objects = objects
       //console.log("anchor objects", objects)

		const [object] = objects

        if (!object) {
			enabled = false
			return
		}
        console.log("object", object)

        group.position.set(object.position.x, object.position.y, object.position.z)
		group.lookAt(0, 0, 0)

        console.log("group", group)

        enabled = true
    }

    let anchorsLoaded = false

    $: if($isPresenting && !anchorsLoaded) {
        console.log("initilizing persistent anchors")
        ratk.restorePersistentAnchors().then(() => {
                    console.log("ratk.anchors",ratk.anchors)
                    ratk.anchors.forEach((anchor) => {
                        buildAnchorMarker(anchor, true);
                    });
                    
                });
        anchorsLoaded = true
    }
   
    // $: if(anchorsLoaded) {
    //     console.log("all anchors loaded")
    //     //start()
    //     stop()
    // }

    // const { start, stop } = useTask((delta) => {
    // // do something
    //   if($isPresenting && !anchorsLoaded) {
    //     console.log("initilizing persistent anchors")
    //     ratk.restorePersistentAnchors().then(() => {
    //                 console.log("ratk.anchors",ratk.anchors)
    //                 ratk.anchors.forEach((anchor) => {
    //                     buildAnchorMarker(anchor, true);
    //                 });
                    
    //             });
    //     anchorsLoaded = true
    //   }
    // }, { autoStart: false })

    useTask((delta) => {
        ratk.update()
  })
   

</script>

<!-- {#each objects as object}
	<T is={object} visible={true}/>
{/each} -->

{#if enabled}
	<T is={group}>
		<slot />
	</T>
{/if}

<!-- {#if anchors}
    {#each anchors as anchor, index (index)}
    <T is={anchor} visible={true}/>
    {/each}
{/if}
 -->
