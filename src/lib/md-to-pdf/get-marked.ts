import hljs from 'highlight.js';
import { type MarkedExtension, type MarkedOptions, marked } from 'marked';

/**
 * Get a marked instance with syntax highlighting.
 */
export function getMarked(
  options: MarkedOptions = {},
  extensions: MarkedExtension[] = []
) {
  const renderer = new marked.Renderer();

  // Override code block rendering to use highlight.js
  renderer.code = ({ text, lang }) => {
    const language = lang || 'plaintext';
    const highlighted = hljs.highlight(text, {
      language,
      ignoreIllegals: true,
    }).value;
    return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
  };

  marked.setOptions({
    renderer,
    ...options,
  });

  if (extensions.length > 0) {
    marked.use(...extensions);
  }

  return marked;
}
