import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "Coisinhas da Lay",
  webDir: "dist",
  //@ts-expect-error because its shit
  bundledWebRuntime: false,
};

export default config;
