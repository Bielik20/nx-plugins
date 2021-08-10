export function preventPackage(options: Record<string, any>) {
  if ('package' in options) {
    throw new Error('"package" option is not supported');
  }
}
