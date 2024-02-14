import { getContext, setContext } from 'svelte'
import { RealityAccelerator } from 'ratk'
import { useThrelte, useTask } from '@threlte/core'

const key = Symbol('ratk')

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
		setTimeout(() => {
			console.log("ratk.meshes.size",ratk.meshes.size)
			if (ratk.meshes.size == 0) {
				renderer.xr.getSession().initiateRoomCapture();
			} 
		}, 5000);
	});
	useTask(() => ratk.update())
	setContext(key, ratk)
}

export const useRatk = () => {
	return getContext(key)
}