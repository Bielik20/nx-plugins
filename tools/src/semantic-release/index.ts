import {
  runAffectedBuild,
  runAffectedPublish,
  runAffectedVersion,
} from './helpers';
import { SemanticMethod } from './types';

export const prepare: SemanticMethod = async (config, context) => {
  await runAffectedVersion(context);
  await runAffectedBuild(context);
};

export const publish: SemanticMethod = async (config, context) => {
  await runAffectedPublish(context);
};
