import { exec, ExecOptions } from 'child_process';
import { Observable } from 'rxjs';
import { ProcessOutput } from './process-output';

export function execProcess(
  command: string,
  { env = process.env, ...options }: ExecOptions = {},
): Observable<ProcessOutput> {
  return new Observable<ProcessOutput>((observer) => {
    const child = exec(command, {
      ...options,
      env: processEnv(env),
    });
    const processExitListener = () => {
      observer.complete();
      child.kill();
    };

    process.on('exit', processExitListener);
    child.stdout.on('data', (data) => {
      observer.next({ type: 'OUT', data });
    });
    child.stderr.on('data', (data) => {
      observer.next({ type: 'ERR', data });
    });
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
