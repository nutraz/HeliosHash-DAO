// scripts/mcp-server.js
const { execSync } = require('child_process');

console.error('HeliosHash MCP Server starting...');

process.stdin.setEncoding('utf8');

process.stdin.on('data', async (data) => {
  try {
    const message = JSON.parse(data.trim());
    
    if (message.method === 'tools/list') {
      // Return available tools
      const response = {
        jsonrpc: '2.0',
        id: message.id,
        result: {
          tools: [
            {
              name: 'deploy_dao',
              description: 'Deploy HeliosHash DAO canisters to local network',
              inputSchema: {
                type: 'object',
                properties: {
                  canister: { 
                    type: 'string', 
                    enum: ['all', 'hhu_token', 'dao', 'auth'],
                    default: 'all'
                  }
                }
              }
            },
            {
              name: 'call_canister',
              description: 'Call a canister method',
              inputSchema: {
                type: 'object',
                properties: {
                  canister: { type: 'string' },
                  method: { type: 'string' },
                  args: { type: 'string' }
                },
                required: ['canister', 'method']
              }
            },
            {
              name: 'check_status',
              description: 'Check DFX and canister status',
              inputSchema: { type: 'object', properties: {} }
            }
          ]
        }
      };
      console.log(JSON.stringify(response));
      return;
    }

    if (message.method === 'tools/call') {
      const { name, arguments: args } = message.params;
      let result;

      try {
        switch (name) {
          case 'deploy_dao':
            const canister = args.canister || 'all';
            const output = execSync(`dfx deploy ${canister === 'all' ? '' : canister}`, { 
              encoding: 'utf8',
              cwd: process.cwd()
            });
            result = `✅ Deployed ${canister} successfully!\n${output}`;
            break;

          case 'call_canister':
            const callOutput = execSync(
              `dfx canister call ${args.canister} ${args.method} ${args.args || ''}`,
              { encoding: 'utf8', cwd: process.cwd() }
            );
            result = `📞 Call result:\n${callOutput}`;
            break;

          case 'check_status':
            const status = execSync('dfx canister status --all', { 
              encoding: 'utf8', 
              cwd: process.cwd() 
            });
            result = `📊 Status:\n${status}`;
            break;

          default:
            result = `❌ Unknown tool: ${name}`;
        }
      } catch (error) {
        result = `❌ Error: ${error.message}`;
      }

      const response = {
        jsonrpc: '2.0',
        id: message.id,
        result: {
          content: [{ type: 'text', text: result }]
        }
      };
      console.log(JSON.stringify(response));
    }
  } catch (error) {
    console.error('MCP Error:', error);
  }
});

console.error('HeliosHash MCP Server ready');
