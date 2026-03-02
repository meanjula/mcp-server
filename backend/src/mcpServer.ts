import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fs from "fs/promises";
import { z } from "zod";

export const mcpServer= new McpServer({
    name: "MCP Server",   
    version: "1.0.0",
    capabilities: {
        resources:{},
        tools:{},
        prompts:{}
    },
}as any);
//register with new API
mcpServer.registerTool(
    "create-user",
    {
        description: "create user in database",
        inputSchema: z.object({
            name: z.string(),
            email: z.string().email(),
            address: z.string(),
            phone: z.string()
        }),
        annotations: {
        title: "Create User",
        readOnlyHint: false,
        idempotentHint: false,
        destructiveHint: false,
        openWorldHint: true
    }
    },
    async (params, extra) => {
        console.error("handler called:",{ params, extra });
        const id = await createUser(params);
        try {
            return {
                content: [
                    { type: "text",  text: JSON.stringify({ success: true, user: id}) }
                ]
            };
        } catch (error) {
            return {
                content: [
                    { type: "text", text: JSON.stringify({ error: String(error) }) }
                ]
            };
        }
    } 
);

async function createUser(user: { 
    name: string; 
    email: string; 
    address: string; 
    phone: string; 
}){
   const  users= await import("./data/users.json", {with: {type: "json"}})  
   .then(mod=>mod.default);
   const id=users.length+1;
   const newUser={id, ...user};
   users.push(newUser); 
   await fs.writeFile("./src/data/users.json", JSON.stringify(users,null,2));
   return newUser;
} 

async function startMcp(){
    const transport = new StdioServerTransport ();
    await mcpServer.connect(transport);
    console.error("MCP Server connected via Stdio transport");
}
await startMcp();