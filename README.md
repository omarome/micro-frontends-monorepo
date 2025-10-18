# Micro-Frontends Monorepo

A comprehensive micro-frontend architecture demonstrating enterprise-grade billing system with realistic financial domain complexity.

## Architecture

This monorepo contains multiple micro-frontends orchestrated by a shell application:

- **Shell App** (Port 3000) - React 18 shell with navigation and orchestration
- **Legacy App** (Port 3001) - AngularJS 1.x invoice management
- **Astrobyte App** (Port 3002) - React + TypeScript payment processing  
- **App3** (Port 3003) - React + TypeScript analytics and planning

## Tech Stack

- **Frontend**: React 18, AngularJS 1.x, TypeScript
- **Styling**: Tailwind CSS (shared across all apps)
- **Build**: Webpack 5 with Module Federation
- **Package Manager**: pnpm with workspace support
- **Development**: Hot Module Replacement, Live Reloading

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
# Install all dependencies
pnpm install

# Start all micro-frontends
pnpm start
```

### Individual App Development

```bash
# Shell App (Port 3000)
cd apps/shell && pnpm start

# Legacy App (Port 3001) 
cd apps/legacy_app && pnpm start

# Astrobyte App (Port 3002)
cd apps/astrobyte && pnpm start

# App3 (Port 3003)
cd apps/app3 && pnpm start
```

## Tailwind CSS

All applications use Tailwind CSS for consistent styling:

- **Shared Configuration**: `tailwind.config.js` at root level
- **Shared Styles**: `libs/ui-styles/src/shared-styles.css`
- **PostCSS**: Configured for all webpack builds
- **Design System**: Custom colors and typography defined

## Module Federation

Each micro-frontend exposes components via Webpack Module Federation:

- `shell` - Orchestrates and consumes all remotes
- `legacyApp/App` - AngularJS wrapper component
- `astrobyte/App` - React payment component  
- `app3/App` - React analytics component

## Development Workflow

1. **Shell First**: Always start the shell app first (port 3000)
2. **Remote Apps**: Start individual micro-frontends as needed
3. **Shared Dependencies**: React, React-DOM shared across all apps
4. **Hot Reloading**: All apps support HMR for fast development

## Project Structure

```
├── apps/
│   ├── shell/           # Main shell application
│   ├── legacy_app/      # AngularJS invoice management
│   ├── astrobyte/       # React payment processing
│   └── app3/            # React analytics & planning
├── libs/
│   └── ui-styles/       # Shared Tailwind CSS styles
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Workspace configuration
```

## Contributing

1. Follow the established micro-frontend patterns
2. Use Tailwind CSS for all styling
3. Maintain Module Federation compatibility
4. Test integration between shell and remotes

## License

ISC