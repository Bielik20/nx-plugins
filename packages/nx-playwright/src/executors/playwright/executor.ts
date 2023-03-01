import { PlaywrightExecutorSchema } from './schema';

export default async function runExecutor(options: PlaywrightExecutorSchema) {
  console.log('Executor ran for Build', options);
  return {
    success: true,
  };
}
