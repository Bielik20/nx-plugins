export function getPackageMajorVersion(packageName: string) {
  let packageJson;
  try {
    packageJson = require(`${packageName}/package.json`);
  } catch {
    // do nothing
  }

  if (!packageJson) {
    return null;
  }
  const cypressPackageVersion = packageJson.version;
  const majorVersion = cypressPackageVersion.split('.')[0];
  if (!majorVersion) {
    return 0;
  }
  return +majorVersion;
}
