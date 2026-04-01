// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    '13-how-to-use-these-docs',
    {
      type: 'category',
      label: 'Foundations and Architecture',
      items: [
        '01-glossary',
        '02-system-overview',
        '03-repo-tour',
        '04-html-foundations',
        '05-css-foundations',
        '06-javascript-foundations',
        '07-firebase-fundamentals',
        '08-page-deep-dives',
      ],
    },
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
    {
      type: 'category',
      label: 'HTML and JS DOM Contracts',
      items: [
        '14-html-js-dom-contracts',
      ],
    },
    {
      type: 'category',
      label: 'Firebase, Hosting, and Maintenance',
      items: [
        '15-service-status-and-stubs',
        '09-firestore-rules-deep-dive',
        '10-storage-rules-deep-dive',
        '11-cicd-and-hosting',
        '12-troubleshooting-and-pitfalls',
        'documentation-playbook',
        'docs-audit-checklist',
      ],
    }
  ],
};

export default sidebars;
