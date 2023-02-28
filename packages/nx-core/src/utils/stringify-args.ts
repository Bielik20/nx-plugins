import { names } from '@nrwl/devkit';
import { flatten } from 'flat';

interface Options {
  normalise?: boolean;
  kebab?: boolean;
  shorthand?: boolean;
}

const DEFAULT: Required<Options> = {
  normalise: true,
  kebab: false,
  shorthand: false,
} as const;

export function stringifyArgs(record: Record<string, any>, _options: Options = {}): string {
  const options: Required<Options> = { ...DEFAULT, ..._options };
  const { _ = [], ...rest } = record;
  const array = Object.entries(rest)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => format(key, value, options));

  return [..._, ...array].join(' ');
}

function format(key: string, value, options: Required<Options>) {
  const normalisedKey = options.normalise && key.endsWith('_') ? key.slice(0, -1) : key;
  const formattedKey = options.kebab ? names(normalisedKey).fileName : normalisedKey;
  const dashes = options.shorthand && normalisedKey.length === 1 ? '-' : '--';

  if (Array.isArray(value)) {
    return `${dashes}${formattedKey} ${value.join(' ')}`;
  }

  if (typeof value === 'object') {
    return Object.entries(flatten(value))
      .map(([key, value]) => `${dashes}${formattedKey}.${key}=${value}`)
      .join(' ');
  }

  return value === true ? `${dashes}${formattedKey}` : `${dashes}${formattedKey}=${value}`;
}
