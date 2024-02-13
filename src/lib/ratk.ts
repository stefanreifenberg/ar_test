import { getContext, setContext } from 'svelte'
import { RealityAccelerator } from 'ratk'
import { useThrelte, useTask } from '@threlte/core'

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