import { stringifyArgs } from './stringify-args';

type TestOpt = Record<string, any>;

describe('stringifyArgs', () => {
  test('add key/value arguments correctly', () => {
    const options: TestOpt = {
      stage: 'dev',
    };

    const expected = '--stage=dev';
    const result = stringifyArgs(options);

    expect(result).toBe(expected);
  });

  test('add flag arguments when passed a boolean true', () => {
    const options: TestOpt = {
      verbose: true,
    };

    const expected = '--verbose';
    const result = stringifyArgs(options);

    expect(result).toBe(expected);
  });

  test('add flag arguments when in mixed grouping', () => {
    const options: TestOpt = {
      stage: 'dev',
      verbose: true,
    };

    const expected = '--stage=dev --verbose';
    const result = stringifyArgs(options);

    expect(result).toBe(expected);
  });

  test('handle a string true as a normal argument', () => {
    const options: TestOpt = {
      stage: 'dev',
      someOption: 'true',
    };

    const expected = '--stage=dev --someOption=true';
    const result = stringifyArgs(options);

    expect(result).toBe(expected);
  });

  test('transform into kebab case', () => {
    const options: TestOpt = {
      stage: 'dev',
      someOption: 'true',
    };

    const expected = '--stage=dev --some-option=true';
    const result = stringifyArgs(options, { kebab: true });

    expect(result).toBe(expected);
  });

  test('handle shorthand args', () => {
    const options: TestOpt = {
      stage: 'dev',
      h: true,
    };

    const expected = '--stage=dev -h';
    const result = stringifyArgs(options, { shorthand: true });

    expect(result).toBe(expected);
  });

  test('remove trailing _', () => {
    const options: TestOpt = {
      help_: true,
      h_: true,
    };

    const expected = '--help -h';
    const result = stringifyArgs(options, { shorthand: true, normalise: true });

    expect(result).toBe(expected);
  });

  test('append _ array at front', () => {
    const options: TestOpt = {
      foo: true,
      _: ['aa', 'bb'],
      bar: true,
    };

    const expected = 'aa bb --foo --bar';
    const result = stringifyArgs(options);

    expect(result).toBe(expected);
  });

  test('handle objects', () => {
    const options: TestOpt = {
      root: {
        first: 'a',
        second: {
          nested: 'b',
        },
      },
    };

    const expected = '--root.first=a --root.second.nested=b';
    const result = stringifyArgs(options);

    expect(result).toBe(expected);
  });

  test('handle arrays', () => {
    const options: TestOpt = {
      array: ['a', 'b'],
    };

    const expected = '--array a b';
    const result = stringifyArgs(options);

    expect(result).toBe(expected);
  });
});
