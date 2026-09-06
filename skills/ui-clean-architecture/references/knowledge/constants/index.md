
# Constants

Constants centralize fixed system values and pure functions that derive values from other constants. Export constants so other application abstractions can consume them.

Exemplo:

```ts
// Constant object example

export const HTTP_METHODS = {
  CONNECT: 'CONNECT',
  DELETE: 'DELETE',
  GET: 'GET',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
  PATCH: 'PATCH',
  POST: 'POST',
  PUT: 'PUT',
  TRACE: 'TRACE'
};

// Constant function example

export const GET_METHOD = ( method: string ) => {
	return HTTP_METHODS[ method ]
}

```

## Naming and scope

The `SCREAMING_SNAKE_CASE` rule applies to both constant variables such as `HTTP_METHODS` and constant functions such as `GET_METHOD`.

- Export every constant.
- Group constants in semantic files.
- Keep constant files flat inside `constants/`; do not create component-like nested folder structures.
- System values may be derived from `process.env` when required.