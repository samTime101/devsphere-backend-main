// SEP 15 2025
// SAMIP REGMI

// THE REFERENCE OF THE FOLLOWING CODE IS AT : https://github.com/aleclarson/vite-tsconfig-paths
// UNDER SETUP NUMBER 2.

// CONFUGURATION FOR VITEST TO UNDERSTAND PATHS FROM TSCONFIG

import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test:{
    sequence:{
      // SEEMS LIKE WE DONT NEED THIS ANYMORE
      // AS WE ARE NOW USING A SINGLE TEST FILE TO IMPORT ALL THE TEST FILES IN ORDER
      // SO THIS IS NOT REQUIRED
      // concurrent: false 
    },
    testTimeout: 30000, //  -> EACH TEST
  }
});
