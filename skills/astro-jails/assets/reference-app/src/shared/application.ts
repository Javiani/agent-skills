import { type Component } from 'jails-js/types'

export default function appMain({ main, on, publish }: Component) {

	main(() => {
		on('click', '[data-modal-open]', open)
		on('click', 'a:not([target])', onunload)
		window.addEventListener('pageshow', onbackbutton)
	})

	const open = (e) => {
		const { modalOpen: name } = e.delegateTarget.dataset
		publish( `modal:open/${name}` )
	}

	const onunload = (e) => {
		e.preventDefault()
		const url = e.delegateTarget.href	
		document.body.classList.add('loading')
		setTimeout(() => location.href = url, 200)
	}

	const onbackbutton = (e) => {
		setTimeout(() => {
			document.body.classList.remove('loading')
		}, 200)
	}
}