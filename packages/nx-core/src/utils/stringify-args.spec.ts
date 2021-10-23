import { stringifyArgs } from './stringify-args';

//eslint-disable-next-line @typescript-eslint/no-explicit-any
type TestOpt = Record<string, any>;

test('it should add key/value arguments correctly', () => {
  const options: TestOpt = {
    stage: 'dev',
  };

  const expected = '--stage=dev';
  const result = stringifyArgs(options);

  expect(result).toBe(expected);
});

test('it should add flag arguments when passed a boolean true', () => {
  const options: TestOpt = {
    verbose: true,
  };

  const expected = '--verbose';
  const result = stringifyArgs(options);

  expect(result).toBe(expected);
});

test('it should add flag arguments when in mixed grouping', () => {
  const options: TestOpt = {
    stage: 'dev',
    verbose: true,
  };

  const expected = '--stage=dev --verbose';
  const result = stringifyArgs(options);

  expect(result).toBe(expected);
});

test('it should handle a string true as a normal argument', () => {
  const options: TestOpt = {
    stage: 'dev',
    someOption: 'true',
  };

  const expected = '--stage=dev --someOption=true';
  const result = stringifyArgs(options);

  expect(result).toBe(expected);
});
