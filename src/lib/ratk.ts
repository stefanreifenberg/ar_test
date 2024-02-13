import { getContext, setContext } from 'svelte'
import { RealityAccelerator } from 'ratk'
import { useThrelte, useTask } from '@threlte/core'
import {
	BoxGeometry,
	BufferGeometry,
	DirectionalLight,
	HemisphereLight,
	Line,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Scene,
	SphereGeometry,
	Vector3,
	WebGLRenderer,
} from 'three';
import { Text } from 'troika-three-text';

const key = Symbol('ratk')

export const createRatk = () => {
	const { renderer } = useThrelte()
	const ratk = new RealityAccelerator(renderer.xr)
	useTask(() => ratk.update())
	setContext(key, ratk)
}

export const useRatk = (): RealityAccelerator => {
	return getContext(key)
}