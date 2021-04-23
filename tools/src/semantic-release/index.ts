import { runAffectedBuild, runAffectedPublish, runAffectedVersion } from './helpers';
import { SemanticContext, SemanticMethod } from './types';
import * as core from '@actions/core';
import * as SemanticReleaseError from '@semantic-release/error';

export const verifyRelease: SemanticMethod = async (config, context) => {
  if (context.options.failure === 'true' || context.options.failure === true) {
    throw new SemanticReleaseError('Release failed outside semantic release process!');
  }

  setGitHubActionsOutputs(context);
};

export const prepare: SemanticMethod = async (config, context) => {
  await runAffectedVersion(context);
  await runAffectedBuild(context);
};

export const publish: SemanticMethod = async (config, context) => {
  await runAffectedPublish(context);
};

export function setGitHubActionsOutputs(context: SemanticContext): void {
  core.setOutput('next-version', context.nextRelease.version);
  core.setOutput('last-head', context.lastRelease.gitHead);
}
