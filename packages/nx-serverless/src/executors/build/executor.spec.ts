import runCommands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';
import { testContext } from '../../utils/test-context';
import executor from './executor';
import { BuildExecutorSchema } from './schema';

const options: BuildExecutorSchema = { outputPath: '' };

jest.mock('@nrwl/workspace/src/executors/run-commands/run-commands.impl');

const runCommandsMock: jest.Mock = runCommands as any;
const runCommandsReturn = { success: true };

describe('Build Executor', () => {
  beforeEach(() => {
    runCommandsMock.mockReset();
    runCommandsMock.mockReturnValue(runCommandsReturn);
  });

  it('can run', async () => {
    const output = await executor(options, testContext);

    expect(output).toBe(runCommandsReturn);
    expect(runCommandsMock).toHaveBeenCalledWith({
      command: 'sls package',
      outputPath: '',
      cwd: 'apps/serverless839554',
      color: true,
    });
  });

  it('should pass inline arguments', async () => {
    const output = await executor(
      { foo: 'foo-value', bar: 'bar-value', outputPath: '' },
      testContext,
    );
    const { command } = runCommandsMock.mock.calls[0][0];

    expect(output).toBe(runCommandsReturn);
    expect(command).toBe('sls package --foo=foo-value --bar=bar-value');
  });
});
