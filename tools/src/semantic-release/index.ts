import * as core from '@actions/core';
import * as SemanticReleaseError from '@semantic-release/error';
import { SemanticContext, SemanticMethod } from './types';
import * as semver from 'semver';

export const verifyRelease: SemanticMethod = async (config, context) => {
  if (context.options.failure === 'true' || context.options.failure === true) {
    throw new SemanticReleaseError('Release failed outside semantic release process!');
  }

  setGitHubActionsOutputs(context);
};

function setGitHubActionsOutputs(context: SemanticContext): void {
  core.setOutput('next-version', context.nextRelease.version);
  core.setOutput('last-head', context.lastRelease.gitHead);
  core.setOutput('channel', getChannel(context));
}

function getChannel(context: SemanticContext) {
  const channel = context.nextRelease.channel;

  return channel ? (semver.validRange(channel) ? `release-${channel}` : channel) : 'latest';
}
