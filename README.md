13H
===
More information will be here one day... For now I'm trying to keep things simple and stupid.

Housekeeping scripts
---
`npm run link` will add references to every package in `lib/*` (`linkedFolders` in package.json) to `package.json`'s
exports and `tsconfig.json`'s paths.

`npm run build-libs` will go to every folder in `libs` and run `npm run build` there - re-building every lib

util
---
Util contains the scripts that do the automated tasks
