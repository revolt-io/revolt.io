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
    custom: [{
      package: {
        name: 'crypto',
      },
      globalNames: ['randomBytes'],
    }],
  },
  mappings: {
    'https://deno.land/x/revoltio_rest@v1.1.0/mod.ts': {
      name: '@revoltio/rest',
      version: '^1.1.0',
    },
    'https://esm.sh/@discordjs/collection@0.6.0': {
      name: '@discordjs/collection',
      version: '^0.6.0',
    },
    'https://deno.land/x/revolt_api@0.4.0/types.ts': {
      name: 'revolt-api',
      version: '^0.5.3-5-patch.4',
    },
  },

  package: {
    name: 'revolt.io',
    version: Deno.args[0].replace(/[A-Z]+/gi, ''),
    description: 'A NodeJS & Deno Revolt library"',
    license: 'Apache-2',
    devDependencies: {
      '@types/node': '^16',
      '@types/ws': '^8.5.3',
      'revolt-api': '^0.5.3-5-patch.4',
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
