import { green } from 'colorette';

export function printCommand(command: string) {
  console.log(`Running: ${green(command)}`);
}
