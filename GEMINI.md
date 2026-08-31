# GEMINI.md - Project Directives & Design System

## Workspace Context
- **Framework**: React 19 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion + Lucide Icons.
- **MCP Server**: ReactBits MCP (`npx -y reactbits-dev-mcp-server`) configured in `mcp_config.json` and `.cursor/mcp.json`.
- **Design System**: Strict "No AI Slop UI" guidelines detailed in [design.md](file:///c:/Users/Newsk/OneDrive/Desktop/techin/design.md) and [.agents/rules/no-ai-slop-ui.md](file:///c:/Users/Newsk/OneDrive/Desktop/techin/.agents/rules/no-ai-slop-ui.md).

## Golden Rules
1. **Design Quality**: Never use generic purple gradients, bloated cartoonish rounded cards, or meaningless glassmorphism. Build clean, Swiss-minimalist, developer-grade UI.
2. **Typography**: Large display headlines must have tight letter spacing (`tracking-tight`). Monospace elements must be crisp (`font-mono text-xs`).
3. **Color**: 90% monochrome (light `#FAFAFA`, dark `#0A0A0A`, borders `#E5E5E5` / `#262626`) + intentional warm orange / amber accent.
4. **Code Quality**: Strict TypeScript with explicit interfaces. No `any`.
