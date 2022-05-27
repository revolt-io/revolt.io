import fs from 'node:fs'
import path from 'node:path'

const std = 'https://deno.land/std@0.132.0/'
const root = path.join(process.cwd(), 'deno')

try { fs.rmSync(root, { recursive: true, force: true }) } catch { }
fs.cpSync('src', root, { recursive: true })

const imports = {
    'from \'@discordjs/collection\'': 'from \'https://raw.githubusercontent.com/discordjs/discord.js/main/packages/collection/src/index.ts\'',
    'from \'node:crypto\'': `from '${std}node/crypto.ts'`,
    'import { Response } from \'node-fetch\'': '',
    'import fetch, { Response, HeadersInit } from \'node-fetch\'': '',
    'from \'revolt-api/dist/routes\'': 'from \'https://deno.land/x/revolt_api@0.4.0/routes.ts\'',
    'from \'revolt-api\'': 'from \'https://deno.land/x/revolt_api@0.4.0/types.ts\'',
    'from \'revolt.io\'': 'from \'https://deno.land/x/revoltio/index.ts\'',
    'from \'events\'': `from '${std}node/events.ts'`,
    'import WebSocket from \'ws\'': '',
    'NodeJS.Timer': 'number'
}

function readdir(dir) {
    const dirs = fs.readdirSync(dir);
    const files = dirs.map((subdir) => {
        const res = path.resolve(dir, subdir);
        return fs.statSync(res).isDirectory() ? readdir(res) : res;
    });
    return files.reduce((a, f) => a.concat(f), []);
}

for (const filePath of readdir(root)) {
    const content = fs.readFileSync(filePath, 'utf-8')
    fs.writeFileSync(filePath, transpile(content))
}

fs.writeFileSync(path.join(root, 'README.md'), transpile(fs.readFileSync('README.md', 'utf-8')))

function transpile(content) {
    for (const [search, replace] of Object.entries(imports)) {
        content = content.replace(search, replace)
    }

    content = content.replace(/from '(.+)(?<!\.ts)'/gi, 'from \'$1.ts\'')
    content = content.replace(/Promise<Extract<.+, \{ path: Path \}>\['response'\]>/g, 'Promise<any>')
    content = content.replace(/## Installation(\n.*){4}/, '')
    content = content.replace(/\[Documentation\](.+)/, '[Documentation](https://doc.deno.land/https://deno.land/x/revoltio/index.ts)')

    return content
}