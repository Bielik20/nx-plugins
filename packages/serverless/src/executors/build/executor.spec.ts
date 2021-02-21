import { ExecutorContext } from '@nrwl/tao/src/shared/workspace';
import executor from './executor';
import { BuildExecutorSchema } from './schema';
import runCommands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';

const options: BuildExecutorSchema = {};
const context: ExecutorContext = {
  root: '/base/nx-plugins/tmp/nx-e2e/proj',
  target: { executor: '@nx-plugins/serverless:build' },
  workspace: {
    version: 2,
    projects: {
      serverless839554: {
        root: 'libs/serverless839554',
        projectType: 'library',
        sourceRoot: 'libs/serverless839554/src',
        targets: { build: { executor: '@nx-plugins/serverless:build' } },
      },
    },
    cli: { defaultCollection: '@nrwl/workspace' },
  },
  projectName: 'serverless839554',
  targetName: 'build',
  configurationName: undefined,
  cwd: '/base/nx-plugins/tmp/nx-e2e/proj',
  isVerbose: false,
};

jest.mock('@nrwl/workspace/src/executors/run-commands/run-commands.impl');

const runCommandsMock: jest.Mock = runCommands as any;
const runCommandsReturn = { success: true };

describe('Build Executor', () => {
  beforeEach(() => {
    runCommandsMock.mockReset();
    runCommandsMock.mockReturnValue(runCommandsReturn);
  })

  it('can run', async () => {
    const output = await executor(options, context);

    expect(output).toBe(runCommandsReturn);
    expect(runCommandsMock).toHaveBeenCalledWith({
      command: 'sls package',
      outputPath: '/base/nx-plugins/tmp/nx-e2e/proj/libs/serverless839554/.serverless',
      cwd: '/base/nx-plugins/tmp/nx-e2e/proj/libs/serverless839554',
      color: true
    })
  });

  it('can pass inline arguments', async () => {
    const output = await executor({ foo: 'foo-value', bar: 'bar-value' }, context);
    const { command } = runCommandsMock.mock.calls[0][0];

    expect(output).toBe(runCommandsReturn);
    expect(command).toBe('sls package --foo=foo-value --bar=bar-value');
  });
});
