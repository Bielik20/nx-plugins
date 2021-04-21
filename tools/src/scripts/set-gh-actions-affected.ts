import * as core from '@actions/core';
import { appRootPath } from '@nrwl/workspace/src/utilities/app-root';
import { execSync } from 'child_process';

export function setGhActionsAffected() {
  try {
    const args = process.argv.slice(2);

    if (!args.includes('--select')) {
      args.push('--select', 'tasks.target.project');
    }

    const result = execSync(`nx print-affected ${args.join(' ')}`, {
      encoding: 'utf8',
      cwd: appRootPath,
    }).trim();

    const array = result ? result.split(',').map((x) => x.trim()) : [];
    const commaSeparated = array.join(',');
    const length = array.length;

    core.info(JSON.stringify({ array, length, commaSeparated }, null, 2));

    core.setOutput('array', array);
    core.setOutput('comma-separated', commaSeparated);
    core.setOutput('length', length);
  } catch (e) {
    core.error(e);
    core.setFailed('Getting affected failed.');
  }
}
