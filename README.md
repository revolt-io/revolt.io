Revolt.io [![NPM version](https://img.shields.io/npm/v/revolt.io.svg?style=flat-square&color=informational)](https://npmjs.com/package/revolt.io)
====


### Overview
A JS/TS library to interacting with Revolt API

### Features
- Follow discord.js philosophy
- Works on both nodejs and deno
- Lightweight
- Voice Support (*work in progress..*)

### Revolt.io vs Revolt.js

| Type              |   Revolt.io  |  Revolt.js   |   winner    |
| :---              | :---         |   :----:     |   ---:    |
|   Performance     |     unknown  |     unknown  | missing benchmark |
|   Size            |     `286KB`  |    `470KB`   | Revolt.io |
|   Packages        |      `3`     |     `12`     | Revolt.io |
|   Deno Support    |      Yes     |     No       | Revolt.io     |
|   Browser Support |      No      |      Yes     | Revolt.js
|   JS Guidelines   |      Follow  | doesn't care | Revolt.io    |

#### Installation (NodeJS Only)
***Node.js v16.x or newer is required.***
```powershell
$ npm i revolt.io
```

### Example Usage
```ts
// for Deno runtime use this
// import { Client } from 'https://deno.land/x/revoltio/mod.ts'
import { Client } from 'revolt.io'

const client = new Client()

client.on('ready', () => {
    console.log('Connected')
    console.log(client.user.username)
})

client.on('message', msg => {
    if (msg.content === '!ping') {
        msg.reply('Pong!')
    }
})

// Connect to Revolt API
client.login('revolt-token-here')

// for user accounts add this extra parameter
// client.login('revolt-token-here', 'user')
```

### Links
- [More examples](/examples)
- [Documentation](https://doc.deno.land/https://deno.land/x/revoltio/mod.ts)
- [GitHub](https://github.com/revoltio/revolt.io)
- [Deno](https://deno.land/x/revoltio)
- [NPM](https://npmjs.com/package/revolt.io)

#### License
Refer to the [LICENSE](LICENSE) file.
