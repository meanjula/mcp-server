# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (`/backend`)
```bash
npm run dev          # Start dev server with hot-reload (nodemon)
npm run build        # Compile TypeScript to dist/
npm run start        # Run compiled Express server (port 5000)
npm run mcp:serve    # Run compiled MCP server via stdio
npm run mcp:inspect  # Build + launch MCP Inspector for debugging
```

### Frontend (`/Mcp_Server_With_Typescript`)
```bash
npm run dev      # Start Vite dev server
npm run build    # Type-check + build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

This project has two independent servers in the backend, both compiled from `backend/src/`:

**Express HTTP Server** (`src/index.ts`) — Runs on port 5000, provides a REST `/api` endpoint. The React frontend proxies `/api` requests to this server via Vite config.

**MCP Server** (`src/mcpServer.ts`) — Communicates over stdio (not HTTP). This is the core of the project. It exposes:
- **Resource** `users://all` — returns all users from the JSON file
- **Resource** `users://{userId}/profile` — returns a single user by ID
- **Tool** `create-user` — creates a new user; validates input with Zod and persists to `src/data/users.json`

The two servers are completely separate processes. The Express server and MCP server are both compiled by `tsc` but run independently (`dist/index.js` vs `dist/mcpServer.js`).

**Data persistence** uses a plain JSON file at `backend/src/data/users.json` — there is no database.

**VS Code integration** is configured in `.vscode/mcp.json`, which registers the MCP server so VS Code can invoke it directly via `node dist/mcpServer.js`.

## Key Design Decisions

- The MCP server uses `StdioServerTransport` — it must be started as a child process and communicated with via stdin/stdout, not over HTTP.
- Zod schemas define the `create-user` tool's input shape and are used for runtime validation.
- TypeScript is configured with `"module": "nodenext"` — imports must use `.js` extensions when referencing local files.
- `nodemon.json` is configured to watch `src/**/*.ts` for hot-reload during development.
