# datedata-front

Monorepo for DateData frontend application.

## Overview

DateData is a monorepo for a suite of time-management apps. The first module in the suite is a personal calendar, currently in MVP stage, letting you easily create and manage events and calendars with a clean and intuitive interface.

## Features

### Calendar
* Create, edit and delete calendars
* Create, edit, and delete events within any calendar
* Switch between Year, Month, and Day views

## API Documentation

[https://dev.datedata.dev/api/docs](https://dev.datedata.dev/api/docs)

## Getting Started

### Prerequisites

- Node.js 22.x
- Yarn 4.5.0

### Setup

```bash
git clone https://github.com/wayvy/datedata-front.git
cd datedata-front
yarn install
yarn prepare
```

Generate SSL certificates [docs/SSL.md](./docs/SSL.md)

### Build

```bash
yarn build
```
Distribution files will be in `apps/core/dist` folder.

### Dev server

```bash
yarn dev
```
Go to https://localhost:5173/

## Project Structure
```
datedata-front/
├── apps/
│ └── core/ # Core app
├── config/
│ ├── eslint/ # ESLint configuration
│ ├── stylelint/ # Stylelint configuration
│ └── tsconfig/ # TypeScript configuration
├── docs/ # Documentation
├── packages/
│ ├── types/ # Typescript types
│ ├── utils/ # Utility functions
│ ├── models/ # Data models
│ ├── stores/ # MobX stores
│ └── ui/ # Reusable UI components
```

## Architecture & Tech Stack
- Framework: React
- State Management: MobX
- UI Framework: Gravity UI
- Styling: SCSS
- Routing: React Router 7
- Date/Time: Temporal Polyfill
- Build Tool: Vite
- Package Management: Yarn Workspaces
- Monorepo Tool: Turborepo
- Linting: ESLint, Stylelint
- Formatting: Prettier
- Git hooks: Husky


## Environments

| Environment | Frontend URL | API URL |
| ----------- | ------------- | ------------- |
| Production | [datedata.dev](https://datedata.dev) | [datedata.dev/api](https://datedata.dev/api) |
| Development | [dev.datedata.dev](https://dev.datedata.dev) | [dev.datedata.dev/api](https://dev.datedata.dev/api) |
