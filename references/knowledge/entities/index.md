# Entities

Entities represent relevant data used for rendering or updating your application. Their role is to act as adapters, accepting JSON data and transforming it into a suitable format for your application.

Entities can shape a smaller model like a product, but also at the application level, like a full-page JSON structure, just like a BFF.

The naming convention is:
- entity name: noun, such as `Movie`, `Product`, or `User`
- structure type: noun + `Type`, such as `MovieType`, `ProductType`, `UserType`
- factory pattern: the entity is a function that receives the raw payload and returns the final typed shape

## Framework-agnostic rules

The same entity conventions apply regardless of framework or rendering model. The entity is a pure adaptation boundary that transforms raw payloads into application-shaped values for React, Angular, Vue, Svelte, or any other UI stack.

- The exported factory function is the public API of the entity file.
- Default parameters should be declared directly in the factory signature using destructuring.
- Private helper functions exist only to support the entity transformation and should be placed below the exported factory.
- Entities do not perform network communication or local persistence; they only adapt data.
- Service layers handle fetch or API calls; entities handle mapping and normalization.

## Default-parameter factory pattern

Entity factories should prefer a destructured payload with explicit default values instead of a payload object that is normalized inside a helper before the function returns.

This makes the contract obvious and keeps the entity framework-agnostic.

Code Example:

```ts
/**
 * @Entity Product
 */
export const Product = ({
  id = Number(-1),
  title = String('No title'),
  description = String('No description'),
  rating = Number(-1),
  stock = Number(-1),
  brand = String('No Brand defined'),
  category = String('No category'),
  image = String('No url for image'),
  ...rest
} = {}) => ({
  id,
  title,
  description,
  rating,
  stock,
  brand,
  category,
  image,
  price: {
    ...ProductPrice(rest),
  },
})

export type ProductType = {
  id: number
  title: string
  description: string
  rating: number
  stock: number
  brand: string
  category: string
  image: string
  price: {
    raw: number
    discount: string
    formatted: string
  }
}

/**
 * @Entity ProductPrice
 */
export const ProductPrice = ({
  price = Number(-1),
  discountPercentage = String('No discount percentage'),
}) => ({
  raw: price,
  discount: discountPercentage,
  formatted: price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
})
```

For this project, the same pattern is applied as:

```ts
export const Movie = ({
  id = Number(-1),
  title = String('Untitled movie'),
  overview = String('No overview available.'),
  release_date = String('Unknown release date'),
  vote_average = Number(0),
  poster_path = String(''),
  backdrop_path = String(''),
}: RawMovie = {}): MovieType => ({
  id,
  title,
  overview,
  release_date,
  vote_average,
  poster_path: toImageUrl(poster_path),
  backdrop_path: toImageUrl(backdrop_path),
})

export type MovieType = {
  id: number
  title: string
  overview: string
  release_date: string
  vote_average: number
  poster_path: string | null
  backdrop_path: string | null
}
```

This keeps the same factory-function structure used in the product example, while respecting the `Movie` / `MovieType` naming rule.

## Helper ordering rule

When an entity includes private helpers, the exported factory function must remain at the top of the file. Any private helper used for sanitization, formatting, image conversion, or normalization should be declared below it.

```ts
export const Movie = ({
  id = Number(-1),
  title = String('Untitled movie'),
  ...rest
}: RawMovie = {}): MovieType => ({
  id,
  title,
  overview: toPlainText(rest.overview),
  poster_path: toImageUrl(rest.poster_path),
})

const toPlainText = (value?: string) => {
  if (!value) return 'No overview available.'
  return value.trim()
}

const toImageUrl = (path?: string | null) => {
  if (!path) return null
  return path
}
```

This pattern is intentionally framework-agnostic: it applies the same way in Angular, React, Vue, or any other UI implementation without coupling the entity to a framework-specific lifecycle.