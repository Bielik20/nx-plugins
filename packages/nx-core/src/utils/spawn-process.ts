import { spawn, SpawnOptions } from 'child_process';
import { Observable } from 'rxjs';
import { ProcessOutput } from './process-output';

interface ProcessOptions extends SpawnOptions {
  silent?: boolean;
}

export function spawnProcess(
  command: string,
  args: string[] = [],
  { silent, env = process.env, ...options }: ProcessOptions = {},
): Observable<ProcessOutput> {
  return new Observable<ProcessOutput>((observer) => {
    const child = spawn(command, args, { ...options, env: processEnv(env) });

    if (!silent) {
      console.log(`${command} ${args.join(' ')}`);
    }

    const processExitListener = () => {
      observer.complete();
      child.kill();
    };
    process.on('exit', processExitListener);
    if (!('stdio' in options)) {
      child.stdout.on('data', (data) => {
        observer.next({ type: 'OUT', data });
      });
      child.stderr.on('data', (data) => {
        observer.next({ type: 'ERR', data });
      });
    }
    child.on('close', (code) => {
      if (code === 0) {
        observer.complete();
      } else {
        observer.error();
      }

      process.removeListener('exit', processExitListener);
    });
  });
}

function processEnv(env) {
  return { FORCE_COLOR: 'true', ...env };
}
