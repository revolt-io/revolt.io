import { build, emptyDir } from 'https://deno.land/x/dnt@0.23.0/mod.ts';

if (!Deno.args[0]) {
  console.log('Missing version');
  Deno.exit();
}

await emptyDir('./npm');

await build({
  test: false,
  packageManager: 'pnpm',
  scriptModule: false,
  entryPoints: ['./mod.ts'],
  outDir: './npm',
  shims: {
    webSocket: true,
  },
  compilerOptions: {
    target: 'ES2021',
  },
  mappings: {
    'https://deno.land/x/revoltio_rest@v1.1.3/mod.ts': {
      name: '@revoltio/rest',
      version: '^1.1.3',
    },
  },
  package: {
    name: 'revolt.io',
    version: Deno.args[0].replace(/[A-Z]+/gi, ''),
    description: 'A NodeJS & Deno Revolt library"',
    license: 'Apache-2',
    devDependencies: {
      '@types/node': '16.x.x',
      '@types/ws': '^8.5.3',
    },
    repository: {
      type: 'git',
      url: 'git+https://github.com/revolt-io/revolt.io.git',
    },
    bugs: {
      url: 'https://github.com/revolt-io/revolt.io/issues',
    },
    keywords: [
      'revolt',
      'revoltchat',
      'api',
      'bot',
      'client',
    ],
    engines: {
      node: '>=16.6.0',
    },
    files: [
      'esm/*',
      'types/*',
    ],
  },
});

Deno.copyFileSync('LICENSE', 'npm/LICENSE');
Deno.copyFileSync('README.md', 'npm/README.md');
