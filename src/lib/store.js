// create a writable svelte store

import { writable } from 'svelte/store'

export const pendingAnchorStoreData = writable(null)
