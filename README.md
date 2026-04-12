# @tuki0918/zodenv

<p>
<a href="https://www.npmjs.com/package/@tuki0918/zodenv"><img src="https://img.shields.io/npm/v/%40tuki0918%2Fzodenv"></a>
</p>

`@tuki0918/zodenv` is a very lightweight, type-safe environment variable library using Zod.

## Installation

```bash
npm install @tuki0918/zodenv
```

## Usage (Node)

.env

```bash
NODE_ENV="development"
PORT="3000"
SAMPLE_RATE="0.5"
BOOLEAN_FLAG="true"
__OTHER__="__other__"
```

code

```typescript
import { zenv } from "@tuki0918/zodenv";

const schema = zenv.object({
    NODE_ENV: zenv.enum(["development", "production", "test"]),
    PORT: zenv.int(),
    SAMPLE_RATE: zenv.number(),
    BOOLEAN_FLAG: zenv.boolean(),
    OPTIONAL_VAR: zenv.string().optional(),
});

const ENV = zenv.validate(schema);
// NODE_ENV: "development" (string)
// PORT: 3000 (number)
// SAMPLE_RATE: 0.5 (number)
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
import { zenv } from "@tuki0918/zodenv";

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
import { zenv } from "@tuki0918/zodenv";
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

```typescript
export async function register() {
  await import("@/utils/dotenv");
}
```

## Custom Helpers

| Method | Description | undefined | empty | and error |
| ---- | ---- | ---- | ---- | ---- |
| object | Alias for `z.object` | _ | _ | _ |
| enum | Alias for `z.enum` | ❌️ | ❌️ | `invalid text` |
| string | Alias for `z.string` | ❌️ | ✅️ | _ |
| number | Converts to a number. | ❌️ | ❌️ | `invalid number` |
| int | Converts to an integer. Accepts signed integer strings only. Rejects decimals, exponent notation, and non-decimal formats. | ❌️ | ❌️ | `invalid number` |
| boolean | Converts to a boolean. Uses Zod v4 `stringbool` defaults. (TRUE: `true`, `1`, `yes`, `on`, `y`, `enabled` / FALSE: `false`, `0`, `no`, `off`, `n`, `disabled`) | ❌️ | ❌️ | `invalid value` |

## Tests

```bash
npm test
```


## License

MIT License
