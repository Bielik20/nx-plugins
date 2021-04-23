import { exec, ExecOptions } from 'child_process';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

interface ProcessOutput {
  data: Buffer | string;
  type: 'ERR' | 'OUT';
}

export type ProcessArgs = (string | ProcessArgs)[];

export function execProcess(command: string, options: ExecOptions = {}): Observable<ProcessOutput> {
  return new Observable<ProcessOutput>((observer) => {
    const child = exec(command, {
      ...options,
      env: processEnv(),
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

function processEnv() {
  return { ...process.env, FORCE_COLOR: 'true' };
}

export function log() {
  return (source: Observable<ProcessOutput>): Observable<ProcessOutput> =>
    source.pipe(
      tap(({ type, data }) => {
        if (type === 'OUT') {
          process.stdout.write(data);
        } else {
          process.stderr.write(data);
        }
      }),
    );
}

export function data() {
  return (source: Observable<ProcessOutput>): Observable<string> =>
    source.pipe(map(({ data }) => data.toString().trim()));
}
