import { importESMModules } from './common/esm-modules';

(async () => {
    await importESMModules();
    await import('./main.js');
})();