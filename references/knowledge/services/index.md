# Services

Services handle external communication, api and fetch calls, such as making requests to endpoints (GET, POST, UPDATE, DELETE) or tracking analytics. They should always return promises of entities and remain stateless.

2 important rules to follow to be consistent and predictable:

- It should always return Promise<Entity> | Promise<Entity[]>
- It should be stateless, services should not deal with any data persistence.

Services are just functions with parameters that will send data and return something to our application. It can use the Entities to shape the returned JSON structure returned by the API.

Example:

```ts
import http from '@shared/utils/http'
import { User } from '/entities/user'

export const getPersonList = async () => {

  // Parallel fetching
  const [users, photos, posts] = await Promise.all([
      http.get('/users'),
      http.get('/photos'),
      http.get('/posts')
])

  return users.map((user) => {
      const photo = photos.find((photo) => photo.id === user.id)
      const post = posts.find((post) => post.id === user.id)
      return User({ ...user, photo, post })
  })
}
```

`http` is just a module helper that wraps an implementation such as axios , fetch, or any other xmlHTTPRequestlibraries.