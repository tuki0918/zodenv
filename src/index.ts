import { z } from "zod";
import { fromZodError } from "zod-validation-error";

type EnvSource = NodeJS.ProcessEnv | Record<string, unknown>;
const INT_REGEX = /^[+-]?\d+$/;

function validate<T extends z.ZodType>(
  schema: T,
  env: EnvSource = process.env,
): z.output<z.ZodReadonly<T>> {
  try {
    return schema.readonly().parse(env);
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw fromZodError(err, {
        includePath: true,
        prefix: "Invalid environment variables",
      });
    }

    throw err;
  }
}

// Custom Zod methods
const envNumber = () =>
  z
    .union([z.string().trim().min(1), z.number()])
    .pipe(z.coerce.number<string | number>());

const envInt = () =>
  z
    .union([z.string().trim().regex(INT_REGEX), z.int()])
    .pipe(z.coerce.number<string | number>())
    .pipe(z.int());

export const zenv = {
  object: z.object,
  enum: z.enum,
  string: z.string,
  number: envNumber,
  int: envInt,
  boolean: z.stringbool,
  validate,
};
