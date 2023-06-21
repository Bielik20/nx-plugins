import { detectPackageManager } from '@nx/devkit';

export function getSlsCommand() {
  const packageManager = detectPackageManager();
  switch (packageManager) {
    case 'pnpm':
    case 'yarn':
    case 'npm':
    default:
      return 'npx sls';
  }
}
