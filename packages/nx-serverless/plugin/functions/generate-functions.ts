import { FunctionDecorator } from './function-decorator';

export function generateFunctions(
  serverless: Serverless.Instance,
  options: Serverless.Options,
): ReadonlyArray<FunctionDecorator> {
  const functionsKeys = options.function
    ? [options.function]
    : Object.keys(serverless.service.functions);

  return functionsKeys.map((key) => new FunctionDecorator(key, serverless));
}
