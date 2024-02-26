import { getContext, setContext } from 'svelte'
import * as THREE from 'three'
import { RealityAccelerator } from 'ratk'
import { useThrelte, useTask } from '@threlte/core'
import { pendingAnchorStoreData } from '$lib/store.js'
import { get } from 'svelte/store'

export const createRatk = () => {
	const { renderer } = useThrelte()
	const ratk = new RealityAccelerator(renderer.xr)
	renderer.xr.addEventListener('sessionstart', () => {
		console.log('sessionstart')
		setTimeout(() => {
			ratk.restorePersistentAnchors().then(() => {
				ratk.anchors.forEach((anchor) => {
					buildAnchorMarker(anchor, true);
				});
			});
		}, 1000);
	});
	console.log('createRatk')
	useTask(() => ratk.update())
	setContext(key, ratk)
}

export const useRatk = () => {
	return getContext(key)
}
