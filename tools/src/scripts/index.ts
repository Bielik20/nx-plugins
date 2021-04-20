import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { setGhActionsAffected } from './set-gh-actions-affected';
import { setGhActionsPrVariables } from './set-gh-actions-pr-variables';
import { setGhActionsPushVariables } from './set-gh-actions-push-variables';

const commands = yargs(hideBin(process.argv))
  .command(
    'set-affected',
    'Set GitHub Action variables for affected projects',
    (yargs) => yargs,
    () => {
      setGhActionsAffected();
    },
  )
  .command(
    'set-pr-variables',
    'Set GitHub Action variables for Pull Request Event',
    (yargs) => yargs,
    () => {
      setGhActionsPrVariables();
    },
  )
  .command(
    'set-push-variables',
    'Set GitHub Action variables for Push Event',
    (yargs) => yargs,
    () => {
      setGhActionsPushVariables();
    },
  );

commands.argv;
