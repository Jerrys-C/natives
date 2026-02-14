/**
 * Build script to parse all native .md files into a single JSON data file.
 * This JSON is consumed by the website at build time and runtime.
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..', '..')

// Directories to skip (not native namespaces)
const SKIP_DIRS = new Set(['.ci', '.git', '.github', 'website', 'node_modules', '.next'])

function parseNativeFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8')

  // Parse YAML front matter
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!fmMatch) return null

  const frontMatter = fmMatch[1]
  const body = raw.slice(fmMatch[0].length).trim()

  // Extract namespace
  const nsMatch = frontMatter.match(/ns:\s*(.+)/)
  const ns = nsMatch ? nsMatch[1].trim() : null
  if (!ns) return null

  // Extract aliases
  const aliasMatch = frontMatter.match(/aliases:\s*\[([^\]]*)\]/)
  const aliases = aliasMatch
    ? aliasMatch[1].split(',').map(a => a.trim().replace(/"/g, ''))
    : []

  // Extract native name (## heading)
  const nameMatch = body.match(/^##\s+(.+)$/m)
  const name = nameMatch ? nameMatch[1].trim() : null
  if (!name) return null

  // Extract C signature
  const sigMatch = body.match(/```c\n([\s\S]*?)```/)
  let hash = ''
  let signature = ''
  if (sigMatch) {
    const sigBlock = sigMatch[1].trim()
    const hashMatch = sigBlock.match(/\/\/\s*(0x[0-9A-Fa-f]+)/)
    hash = hashMatch ? hashMatch[1] : ''
    // Signature is the last line(s) after the comment
    const lines = sigBlock.split('\n')
    signature = lines.filter(l => !l.trim().startsWith('//')).join('\n').trim()
  }

  // Extract description (text between signature block and ## Parameters)
  let description = ''
  const afterSig = sigMatch ? body.slice(body.indexOf('```', body.indexOf('```c') + 4) + 3) : body
  const descMatch = afterSig.split(/^##\s/m)
  if (descMatch[0]) {
    description = descMatch[0].trim()
  }

  // Extract parameters
  const params = []
  const paramSection = body.match(/## Parameters\n([\s\S]*?)(?=\n## |\n$|$)/)
  if (paramSection) {
    const paramLines = paramSection[1].match(/\*\s+\*\*(\w+)\*\*:?\s*(.*)/g)
    if (paramLines) {
      paramLines.forEach(line => {
        const m = line.match(/\*\s+\*\*(\w+)\*\*:?\s*(.*)/)
        if (m) {
          params.push({ name: m[1], description: m[2].trim() })
        }
      })
    }
  }

  // Extract return value
  let returnValue = ''
  const retMatch = body.match(/## Return value\n([\s\S]*?)(?=\n## |\n$|$)/)
  if (retMatch) {
    returnValue = retMatch[1].trim()
  }

  // Extract examples
  const examples = []
  const exampleSection = body.match(/## Examples?\n([\s\S]*)$/)
  if (exampleSection) {
    const codeBlocks = exampleSection[1].matchAll(/```(\w+)\n([\s\S]*?)```/g)
    for (const block of codeBlocks) {
      examples.push({ lang: block[1], code: block[2].trim() })
    }
  }

  return {
    name,
    hash,
    ns,
    aliases,
    signature,
    description,
    params,
    returnValue,
    examples
  }
}

function buildNativesData() {
  const namespaces = {}
  const entries = fs.readdirSync(ROOT, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory() || SKIP_DIRS.has(entry.name)) continue

    const nsDir = path.join(ROOT, entry.name)
    const files = fs.readdirSync(nsDir).filter(f => f.endsWith('.md'))

    if (files.length === 0) continue

    const nsName = entry.name
    namespaces[nsName] = {
      name: nsName,
      natives: []
    }

    for (const file of files) {
      try {
        const native = parseNativeFile(path.join(nsDir, file))
        if (native) {
          namespaces[nsName].natives.push(native)
        }
      } catch (err) {
        console.error(`Error parsing ${nsDir}/${file}:`, err.message)
      }
    }

    // Sort natives alphabetically
    namespaces[nsName].natives.sort((a, b) => a.name.localeCompare(b.name))
    namespaces[nsName].count = namespaces[nsName].natives.length
  }

  return namespaces
}

const data = buildNativesData()
const totalCount = Object.values(data).reduce((sum, ns) => sum + ns.count, 0)

const outPath = path.join(__dirname, '..', 'public', 'natives-data.json')
fs.writeFileSync(outPath, JSON.stringify(data, null, 0))

console.log(`Built natives data: ${Object.keys(data).length} namespaces, ${totalCount} natives`)
console.log(`Output: ${outPath} (${(fs.statSync(outPath).size / 1024 / 1024).toFixed(2)} MB)`)
