import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface ProcessOutput {
  data: Buffer | string;
  type: 'ERR' | 'OUT';
}

export function log() {
  return (source: Observable<ProcessOutput>): Observable<ProcessOutput> =>
    source.pipe(
      tap(({ type, data }) => {
        if (type === 'OUT') {
          process.stdout.write(data.toString());
        } else {
          process.stderr.write(data.toString());
        }
      }),
    );
}

export function data() {
  return (source: Observable<ProcessOutput>): Observable<string> =>
    source.pipe(map(({ data }) => data.toString().trim()));
}
