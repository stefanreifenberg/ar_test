<script>
    import { pendingAnchorStoreData } from '$lib/store.js'
    import * as THREE from 'three'
	import { T,useThrelte } from '@threlte/core'
	import { useRatk } from '$lib/ratk.js'

	const ratk = useRatk()

    $: pendingAnchorsData = $pendingAnchorStoreData
    $: console.log('pendingAnchorsData anchors.svelte', pendingAnchorsData)
</script>

