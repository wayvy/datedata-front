# datedata-front

Monorepo for DateData frontend application.

## Description

This is the MVP version of a personal calendar application. The app allows users to manage their calendars and events with a clean and intuitive UI.

## Features

* Create, edit and delete calendars

* Create, edit and delete events inside any calendar

* Switch between Year, Month, and Day views

#### Disclaimer

This is a demo version of the app. It is not production-ready and data can be lost.


## Getting Started

Generate SSL certificates [docs/SSL.md](./docs/SSL.md)

```bash
yarn
yarn dev
```
Go to https://localhost:5173/

## Build

```bash
yarn build
```
Distribution files will be in `apps/core/dist` folder.

## Project Structure
```
datedata-front/
├── apps/
│ └── core/ # Core app
├── config/
│ ├── eslint/
│ ├── stylelint/
│ └── tsconfig/
├── docs/
├── packages/
│ ├── types/
│ ├── utils/
│ ├── models/
│ ├── stores/
│ └── ui/
```

## Prerequisites
- Node.js 22.x
- Yarn 4.x

## Architecture
App is built with React, TypeScript, MobX, SCSS.


This project uses:
- **Yarn Workspaces**
- **Turborepo**
- **ESLint**
- **Stylelint**
- **Prettier**
- **Husky**
