const presets = [
  [
    '@babel/env',
    {
      targets: {
        node: 'current',
      },
      useBuiltIns: 'usage',
      corejs: 3,
      modules: false,
    },
  ],
];

const plugins = [
  [
    'macros',
    // {
    //   jsToReanimated: {
    //     identifier: 'E',
    //   },
    // },
  ],
  '@babel/plugin-proposal-class-properties',
];

module.exports = { presets, plugins };
