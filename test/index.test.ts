import { zenv } from "../src";

describe("zenv.validate", () => {
  it("should validate correct environment variables", () => {
    const schema = zenv.object({
      NODE_ENV: zenv.enum(["development", "production", "test"]),
      PORT: zenv.number(),
      BOOLEAN_FLAG: zenv.boolean(),
      OPTIONAL_VAR: zenv.string().optional(),
    });

    const env = {
      NODE_ENV: "development",
      PORT: "3000",
      BOOLEAN_FLAG: "true",
      __OTHER__: "__other__",
    };

    const result = zenv.validate(schema, env);

    expect(result).toEqual({
      NODE_ENV: "development",
      PORT: 3000,
      BOOLEAN_FLAG: true,
    });
  });

  it("should not access environment variables if schema is not defined", () => {
    const schema = zenv.object({});
    const env = {
      NODE_ENV: "development",
      PORT: "3000",
      BOOLEAN_FLAG: "true",
    };

    const result = zenv.validate(schema, env);

    expect(result).toEqual({});
  });

  it("should throw an error if re-assigned environment variables", () => {
    const schema = zenv.object({
      PORT: zenv.number(),
    });

    const env = {
      PORT: "3000",
    };

    const result = zenv.validate(schema, env);

    expect(result).toEqual({
      PORT: 3000,
    });

    expect(() => {
      // @ts-expect-error:
      result.PORT = "4000";
    }).toThrow(
      "Cannot assign to read only property 'PORT' of object '#<Object>'",
    );
  });

  it("should throw an error for invalid environment variables", () => {
    const schema = zenv.object({
      NODE_ENV: zenv.enum(["development", "production", "test"]),
      PORT: zenv.number(),
      BOOLEAN_FLAG: zenv.boolean(),
    });

    const invalidEnv = {
      NODE_ENV: "invalid_env",
      PORT: "not_a_number",
      BOOLEAN_FLAG: "invalid_boolean",
    };

    expect(() => zenv.validate(schema, invalidEnv)).toThrow(
      /^Invalid environment variables: /,
    );
  });
});

describe("zenv.string", () => {
  const schema = zenv.object({
    SITE_NAME: zenv.string(),
  });

  test.each([
    ["", ""],
    ["0", "0"],
    ["invalid_text", "invalid_text"],
    ["true", "true"],
  ])('"%s" to "%s"', (v, expected) => {
    const env = { SITE_NAME: v };
    const result = zenv.validate(schema, env);
    expect(result).toEqual({ SITE_NAME: expected });
  });

  test.each([[undefined]])('"%s" to throw an error', (v) => {
    const env = { SITE_NAME: v };
    expect(() => zenv.validate(schema, env)).toThrow(
      /^Invalid environment variables: /,
    );
  });
});

describe("zenv.enum", () => {
  const schema = zenv.object({
    VALUE: zenv.enum(["development", "production", "test"]),
  });

  test.each([
    ["development", "development"],
    ["production", "production"],
    ["test", "test"],
  ])('"%s" to "%s"', (v, expected) => {
    const env = { VALUE: v };
    const result = zenv.validate(schema, env);
    expect(result).toEqual({ VALUE: expected });
  });

  test.each([["invalid_text"], [""], [undefined]])(
    '"%s" to throw an error',
    (v) => {
      const env = { VALUE: v };
      expect(() => zenv.validate(schema, env)).toThrow(
        /^Invalid environment variables: /,
      );
    },
  );
});

describe("zenv.number", () => {
  const schema = zenv.object({
    VALUE: zenv.number(),
  });

  test.each([
    ["0", 0],
    ["1", 1],
    ["5.", 5],
    ["99", 99],
    ["0b1010", 10],
    ["-1", -1],
    ["1.1", 1.1],
    [1, 1],
    [0, 0],
    [-1, -1],
    [1.1, 1.1],
    [-1.1, -1.1],
  ])('"%s" to %s', (v, expected) => {
    const env = { VALUE: v };
    const result = zenv.validate(schema, env);
    expect(result).toEqual({ VALUE: expected });
  });

  test.each([
    [null],
    [true],
    [false],
    ["true"],
    ["false"],
    ["x"],
    [""],
    [" "],
    [undefined],
  ])('"%s" to throw an error', (v) => {
    const env = { VALUE: v };
    expect(() => zenv.validate(schema, env)).toThrow(
      /^Invalid environment variables: /,
    );
  });
});

describe("zenv.int", () => {
  const schema = zenv.object({
    VALUE: zenv.int(),
  });

  test.each([
    ["0", 0],
    ["1", 1],
    ["-1", -1],
    ["+1", 1],
    ["001", 1],
    [1, 1],
    [0, 0],
    [-1, -1],
  ])('"%s" to %s', (v, expected) => {
    const env = { VALUE: v };
    const result = zenv.validate(schema, env);
    expect(result).toEqual({ VALUE: expected });
  });

  test.each([
    [null],
    [true],
    [false],
    ["true"],
    ["false"],
    ["x"],
    [""],
    [" "],
    ["1.1"],
    ["5."],
    ["1e3"],
    ["0b1010"],
    [1.1],
    [-1.1],
    [undefined],
  ])('"%s" to throw an error', (v) => {
    const env = { VALUE: v };
    expect(() => zenv.validate(schema, env)).toThrow(
      /^Invalid environment variables: /,
    );
  });
});

describe("zenv.boolean", () => {
  const schema = zenv.object({
    VALUE: zenv.boolean(),
  });

  test.each([
    ["1", true],
    ["true", true],
    ["True", true],
    ["TRUE", true],
    ["yes", true],
    ["on", true],
    ["y", true],
    ["enabled", true],
    ["0", false],
    ["false", false],
    ["False", false],
    ["FALSE", false],
    ["no", false],
    ["off", false],
    ["n", false],
    ["disabled", false],
  ])('"%s" to %s', (v, expected) => {
    const env = { VALUE: v };
    const result = zenv.validate(schema, env);
    expect(result).toEqual({ VALUE: expected });
  });

  test.each([
    [1],
    [0],
    [true],
    [false],
    [""],
    [undefined],
    ["-1"],
    ["2"],
    ["invalid_text"],
  ])('"%s" to throw an error', (v) => {
    const env = { VALUE: v };
    expect(() => zenv.validate(schema, env)).toThrow(
      /^Invalid environment variables: /,
    );
  });
});
