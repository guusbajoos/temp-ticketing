## Status

[![CircleCI](https://circleci.com/gh/pandatech-io/rata-cms.svg?style=svg&circle-token=444d870c40bb9ee57c01c6a06a7c5ceb8156c03b)](https://circleci.com/gh/pandatech-io/rata-cms)

Currently CircleCI is only running lint checking to make sure that the code is sanitized.

## Naming Rules

#### component -> PascalCase

example:

- /components/pages/Account/index.js
- /components/pages/Account/EditAccount.js
- /components/pages/Home.js
- /components/pages/account/AccountBank/index.js
- /components/pages/account/AccountUser/index.js

#### not component -> hyphens-case

e.g:

- Wrapping folder
- file scss name
- file image name

#### function -> camelCase

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
