import { set } from 'lodash';
import { NxFacade } from '../nrwl/nx-facade';

/**
 * Adds support to serverless-step-functions-offline
 * @link https://www.npmjs.com/package/serverless-step-functions-offline
 */
export function prepareStepOffline(serverless: Serverless.Instance, nx: NxFacade) {
  serverless.service.package.individually = false;
  set(serverless, 'service.custom.stepFunctionsOffline.location', nx.outputAbsolutePath);
}
