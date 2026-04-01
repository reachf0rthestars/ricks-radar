// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    '13-how-to-use-these-docs',
    'intro',
    '01-glossary',
    '02-system-overview',
    '03-repo-tour',
    '04-html-foundations',
    '05-css-foundations',
    '06-javascript-foundations',
    '07-firebase-fundamentals',
    '08-page-deep-dives',
    '09-firestore-rules-deep-dive',
    '10-storage-rules-deep-dive',
    '11-cicd-and-hosting',
    '12-troubleshooting-and-pitfalls',
    '14-html-js-dom-contracts',
    '15-service-status-and-stubs',
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Shared Modules',
          items: [
            'reference/shared/shared-firebase-config',
            'reference/shared/shared-auth-profile',
            'reference/shared/shared-menu',
            'reference/shared/shared-messages'
          ]
        },
        {
          type: 'category',
          label: 'Page Controllers',
          items: [
            'reference/pages/index-page',
            'reference/pages/login-page',
            'reference/pages/create-account-page',
            'reference/pages/account-page',
            'reference/pages/add-deal-page',
            'reference/pages/about-page'
          ]
        }
      ]
    },
    'documentation-playbook',
    'docs-audit-checklist'
  ],
};

export default sidebars;
