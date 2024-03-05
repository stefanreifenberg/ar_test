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
       
        const [object] = objects

        if (!object) {
            enabled = false
            return
        }

        console.log("object", object)

        group.position.set(object.position.x, object.position.y, object.position.z)
		group.lookAt(0, 0, 0)
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

            // create an anchor
            console.log('creating anchor')
          
            console.log("ratk.anchors length",ratk.anchors.length)

            // if there are more than 7 anchors delete the first one
            if(ratk.anchors.length > 7) {
                console.log("deleting anchor")
                ratk.deleteAnchor(ratk.anchors[0])
            }

            ratk.createAnchor(anchorPosition, anchorQuaternion, true)
                .then((anchor /* RATK Anchor object extends Object3D */) => {
                    buildAnchorMarker(anchor, false);
                });
        }
        pendingAnchorsData = null
        ratk.update()
  })
   

</script>

{#each objects as object}
	<T is={object} visible={true}/>
{/each}

{#if enabled}
	<T is={group}>
		<slot />
	</T>
{/if}

{#if anchors}
    {#each anchors as anchor, index (index)}
    <T is={anchor} visible={true}/>
    {/each}
{/if}

