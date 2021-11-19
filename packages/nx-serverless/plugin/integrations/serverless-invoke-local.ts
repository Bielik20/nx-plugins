import { NxFacade } from '../nrwl/nx-facade';

/**
 * Adds support to Invoke Local
 * @link https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local
 */
export function prepareInvoke(serverless: Serverless.Instance, nx: NxFacade) {
  serverless.config.servicePath = nx.outputAbsolutePath;
}
