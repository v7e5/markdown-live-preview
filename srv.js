#!/usr/bin/node
import {watch} from 'node:fs'
import {readFile, stat} from 'node:fs/promises'
import {createServer} from 'node:http'
import md from 'showdown'

const file_to_watch = process.env.FILE_TO_WATCH ?? 'readme.md'
const port = process.env.PORT ?? 8000

const conv = new md.Converter()
conv.setFlavor('github')
conv.setOption('simpleLineBreaks', false)

let sse_rsp = null, mtime = 0, mtime_prev = 0

const push = async () => {
  sse_rsp.write('data: '
    + JSON.stringify(
        conv.makeHtml(await readFile(file_to_watch, {encoding: 'utf8'})))
    + '\n\n')
}

watch(file_to_watch).on('change', async () => {
  mtime = (await stat(file_to_watch)).mtimeMs
  if (mtime > mtime_prev) {
    mtime_prev = mtime
    push()
  }
})

createServer(async (req, rsp) => {
  if (req.url === '/sse') {
    rsp.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive'
    })
    sse_rsp = rsp
    push()
  } else {
    rsp.writeHead(200, {'Content-Type': 'text/html'})
    rsp.end(await readFile('index.html', {encoding: 'utf8'}))
  }
}).listen(port, () => {
  console.log('listening on :' + port)
})
