import * as core from '@actions/core';
import * as github from '@actions/github';
import { execSync } from 'child_process';

export function setGhActionsPushVariables() {
  try {
    const branch: string = github.context.ref.split('/').slice(2).join('/').trim();
    const base: string = execSync('git rev-list -n 1 --tags', { encoding: 'utf8' }).trim();

    core.setOutput('branch', branch);
    core.setOutput('base', base);
  } catch (e) {
    core.error(e);
    core.setFailed('Getting push variables failed.');
  }
}
