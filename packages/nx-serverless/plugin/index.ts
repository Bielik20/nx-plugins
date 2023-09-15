import { generateFunctions } from './functions/generate-functions';
import { prepareInvoke } from './integrations/serverless-invoke-local';
import { prepareOffline, prepareStepOffline } from './integrations/serverless-offline';
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

        await nx.build();
        await packaging.pack(functions, nx.outputAbsolutePath);
      },

      'before:deploy:function:packageFunction': async () => {
        const { nx, packaging, functions } = this.prepare();

        await nx.build();
        await packaging.pack(functions, nx.outputAbsolutePath);
      },

      'before:invoke:local:invoke': async () => {
        const { nx } = this.prepare();

        await nx.build();
        prepareInvoke(this.serverless, nx);
      },

      'before:offline:start': async () => {
        const { nx } = this.prepare();

        await nx.watch();
        prepareOffline(this.serverless, nx);
      },
      'before:offline:start:init': async () => {
        const { nx } = this.prepare();

        await nx.watch();
        prepareOffline(this.serverless, nx);
      },

      'before:step-functions-offline:start': async () => {
        const { nx } = this.prepare();

        await nx.watch();
        prepareStepOffline(this.serverless, nx);
      },
    };
  }

  private prepare() {
    this.printExperimentalWarning();
    if (this.serverless.service.provider.name !== 'aws') {
      throw new Error('The only supported provider is "aws"');
    }

    const nx = new NxFacade(this.logging);
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
