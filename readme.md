# Markdown Live Preview

A tiny (<50 lines) Node.js utility that delivers real-time rendering and
preview for Markdown in the browser using
[Showdown](https://github.com/showdownjs/showdown). I built this tool to help
me quickly preview and verify README formatting for my GitHub projects.

## Features
- Edit in any editor; updates appear instantly on save.
- Lightweight, with all the core logic contained in a small file (`srv.js`),
and a single dependency ([Showdown](https://github.com/showdownjs/showdown))
for Markdown to HTML conversion.
- Uses Server-Sent Events (SSE) / EventSource to stream live updates to a
static page.

## Usage
```shell
pnpm/npm install # adds showdown 
```
then

```shell
pnpm/npm start 

```
OR

```shell
chmod u+x srv.js
./srv.js

```

This starts a server on localhost port 8000 and watches `readme.md` for
changes. The port and file to watch can be configured via environment
variables.

```shell
FILE_TO_WATCH=readme.md
PORT=8000
```

## Notes
- This tool is for localhost use and supports only one SSE client at a time, so
if you have multiple tabs open with the same URL, only the last one receives
updates.
- GitHub Flavored Markdown is the default dialect used in this project. You can
change this and configure other options in `srv.js`.
```javascript
const conv = new md.Converter()
conv.setFlavor('github')
conv.setOption('simpleLineBreaks', false)
```
See [Showdown](https://github.com/showdownjs/showdown) documentation for more
details on flavors and configuration options.
