import { getContext, setContext } from 'svelte'
import * as THREE from 'three'
import { RealityAccelerator } from 'ratk'
import { useThrelte, useTask } from '@threlte/core'
import { pendingAnchorStoreData } from '$lib/store.js'
import { get } from 'svelte/store'

const key = Symbol('ratk')

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

export const createRatk = () => {
	const { renderer } = useThrelte()
	const ratk = new RealityAccelerator(renderer.xr)
	renderer.xr.addEventListener('sessionstart', () => {
		console.log('sessionstart')
		// setTimeout(() => {
		// 	ratk.restorePersistentAnchors().then(() => {
		// 		// if there are more than seven anchors, remove all of them
		// 		ratk.anchors.forEach((anchor) => {
		// 			buildAnchorMarker(anchor, true);
		// 		});
		// 	});
		// }, 1000);
		setTimeout(() => {
			if (ratk.planes.size == 0) {
				renderer.xr.getSession().initiateRoomCapture();
			}
		}, 5000);
	});
	console.log('createRatk')
	useTask(() => ratk.update())
	setContext(key, ratk)
}

export const useRatk = () => {
	return getContext(key)
}
