import { type Component } from 'jails-js/types'

export default function appGallery({ main, on, state, publish }: Component) {
	
	main(() => {
		on('click', 'a', onclick)
		on('modal:close', onmodalclose)
	})

	const onclick = (e) => {
		const image = e.delegateTarget.href
		state.set({ image })
			.then(() => publish('modal:open/gallery'))
		e.preventDefault()
	}

	const onmodalclose = () => {
		state.set({ image: '' })
	}
}

export const model = {
	image : ''
}