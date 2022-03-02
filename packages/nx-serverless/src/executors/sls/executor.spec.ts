import * as execa from 'execa';
import { NX_CONTEXT_KEY } from '../../../plugin/nrwl/nx-constants';
import { testContext } from '../../utils/test-context';
import executor from './executor';

const runCommandsReturn = { success: true };

describe('Sls Executor', () => {
  let execSyncMock: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    execSyncMock = jest.spyOn(execa, 'command').mockResolvedValue({ all: 'noop' } as any);
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
      expect(execSyncMock).toHaveBeenCalledWith('npx sls deploy --foo=foo-value --bar=bar-value', {
        all: false,
        cwd: 'apps/serverless839554',
        stdio: 'inherit',
        env: expect.anything(),
      });
    });

    it('should include nx context in env', async () => {
      await executor({ command: 'package' }, testContext);
      const { env } = execSyncMock.mock.calls[0][1];

      expect(env[NX_CONTEXT_KEY]).toBe(JSON.stringify(testContext));
    });

    it('should overwrite env', async () => {
      const fakeEnv = { foo: 'bar' };
      const output = await executor({ command: 'package', env: fakeEnv }, testContext);
      const fakeEnvWithNxContext = {
        ...fakeEnv,
        FORCE_COLOR: 'true',
        [NX_CONTEXT_KEY]: JSON.stringify(testContext),
        NODE_OPTIONS: '--enable-source-maps',
      };

      expect(output).toEqual(runCommandsReturn);
      expect(execSyncMock).toHaveBeenCalledWith('npx sls package', {
        all: false,
        cwd: 'apps/serverless839554',
        stdio: 'inherit',
        env: fakeEnvWithNxContext,
      });
    });

    it('env should overwrite NODE_OPTIONS', async () => {
      const fakeEnv = { foo: 'bar', NODE_OPTIONS: undefined };
      const output = await executor({ command: 'package', env: fakeEnv }, testContext);
      const fakeEnvWithNxContext = {
        ...fakeEnv,
        FORCE_COLOR: 'true',
        [NX_CONTEXT_KEY]: JSON.stringify(testContext),
      };

      expect(output).toEqual(runCommandsReturn);
      expect(execSyncMock).toHaveBeenCalledWith('npx sls package', {
        all: false,
        cwd: 'apps/serverless839554',
        stdio: 'inherit',
        env: fakeEnvWithNxContext,
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
