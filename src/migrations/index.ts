import * as migration_20260127_232608_base_collections from './20260127_232608_base_collections';

export const migrations = [
  {
    up: migration_20260127_232608_base_collections.up,
    down: migration_20260127_232608_base_collections.down,
    name: '20260127_232608_base_collections'
  },
];
