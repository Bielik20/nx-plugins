module.exports = {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github',
    './tools/src/semantic-release',
  ],
  branches: [{ name: 'master' }],
};
