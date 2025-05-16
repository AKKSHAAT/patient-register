// pglite-worker.ts
import { PGlite } from '@electric-sql/pglite';
import { worker } from '@electric-sql/pglite/worker';
import { live } from '@electric-sql/pglite/live';

worker({
  async init() {
    const pglite = await PGlite.create({
      extensions: { live },
      dataDir: 'idb://my-pgdata',
    });
    
    return pglite;
  },
});