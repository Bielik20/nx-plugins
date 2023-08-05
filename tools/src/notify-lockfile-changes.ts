import { yellow } from 'colorette';

if (process.argv.slice(2).some((arg) => arg.includes('yarn.lock'))) {
  console.warn(
    yellow([
      '⚠️  ---------------------------------------------------------------------------- ⚠️',
      '⚠️  yarn.lock changed, please run `yarn` to ensure your packages are up to date. ⚠️',
      '⚠️  ---------------------------------------------------------------------------- ⚠️',
    ].join('\n'))
  );
}
