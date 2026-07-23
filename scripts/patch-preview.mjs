import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const paths = [
  '.output/server/chunks/routes/renderer.mjs',
  '.netlify/functions-internal/server/chunks/routes/renderer.mjs',
];

const target = 'const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = renderSSRHead(ssrContext.head, renderSSRHeadOptions);';
const replacement = 'const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(ssrContext.head, renderSSRHeadOptions);';

let patched = 0;

for (const relPath of paths) {
  const filePath = resolve(process.cwd(), relPath);
  if (!existsSync(filePath)) continue;

  let code = readFileSync(filePath, 'utf-8');

  if (code.includes(replacement)) {
    console.log(`✓ Already patched: ${relPath}`);
    patched++;
    continue;
  }

  if (!code.includes(target)) {
    console.log(`ℹ Target not found in ${relPath} — file may have changed`);
    continue;
  }

  code = code.replace(target, replacement);
  writeFileSync(filePath, code, 'utf-8');
  console.log(`✓ Patched: ${relPath}`);
  patched++;
}

if (patched === 0) {
  console.log('ℹ No renderer files found to patch');
}
