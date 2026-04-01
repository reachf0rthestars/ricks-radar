// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Rick's Radar Developer Docs",
  tagline: 'Beginner-first documentation for the full stack',
  favicon: 'img/favicon.ico',
  future: {
    v4: true,
  },
  url: 'https://ricksradar-dev-docs.web.app',
  baseUrl: '/',
  organizationName: 'reachf0rthestars',
  projectName: 'ricks-radar',
  onBrokenLinks: 'throw',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/reachf0rthestars/ricks-radar/tree/docs/docs/docusaurus/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  themeConfig:
    ({
      image: 'img/ricks-radar-logo.png',
      colorMode: {
        respectPrefersColorScheme: false,
        defaultMode: 'light',
      },
      navbar: {
        title: "Rick's Radar Docs",
        logo: {
          alt: "Rick's Radar Logo",
          src: 'img/ricks-radar-logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/reachf0rthestars/ricks-radar/tree/docs/docs/docusaurus',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Start Here',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Firebase',
            items: [
              {
                label: 'Firebase Docs',
                href: 'https://firebase.google.com/docs',
              },
              {
                label: 'Firestore Rules',
                href: 'https://firebase.google.com/docs/firestore/security/get-started',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/reachf0rthestars/ricks-radar',
              },
            ],
          },
        ],
        copyright: `Copyright ${new Date().getFullYear()} Rick's Radar documentation.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
