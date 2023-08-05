import set from 'just-safe-set';
import { NxFacade } from '../nrwl/nx-facade';

/**
 * Adds support to serverless-offline
 * @link https://www.npmjs.com/package/serverless-offline
 */
export function prepareOffline(serverless: Serverless.Instance, nx: NxFacade) {
  serverless.service.package.individually = false;
  set(serverless, 'service.custom.serverless-offline.location', nx.outputAbsolutePath);
}
