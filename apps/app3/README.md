# App3 - InvoiceHub Analytics MFE

This is a React micro-frontend application that displays the InvoiceHub App Plan. It's part of a micro-frontend architecture using Module Federation.

## Tech Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Webpack 5** - Module bundling and Module Federation
- **Module Federation** - Micro-frontend integration
- **Tailwind CSS** - Utility-first CSS framework (shared across all apps)

## Getting Started

First, ensure you're in the monorepo root and install dependencies:

```bash
pnpm install
```

Then start the development server:

```bash
pnpm start
```

The app will be available at [http://localhost:3003](http://localhost:3003).

## Integration

This micro-frontend is integrated into the main shell application at [http://localhost:3000/app3](http://localhost:3000/app3).

## Architecture

- **Shell App** (Port 3000) - Navigation and orchestration
- **Legacy App** (Port 3001) - AngularJS invoice management
- **Astrobyte App** (Port 3002) - React payment processing
- **App3** (Port 3003) - React analytics and planning (this app)

## Development

The app uses webpack with Module Federation to expose the `./App` component to other micro-frontends in the system.

### Key Files

- `src/App.tsx` - Main React component displaying the InvoiceHub App Plan
- `src/bootstrap.tsx` - Application entry point
- `webpack.config.cjs` - Webpack configuration with Module Federation
- `tsconfig.json` - TypeScript configuration

## Content

This micro-frontend displays the InvoiceHub App Plan overview, including:

- Phase 1 development goals and timeline
- System architecture overview
- Development instructions
- Technical stack information

The content is designed to showcase the micro-frontend architecture and provide guidance for the InvoiceHub billing system development.