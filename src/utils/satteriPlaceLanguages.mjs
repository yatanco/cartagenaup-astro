import { defineMdastPlugin } from 'satteri';

/**
 * Wrap the bilingual sections of work-place Markdown in language containers.
 * The content itself remains in Astro's native Markdown rendering pipeline;
 * routes select the appropriate rendered container with CSS.
 */
export default defineMdastPlugin({
  name: 'place-language-sections',
  heading(node, ctx) {
    if (!ctx.fileURL?.pathname.includes('/src/content/work/')) return;

    const text = ctx.textContent(node);
    if (node.depth === 2 && text === 'En / Overview') {
      ctx.replaceNode(node, {
        rawHtml: '<div class="place-content place-content-en" lang="en">',
      });
    }

    if (node.depth === 2 && text === 'Es / Descripción') {
      ctx.replaceNode(node, {
        rawHtml: '</div><div class="place-content place-content-es" lang="es">',
      });
      const root = ctx.parent(node);
      if (root) ctx.appendChild(root, { rawHtml: '</div>' });
    }
  },
});
