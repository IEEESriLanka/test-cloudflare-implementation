import * as migration_20260126_091819_initial_setup from './20260126_091819_initial_setup';
import * as migration_20260218_113000_fix_categories from './20260218_113000_fix_categories';

export const migrations = [
  {
    up: migration_20260126_091819_initial_setup.up,
    down: migration_20260126_091819_initial_setup.down,
    name: '20260126_091819_initial_setup'
  },
  {
    up: migration_20260218_113000_fix_categories.up,
    down: migration_20260218_113000_fix_categories.down,
    name: '20260218_113000_fix_categories'
  },
];
