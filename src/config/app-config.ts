import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "PDS-Transport",
  version: packageJson.version,
  copyright: `© ${currentYear}, PDS-Transport.`,
  meta: {
    title: "PDS-Transport",
    description: "Transport management Dashboard",
  },
};
