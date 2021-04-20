import * as core from '@actions/core';
import * as github from '@actions/github';

export function setGhActionsPrVariables() {
  try {
    const branch: string = github.context.payload.pull_request.head.ref;
    const base: string = github.context.payload.pull_request.base.sha;

    core.setOutput('branch', branch);
    core.setOutput('base', base);
  } catch (e) {
    core.error(e);
    core.setFailed('Getting pr variables failed.');
  }
}
