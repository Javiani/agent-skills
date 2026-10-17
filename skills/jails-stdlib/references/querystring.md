# querystring

Read parameters from the current URL.

`querystring()` returns an object of strings from `location.search` using `URLSearchParams`.

```js
import { querystring } from 'jails.stdlib/querystring'

const { search = '', page = '1' } = querystring()
```

It does not accept a parameter name; the README signature is outdated. Duplicate keys retain the last value; numbers and booleans remain strings. It reads the page query, not a hash route’s query. Use `URLSearchParams` directly for repeated values or arbitrary URLs.

## Sources

Based on the review of `src/querystring/index.ts`, `index.js`, `index.d.ts`, and `src/querystring/README.md` in the jails.stdlib 2.2.3 repository. Installed dependency files were also inspected for dependency aliases; confirm the version in the consuming project.
