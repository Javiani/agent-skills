# channel

Exchange events between windows or iframes.

`Channel({ target = null, accept = [], origin = location.origin })` returns `on(name, callback)`, `emit(event, ...payload)`, and `remove(name)`. `target` can be a Window or iframe; sending uses `target.contentWindow || target`.

```js
import { Channel } from 'jails.stdlib/channel'

const channel = Channel({
    target: document.querySelector('#remote-frame'),
    accept: ['https://remote.example'],
    origin: 'https://remote.example'
})
channel.on('ready', (data) => console.log(data))
channel.emit('configure', { theme: 'dark' })
```

`origin` is the `postMessage` destination; `accept` lists incoming origins. Inside an iframe, use `target: window.parent` and the parent’s origin. Messages have the shape `{ event, payload: [...] }`; callbacks receive the payload items as arguments. There is one callback per name; another `on` replaces the previous callback. The method is `emit`, not `send`.

The global listener neither checks `e.source` nor validates the message shape. Unaccepted origins cause the listener to throw an object. Avoid `accept: ['*']` in real applications and validate payloads. `remove` deletes a handler but leaves the global listener attached; there is no dispose method. Create long-lived instances instead of recreating them on every mount.

## Sources

Based on the review of `src/channel/index.ts`, `index.js`, `index.d.ts`, and `src/channel/README.md` in the jails.stdlib 2.2.3 repository. Installed dependency files were also inspected for dependency aliases; confirm the version in the consuming project.
