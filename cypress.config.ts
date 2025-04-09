import coverage from "@cypress/code-coverage/task";
import { exec } from "child_process";
import { defineConfig } from "cypress";
import { promisify } from "node:util";

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, config) {
      coverage(on, config);
      on("after:run", async () => {
        const promisified = promisify(exec);
        await promisified("npx ts-node ./__tests__/teardown-users.ts", {
          cwd: "../backend",
        });
      });

      return config;
    },
    baseUrl: "http://localhost:4000",
    experimentalInteractiveRunEvents: true,
    testIsolation: false,
    specPattern: "__tests__/e2e/*.cy.ts",
    supportFile: "__tests__/support/e2e.ts",
    screenshotsFolder: "__tests__/screenshots",
  },
});
