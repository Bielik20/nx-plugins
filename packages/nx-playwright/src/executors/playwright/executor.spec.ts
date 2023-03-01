import executor from './executor';
import { PlaywrightExecutorSchema } from './schema';

const options: PlaywrightExecutorSchema = {};

describe('Build Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
