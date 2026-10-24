import { type Component } from 'jails-js/types'

export default function appNavigation ({ main, elm, on } : Component) {
	
	const links = elm.querySelectorAll('a')

	main(() => {
		on('click', '[data-nav-link] a', onclick)
	})

	const onclick = (e) => {
		links.forEach( (link) => link.classList.remove('bg-orange-500') )
		e.delegateTarget.classList.add('bg-orange-500')
	}
}