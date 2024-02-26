<script>
    import { pendingAnchorStoreData } from '$lib/store.js'
    import * as THREE from 'three'
	import { T,useThrelte } from '@threlte/core'
	import { useRatk } from '$lib/ratk.js'

	const ratk = useRatk()

    $: pendingAnchorsData = $pendingAnchorStoreData
    $: console.log('pendingAnchorsData anchors.svelte', pendingAnchorsData)

    // check if the pendingAnchorsData is not null
    $: if (pendingAnchorsData) {
        const isPersistent = true
        const isRecovered = false

        const anchorPosition = new THREE.Vector3(1, 2, 3);
        const anchorQuaternion = new THREE.Quaternion(0, 0, 0, 1);

        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        // create an anchor

        ratk.createAnchor(anchorPosition, anchorQuaternion, isPersistent)
            .then((anchor /* RATK Anchor object extends Object3D */) => {

                console.log('anchor', anchor)

                // Attach a new THREE.Mesh to the anchor
                anchor.add(new THREE.Mesh(geometry, material));
            });
    }

</script>

