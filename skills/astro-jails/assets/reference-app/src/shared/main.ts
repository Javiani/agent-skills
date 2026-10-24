
import { register, start } from 'jails-js'
import * as appMain from 'shared/application'

export { register, start }

register('app-main', appMain)

document.addEventListener('DOMContentLoaded', (e) => {
	start()
})