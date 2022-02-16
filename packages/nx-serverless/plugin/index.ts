import { generateFunctions } from './functions/generate-functions';
import { prepareInvoke } from './integrations/serverless-invoke-local';
import { prepareOffline } from './integrations/serverless-offline';
import { prepareStepOffline } from './integrations/serverless-step-functions-offline';
import { NxFacade } from './nrwl/nx-facade';
import { PackagingManager } from './packaging/packaging-manager';

class NxServerlessPlugin {
  readonly hooks: { [key: string]: () => void };

  constructor(
    private serverless: Serverless.Instance,
    private options: Serverless.Options,
    private logging: Serverless.Logging,
  ) {
    this.hooks = {
      'before:package:createDeploymentArtifacts': async () => {
        const { nx, packaging, functions } = this.prepare();

        await nx.build(functions);
        await packaging.pack(functions, nx.outputAbsolutePath);
      },

      'before:deploy:function:packageFunction': async () => {
        const { nx, packaging, functions } = this.prepare();

        await nx.build(functions);
        await packaging.pack(functions, nx.outputAbsolutePath);
      },

      'before:invoke:local:invoke': async () => {
        const { nx, functions } = this.prepare();

        if (!this.options.skipPackage) {
          await nx.build(functions);
        }
        prepareInvoke(this.serverless, nx);
      },

      'before:offline:start': async () => {
        const { nx, functions } = this.prepare();

        await nx.watch(functions);
        prepareOffline(this.serverless, nx);
      },
      'before:offline:start:init': async () => {
        const { nx, functions } = this.prepare();

        await nx.watch(functions);
        prepareOffline(this.serverless, nx);
      },

      'before:step-functions-offline:start': async () => {
        const { nx, functions } = this.prepare();

        await nx.watch(functions);
        prepareStepOffline(this.serverless, nx);
      },
    };
  }

  private prepare() {
    this.printExperimentalWarning();
    if (this.serverless.service.provider.name !== 'aws') {
      throw new Error('The only supported provider is "aws"');
    }

    const nx = new NxFacade(this.serverless, this.logging);
    const packaging = new PackagingManager(this.serverless);
    const functions = generateFunctions(this.serverless, this.options);

    return { nx, packaging, functions };
  }

  private printExperimentalWarning() {
    this.logging.log.warning(
      '"@ns3/nx-serverless/plugin" is experimental and can change without a major release.',
    );
  }
}

module.exports = NxServerlessPlugin;
