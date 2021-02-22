import runCommands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { testContext } from '../../utils/test-context';
import { DeployExecutorSchema } from './schema';
import executor from './executor';

const options: DeployExecutorSchema = { skipBuild: true };

jest.mock('@nrwl/workspace/src/executors/run-commands/run-commands.impl');

const runCommandsMock: jest.Mock = runCommands as any;
const runCommandsReturn = { success: true };

describe('Deploy Executor', () => {
  beforeEach(() => {
    runCommandsMock.mockReset();
    runCommandsMock.mockReturnValue(runCommandsReturn);
  });

  it('can run', async () => {
    const output = await executor(options, testContext);
    const { outputPath } = runCommandsMock.mock.calls[0][0];

    expect(output).toBe(runCommandsReturn);
    expect(outputPath).toBe('/base/nx-plugins/tmp/nx-e2e/proj/apps/serverless839554/.serverless');
  });
});
