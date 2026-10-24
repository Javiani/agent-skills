import { type Component } from 'jails-js/types'

export default function appModal({ main, state, on, emit, elm, subscribe }: Component) {

	const modalName = elm.dataset.modalName
	
	main(() => {
		on('click', '[data-modal-close]', close )
		on('click', outsideclose)
		on('keydown', escClose)
		subscribe(`modal:open/${modalName}`, open)
	})

	const open = () => {
		state.set({ open: true })
		window.addEventListener('keydown', escClose)
	}

	const close = () => {
		const name = modalName
		state.set({ open: false })
		window.removeEventListener('keydown', escClose)
		emit('modal:close', { name })
	}

	const outsideclose = (e) => {
		if( e.target === elm ) {
			state.set({ open: false })
		}
	}

	const escClose = (e) => {
		if( e.keyCode === 27 ) {
			close()
		}
	}
}

export const model = {
	open: false
}