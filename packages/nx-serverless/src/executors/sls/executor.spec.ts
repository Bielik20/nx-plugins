import * as childProcess from 'child_process';
import { testContext } from '../../utils/test-context';
import executor from './executor';

const runCommandsReturn = { success: true };

describe('Sls Executor', () => {
  const execSyncMock = jest.spyOn(childProcess, 'execSync').mockReturnValue(null);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('can run', async () => {
    const output = await executor({ command: 'package' }, testContext);

    expect(output).toEqual(runCommandsReturn);
    expect(execSyncMock).toHaveBeenCalledWith('sls package', {
      cwd: 'apps/serverless839554',
      stdio: 'inherit',
      env: expect.anything(),
    });
  });

  it('should pass inline arguments', async () => {
    const output = await executor(
      { foo: 'foo-value', bar: 'bar-value', command: 'deploy' },
      testContext,
    );

    expect(output).toEqual(runCommandsReturn);
    expect(execSyncMock).toHaveBeenCalledWith('sls deploy --foo=foo-value --bar=bar-value', {
      cwd: 'apps/serverless839554',
      stdio: 'inherit',
      env: expect.anything(),
    });
  });

  it('should include nx context in env', async () => {
    await executor({ command: 'package' }, testContext);
    const { env } = execSyncMock.mock.calls[0][1];

    expect(env.nxContext).toBe(JSON.stringify(testContext));
  });

  it('should overwrite env', async () => {
    const fakeEnv = { foo: 'bar' };
    const output = await executor({ command: 'package', env: fakeEnv }, testContext);
    const fakeEnvWithNxContext = { ...fakeEnv, nxContext: JSON.stringify(testContext) };

    expect(output).toEqual(runCommandsReturn);
    expect(execSyncMock).toHaveBeenCalledWith('sls package', {
      cwd: 'apps/serverless839554',
      stdio: 'inherit',
      env: fakeEnvWithNxContext,
    });
  });
});
