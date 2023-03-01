import * as chalk from 'chalk';

export function printCommand(command: string) {
  console.log(`Running: ${chalk.green(command)}`);
}
