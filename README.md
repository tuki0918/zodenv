# dotenv-zod-validator

<p>
<a href="https://www.npmjs.com/package/dotenv-zod-validator"><img src="https://img.shields.io/npm/v/dotenv-zod-validator"></a>
</p>

`dotenv-zod-validator` is a very lightweight, type-safe environment variable library using Zod.

## Installation

```bash
npm install dotenv-zod-validator
```

## Usage (Node)

.env

```bash
NODE_ENV="development"
PORT="3000"
BOOLEAN_FLAG="true"
__OTHER__="__other__"
```

code

```typescript
import { zenv } from "dotenv-zod-validator";

const schema = zenv.object({
    NODE_ENV: zenv.enum(["development", "production", "test"]),
    PORT: zenv.number(),
    BOOLEAN_FLAG: zenv.boolean(),
    OPTIONAL_VAR: zenv.string().optional(),
});

const ENV = zenv.validate(schema);
// NODE_ENV: "development" (string)
// PORT: 3000 (number)
// BOOLEAN_FLAG: true (boolean)
// OPTIONAL_VAR: undefined

// Cannot assign to 'NODE_ENV' because it is a read-only property.
// ENV.NODE_ENV = "production"
```

## Usage (Next.js)

.env

```bash
NEXT_PUBLIC_MY_VALUE="abc"
MY_SECRET="xyz"
```

utils/dotenv.public.ts

```typescript
import { zenv } from "dotenv-zod-validator";

export const schema = zenv.object({
    NEXT_PUBLIC_MY_VALUE: zenv.string(),
});

export const ENV = zenv.validate(schema, {
    NEXT_PUBLIC_MY_VALUE: process.env.NEXT_PUBLIC_MY_VALUE,
});
// NEXT_PUBLIC_MY_VALUE: "abc"
```

utils/dotenv.ts

```typescript
import { zenv } from "dotenv-zod-validator";
import { schema as publicSchema } from "@/utils/dotenv.public";

const schema = zenv.object({
    MY_SECRET: zenv.string(),
});

export const ENV = zenv.validate(publicSchema.merge(schema));
// NEXT_PUBLIC_MY_VALUE: "abc"
// MY_SECRET: "xyz"
```

(optional) [instrumentation.ts](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)


You can enforce environment variable checks when starting the Next.js server.

```
import "@/utils/dotenv";
```

## Custom Helpers

| Method | Description | undefined | empty | and error |
| ---- | ---- | ---- | ---- | ---- |
| object | Alias for `z.object` | _ | _ | _ |
| enum | Alias for `z.enum` | ❌️ | ❌️ | `invalid text` |
| string | Alias for `z.string` | ❌️ | ✅️ | _ |
| number | Converts to a number. | ❌️ | ❌️ | `invalid number` |
| boolean | Converts to a boolean. Uses Zod v4 `stringbool` defaults. (TRUE: `true`, `1`, `yes`, `on`, `y`, `enabled` / FALSE: `false`, `0`, `no`, `off`, `n`, `disabled`) | ❌️ | ❌️ | `invalid value` |

## Tests

```bash
npm test
```


## License

MIT License
