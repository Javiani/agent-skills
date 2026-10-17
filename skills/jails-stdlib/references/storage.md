# storage

Persist JSON data locally or for a session.

`storage.local` and `storage.session` expose `set(name, data)`, `get(name)`, and `remove(name)`. `set` serializes JSON and returns the original data; `remove` returns the value read before deletion.

```js
import { storage } from 'jails.stdlib/storage'

storage.local.set('preferences', { theme: 'dark' })
const preferences = storage.local.get('preferences')
const removed = storage.session.remove('draft')
```

A missing key returns `null`. Invalid JSON returns `null` in `local.get`, but the original string in `session.get`. Writes, storage access, and serialization may throw. There is no expiration, encryption, or component synchronization. Do not destructure `remove`: it uses `this.get`. Uses browser globals; do not access it during SSR.

## Sources

Based on the review of `src/storage/index.ts`, `index.js`, `index.d.ts`, and `src/storage/README.md` in the jails.stdlib 2.2.3 repository. Installed dependency files were also inspected for dependency aliases; confirm the version in the consuming project.
