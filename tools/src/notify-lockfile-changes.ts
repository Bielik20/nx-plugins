import { yellow } from 'colorette';

if (process.argv.slice(2).some((arg) => arg.includes('package-lock.json'))) {
  console.warn(
    yellow([
      '⚠️  ------------------------------------------------------------------------------------- ⚠️',
      '⚠️  package-lock.json changed, please run `npm i` to ensure your packages are up to date. ⚠️',
      '⚠️  ------------------------------------------------------------------------------------- ⚠️',
    ].join('\n'))
  );
}
