#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const appDir = path.join(__dirname, '..', 'src', 'app')

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const full = path.join(dir, file)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      walk(full, fileList)
    } else {
      fileList.push(full)
    }
  })
  return fileList
}

function fileToRoute(file) {
  const rel = path.relative(appDir, file)
  if (!rel) return null
  const parts = rel.split(path.sep)
  if (parts.includes('api')) return null

  const filename = parts.pop()
  const dirPath = parts
  if (filename.startsWith('page')) {
    const route = '/' + dirPath.join('/')
    return route === '/' || route === '/.' ? '/' : route.replace(/\\/g, '/')
  }
  if (filename.startsWith('route')) {
    const route = '/' + dirPath.join('/')
    return route === '/' || route === '/.' ? '/' : route.replace(/\\/g, '/')
  }
  return '/' + path.join(...parts, filename).replace(/\\/g, '/')
}

if (!fs.existsSync(appDir)) {
  console.error('Could not find app directory at', appDir)
  process.exit(1)
}

const files = walk(appDir)
const routes = new Set()
files.forEach((f) => {
  const r = fileToRoute(f)
  if (r) routes.add(r)
})

const sorted = Array.from(routes).sort((a,b)=>a.localeCompare(b))
console.log('Discovered routes:')
sorted.forEach(r => console.log('-', r))

console.log(`\nTotal routes: ${sorted.length}`)
