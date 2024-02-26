import { getContext, setContext } from 'svelte'
import * as THREE from 'three'
import { RealityAccelerator } from 'ratk'
import { useThrelte, useTask } from '@threlte/core'
import { pendingAnchorStoreData } from '$lib/store.js'
import { get } from 'svelte/store'

export function getCountValue() {
    let value;
    pendingAnchorStoreData.subscribe(val => {
        value = val;
    });
    return value;
}

const key = Symbol('ratk')

function buildAnchorMarker(anchor, isRecovered) {
	const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
	const material = new THREE.MeshBasicMaterial({
		color: 0xff0000
	});
	const cube = new THREE.Mesh(geometry, material);
	anchor.add(cube);
	console.log(
		`anchor created (id: ${anchor.anchorID}, isPersistent: ${anchor.isPersistent}, isRecovered: ${isRecovered})`,
	);
}

function handlePendingAnchors() {
	console.log('handlePendingAnchors')
	console.log("getCountValue()",getCountValue())
	if (getCountValue() !== null) {

		console.log("handlePendingAnchors")
		console.log('pendingAnchorStoreData', $pendingAnchorStoreData)
		// ratk
		// 	.createAnchor(
		// 		pendingAnchorData.position,
		// 		pendingAnchorData.quaternion,
		// 		true,
		// 	)
		// 	.then((anchor) => {
		// 		buildAnchorMarker(anchor, false);
		// 	});
		// pendingAnchorData = null;
	}
}

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
	useTask(() => ratk.update(), handlePendingAnchors())
	setContext(key, ratk)
}

export const useRatk = () => {
	return getContext(key)
}
