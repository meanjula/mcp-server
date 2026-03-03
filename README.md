# MCP Server With Typescript

Creating Mcp server inside a typescript app 

---

## Create a New Vite + TypeScript (Frontend)

```bash
npm create vite@latest app-name
```
✔ Select a framework: React
✔ Select a variant: TypeScript

### Run the App Frontend

```bash
npm run dev
```

## Create Express + TypeScript (Backend)

### Create Backend Folder
```bash
cd ..
mkdir backend
cd backend
npm init -y
```
#### Edit package.json (Backend):
```json
{
  "type": "module"
}
```

### Install Backend Dependencies
```bash
npm install express cors
npm install --save-dev typescript ts-node nodemon @types/node @types/express @types/cors
```
### Create TypeScript Config
```bash
npx tsc --init
```
#### Edit Backend tsconfig.json:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true
  }
}
```
### Create Backend Source
```bash
mkdir src
touch src/index.ts
```

### Enable Auto-Reload (nodemon + ts-node)
Create `backend/nodemon.json`:
```json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node src/index.ts"
}
```
#### Edit Backend package.json Scripts:
```json
"scripts": {
  "dev": "nodemon",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

### Run Backend
```bash
npm run dev
```

### Run Frontend & Backend Together (Optional)
Create root `package.json`:
```bash
cd ..
npm init -y
npm install --save-dev concurrently
```

## MCP Server Setup

### Install MCP SDK
Install the Model Context Protocol SDK in your backend:
```bash
cd backend
npm install @modelcontextprotocol/sdk
```

### Add MCP Inspector Script
Add this script to your `backend/package.json`:
```json
"scripts": {
  "dev": "nodemon",
  "build": "tsc",
  "start": "node dist/index.js",
  "mcp:inspect": "set DANGEROUSLY_OMIT_AUTH=true && npm run build && npx @modelcontextprotocol/inspector npm run start"
}
```

### Run MCP Inspector
```bash
npm run mcp:inspect
```

## MCP Tools

### create-user

The `create-user` tool allows you to create new users in the system.

**Input Parameters:**
```json
{
  "name": "string",
  "email": "string (valid email format)",
  "address": "string",
  "phone": "string"
}
```

**Implementation Details:**
- ✅ Validates input using Zod schema
- ✅ Auto-generates unique user IDs
- ✅ Persists data to `users.json` file
- ✅ Returns success response with created user

**How it works:**
1. Tool receives user data from client
2. Handler validates input with Zod schema
3. Reads existing users from `src/data/users.json`
4. Generates new ID by incrementing array length
5. Creates new user object with auto-generated ID
6. Appends new user to the array
7. Writes updated array back to JSON file (acts as database)
8. Returns success response with user details

**Example Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "phone": "555-0100"
  }
}
```

## Important Notes

### ✅ What Works
- MCP can run from TypeScript
- MCP can run in dev mode
- MCP Inspector works reliably with a single, stable Node process
- Mcp tool is hooked up with client (copilot) to
### ❌ Known Issues
- MCP Inspector does NOT work reliably with:
  - nodemon (hot reload)
  - ts-node (direct TypeScript execution)
  - Any watch mode or auto-reload systems

### 💡 Best Practice
Always build your TypeScript code first (`npm run build`) before running the MCP Inspector.

## Troubleshooting

### Kill Processes on Specific Port
If you need to free up port 6274:
```bash
npx kill-port 6274
```

### Kill All MCP Processes
To stop all running MCP processes:
```bash
pkill -f mcp
``` 