import * as execa from 'execa';
import { testContext } from '../../utils/test-context';
import executor from './executor';

const runCommandsReturn = { success: true };

describe('Sls Executor', () => {
  let execSyncMock: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    execSyncMock = jest.spyOn(execa, 'command').mockResolvedValue({ all: 'noop' } as any);
    delete process.env['FORCE_COLOR'];
  });

  describe('local run', () => {
    beforeEach(() => {
      process.env.CI = 'false';
    });

    it('can run', async () => {
      const output = await executor({ command: 'package' }, testContext);

      expect(output).toEqual(runCommandsReturn);
      expect(execSyncMock).toHaveBeenCalledWith('npx sls package', {
        all: false,
        cwd: 'apps/serverlessMock',
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
      expect(execSyncMock).toHaveBeenCalledWith('npx sls deploy --foo=foo-value --bar=bar-value', {
        all: false,
        cwd: 'apps/serverlessMock',
        stdio: 'inherit',
        env: expect.anything(),
      });
    });

    it('should append env', async () => {
      const fakeEnv = { foo: 'bar' };
      const output = await executor(
        { command: 'package', buildTarget: 'foo:bar', env: fakeEnv },
        testContext,
      );
      const expectedEnv = {
        ...process.env,
        ...fakeEnv,
        FORCE_COLOR: 'true',
        NODE_OPTIONS: '--enable-source-maps',
        NS3_NX_SERVERLESS_BUILD_TARGET: 'foo:bar',
      };

      expect(output).toEqual(runCommandsReturn);
      expect(execSyncMock).toHaveBeenCalledWith('npx sls package', {
        all: false,
        cwd: 'apps/serverlessMock',
        stdio: 'inherit',
        env: expectedEnv,
      });
    });

    it('env should overwrite NODE_OPTIONS', async () => {
      const fakeEnv = { foo: 'bar', NODE_OPTIONS: undefined };
      const output = await executor(
        { command: 'package', buildTarget: 'foo:bar', env: fakeEnv },
        testContext,
      );
      const expectedEnv = {
        ...process.env,
        ...fakeEnv,
        FORCE_COLOR: 'true',
        NS3_NX_SERVERLESS_BUILD_TARGET: 'foo:bar',
      };

      expect(output).toEqual(runCommandsReturn);
      expect(execSyncMock).toHaveBeenCalledWith('npx sls package', {
        all: false,
        cwd: 'apps/serverlessMock',
        stdio: 'inherit',
        env: expectedEnv,
      });
    });
  });

  describe('CI run', () => {
    beforeEach(() => {
      process.env.CI = 'true';
    });

    it('should console.log all output', async () => {
      const consoleLogMock = jest.spyOn(console, 'log');

      await executor({ command: 'package' }, testContext);

      expect(consoleLogMock).toHaveBeenCalledWith('noop');
    });
  });
});
