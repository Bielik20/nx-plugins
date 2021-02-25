import * as childProcess from 'child_process';
import { SpawnOptions } from 'child_process';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { flattenDeep } from 'lodash';

interface ProcessOutput {
  data: Buffer | string;
  type: 'ERR' | 'OUT';
}

interface ProcessOutputLogger {
  info: (message: string) => void;
  error: (message: string) => void;
}

export type ProcessArgs = (string | ProcessArgs)[];

interface ProcessOptions extends SpawnOptions {
  silent?: boolean;
}

export function spawnProcess(
  command: string,
  args: ProcessArgs = [],
  { silent, ...options }: ProcessOptions = {}
): Observable<ProcessOutput> {
  const flattenArgs = flattenDeep(args);
  const child = childProcess.spawn(command, flattenArgs, {
    ...options,
    env: { ...process.env, FORCE_COLOR: 'true' },
  });

  if (!silent) {
    const root = options.cwd || process.cwd();
    console.log(`Executing "${command} ${flattenArgs.join(' ')}" in "${root}"`);
  }

  return new Observable<ProcessOutput>((observer) => {
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
    });
  });
}

export function log(logger: ProcessOutputLogger) {
  return (source: Observable<ProcessOutput>): Observable<ProcessOutput> =>
    source.pipe(
      tap(({ type, data }) => {
        if (type === 'OUT') {
          logger.info(data.toString());
        } else {
          logger.error(data.toString());
        }
      })
    );
}

export function data() {
  return (source: Observable<ProcessOutput>): Observable<string> =>
    source.pipe(map(({ data }) => data.toString().trim()));
}
