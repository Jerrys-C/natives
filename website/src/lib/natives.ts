import fs from "fs";
import path from "path";
import matter from "gray-matter";

const NATIVES_ROOT = path.join(process.cwd(), "..");

const SKIP_DIRS = new Set([
  ".git",
  ".github",
  ".ci",
  "website",
  "node_modules",
  "in",
  "out",
]);

export interface NativeParam {
  name: string;
  description: string;
}

export interface NativeData {
  name: string;
  namespace: string;
  hash: string;
  jhash: string;
  signature: string;
  description: string;
  params: NativeParam[];
  examples: { lang: string; code: string }[];
  aliases: string[];
  apiset?: string;
  rawContent: string;
  fileName: string;
}

export interface NamespaceInfo {
  name: string;
  count: number;
}

// Matches: ```c\n// 0xHASH 0xJHASH?\nsignature\n```
const SIGNATURE_BLOCK_RE = /```c\s*\n\/\/\s*(0x[A-Fa-f0-9]+)\s*(0x[A-Fa-f0-9]+)?\s*\n(.+?)\n```/s;
// Matches: ## Parameters\n<content until next section>
const PARAMS_SECTION_RE = /## Parameters\s*\n([\s\S]*?)(?=\n## |\n```|$)/;
// Matches: * **paramName**: description
const PARAM_LINE_RE = /\*\s*\*\*(\w+)\*\*:?\s*(.*)/;
// Matches: description text between closing ``` and next ## section
const DESCRIPTION_RE = /```\s*\n\n([\s\S]*?)(?=\n## Parameters|\n## Examples?|\n```|$)/;

function parseNativeContent(content: string, namespace: string, fileName: string): NativeData {
  const { data: frontmatter, content: body } = matter(content);

  const name = fileName.replace(/\.md$/, "");
  const aliases: string[] = frontmatter.aliases || [];
  const apiset: string | undefined = frontmatter.apiset;

  let signature = "";
  let hash = "";
  let jhash = "";
  const sigMatch = body.match(SIGNATURE_BLOCK_RE);
  if (sigMatch) {
    hash = sigMatch[1] || "";
    jhash = sigMatch[2] || "";
    signature = sigMatch[3]?.trim() || "";
  }

  const params: NativeParam[] = [];
  const paramSection = body.match(PARAMS_SECTION_RE);
  if (paramSection) {
    const paramLines = paramSection[1].match(new RegExp(PARAM_LINE_RE.source, "g"));
    if (paramLines) {
      for (const line of paramLines) {
        const m = line.match(PARAM_LINE_RE);
        if (m) {
          params.push({ name: m[1], description: m[2].trim() });
        }
      }
    }
  }

  let description = "";
  const descMatch = body.match(DESCRIPTION_RE);
  if (descMatch) {
    // Skip if it's just code blocks or parameter sections
    const descText = descMatch[1].trim();
    if (descText && !descText.startsWith("## ") && !descText.startsWith("```")) {
      description = descText;
    }
  }

  // Extract examples
  const examples: { lang: string; code: string }[] = [];
  const exampleSection = body.match(/## Examples?\s*\n([\s\S]*?)$/);
  if (exampleSection) {
    const codeBlocks = exampleSection[1].matchAll(/```(\w+)\s*\n([\s\S]*?)```/g);
    for (const block of codeBlocks) {
      examples.push({ lang: block[1], code: block[2].trim() });
    }
  } else {
    // Also find code examples that appear after parameters but aren't in an Examples section
    const allBlocks = [...body.matchAll(/```(\w+)\s*\n([\s\S]*?)```/g)];
    // Skip the first one (signature) and enum blocks
    for (let i = 1; i < allBlocks.length; i++) {
      const lang = allBlocks[i][1];
      if (lang !== "c") {
        examples.push({ lang, code: allBlocks[i][2].trim() });
      }
    }
  }

  return {
    name,
    namespace,
    hash,
    jhash,
    signature,
    description,
    params,
    examples,
    aliases,
    apiset,
    rawContent: body,
    fileName,
  };
}

export function getNamespaces(): NamespaceInfo[] {
  const entries = fs.readdirSync(NATIVES_ROOT, { withFileTypes: true });
  const namespaces: NamespaceInfo[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || SKIP_DIRS.has(entry.name)) continue;
    // Only include directories that contain .md files
    const dirPath = path.join(NATIVES_ROOT, entry.name);
    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".md"));
    if (files.length > 0) {
      namespaces.push({ name: entry.name, count: files.length });
    }
  }

  return namespaces.sort((a, b) => a.name.localeCompare(b.name));
}

export function getNativesForNamespace(namespace: string): NativeData[] {
  const dirPath = path.join(NATIVES_ROOT, namespace);
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".md"));
  const natives: NativeData[] = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(dirPath, file), "utf-8");
    natives.push(parseNativeContent(content, namespace, file));
  }

  return natives.sort((a, b) => a.name.localeCompare(b.name));
}

export function getNative(namespace: string, nativeName: string): NativeData | null {
  const filePath = path.join(NATIVES_ROOT, namespace, `${nativeName}.md`);
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, "utf-8");
  return parseNativeContent(content, namespace, `${nativeName}.md`);
}

export function getAllNativeSummaries(): { name: string; namespace: string; hash: string; signature: string }[] {
  const namespaces = getNamespaces();
  const summaries: { name: string; namespace: string; hash: string; signature: string }[] = [];

  for (const ns of namespaces) {
    const natives = getNativesForNamespace(ns.name);
    for (const n of natives) {
      summaries.push({
        name: n.name,
        namespace: n.namespace,
        hash: n.hash,
        signature: n.signature,
      });
    }
  }

  return summaries;
}
