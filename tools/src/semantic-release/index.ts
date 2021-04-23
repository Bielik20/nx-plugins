import * as core from '@actions/core';
import * as SemanticReleaseError from '@semantic-release/error';
import { SemanticContext, SemanticMethod } from './types';

export const verifyRelease: SemanticMethod = async (config, context) => {
  if (context.options.failure === 'true' || context.options.failure === true) {
    throw new SemanticReleaseError('Release failed outside semantic release process!');
  }

  setGitHubActionsOutputs(context);
};

function setGitHubActionsOutputs(context: SemanticContext): void {
  core.setOutput('next-version', context.nextRelease.version);
  core.setOutput('last-head', context.lastRelease.gitHead);
}
