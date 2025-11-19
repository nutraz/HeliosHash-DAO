# @helioshash/sdk

Minimal SDK scaffolding for the HeliosHash project.

Usage

```ts
import createClient from '@helioshash/sdk';

const client = createClient({ baseUrl: process.env.HELIOSHASH_API });
const info = await client.getContractInfo('HeliosToken');
```

This package is intentionally small — replace the fetch calls with IC canister actor calls or GraphQL/REST client logic as your backend defines.
