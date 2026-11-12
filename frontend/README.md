# Car Show Registration Dashboard

## Run the frontend

1. Make sure the C# API is available at `http://localhost:5205`.
2. From the repository root, install frontend dependencies:

   ```sh
   npm install --prefix frontend
   ```

3. From the repository root, start the Vite development server:

   ```sh
   npm run dev
   ```

4. Open the local URL printed by Vite.

The development API URL is configured in `.env.development` as
`VITE_API_BASE_URL=http://localhost:5205`. Restart Vite after changing an
environment file. The API must allow requests from the frontend's local origin
through its CORS configuration.

## Switch between sample data and the real API

The data source is selected by one import in
`src/pages/RegistrationsPage.jsx`:

```js
import { getRegistrations, getSummary } from '../api/registrationsApi.js'
```

Use `../api/sample-data.js` in that import to switch to local sample data. Switch
back to `../api/registrationsApi.js` to use the C# API. Both modules export
`getRegistrations(filters)` and `getSummary()` with the same return shapes.

## Check the frontend

```sh
npm run build
npm run lint
```
