export function normalizeEditorHtml(html) {
  const trimmed = (html || '').trim();
  if (!trimmed || trimmed === '<p></p>' || trimmed === '<p><br></p>' || trimmed === '<p><br class="ProseMirror-trailingBreak"></p>') {
    return '';
  }
  return html;
}

/** Plain text or HTML from CMS → TipTap document HTML */
export function toEditorContent(value) {
  if (!value) return '';

  if (value.includes('<')) {
    return value;
  }

  return value
    .split(/\n\n+/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('');
}
