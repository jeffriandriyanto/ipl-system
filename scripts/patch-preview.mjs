import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const rendererPath = resolve(process.cwd(), '.output/server/chunks/routes/renderer.mjs');

try {
  let code = readFileSync(rendererPath, 'utf-8');
  const target = 'const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = renderSSRHead(ssrContext.head, renderSSRHeadOptions);';
  const replacement = 'const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(ssrContext.head, renderSSRHeadOptions);';

  if (code.includes(replacement)) {
    console.log('✓ Patch already applied to renderer.mjs');
    process.exit(0);
  }

  if (!code.includes(target)) {
    console.error('✗ Could not find target string in renderer.mjs. The file may have changed.');
    process.exit(1);
  }

  code = code.replace(target, replacement);
  writeFileSync(rendererPath, code, 'utf-8');
  console.log('✓ Patched renderSSRHead to use await in renderer.mjs');
} catch (err) {
  if (err.code === 'ENOENT') {
    console.log('ℹ renderer.mjs not found — skipping patch (may be first build)');
    process.exit(0);
  }
  throw err;
}
