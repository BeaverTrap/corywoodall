import { stripHtmlToText } from '@/lib/studio/richTextContent';

const ALLOWED_TAGS = new Set([
  'P',
  'BR',
  'STRONG',
  'B',
  'EM',
  'I',
  'U',
  'S',
  'STRIKE',
  'DEL',
  'A',
  'UL',
  'OL',
  'LI',
  'H2',
  'H3',
  'BLOCKQUOTE',
]);

const BLOCK_TAGS = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE', 'DIV']);

function parseStyle(styleString) {
  const styles = {};
  if (!styleString) return styles;

  styleString.split(';').forEach((part) => {
    const colon = part.indexOf(':');
    if (colon === -1) return;
    const key = part.slice(0, colon).trim().toLowerCase();
    const value = part.slice(colon + 1).trim().toLowerCase();
    if (key) styles[key] = value;
  });

  return styles;
}

function isBold(styles, tagName) {
  if (tagName === 'B' || tagName === 'STRONG') return true;
  const weight = styles['font-weight'];
  return weight === 'bold' || weight === '700' || weight === '600' || Number(weight) >= 600;
}

function isItalic(styles, tagName) {
  if (tagName === 'I' || tagName === 'EM') return true;
  return styles['font-style'] === 'italic';
}

function isUnderline(styles, tagName) {
  if (tagName === 'U') return true;
  const decoration = styles['text-decoration'] || styles['text-decoration-line'] || '';
  return decoration.includes('underline');
}

function isStrike(styles, tagName) {
  if (tagName === 'S' || tagName === 'STRIKE' || tagName === 'DEL') return true;
  const decoration = styles['text-decoration'] || styles['text-decoration-line'] || '';
  return decoration.includes('line-through');
}

function parseFontSizePt(styles) {
  const size = styles['font-size'];
  if (!size) return null;
  const pt = size.match(/([\d.]+)pt/);
  if (pt) return Number(pt[1]);
  const px = size.match(/([\d.]+)px/);
  if (px) return Number(px[1]) * 0.75;
  return null;
}

function inferBlockTag(element) {
  const tag = element.tagName;
  if (/^H[1-6]$/.test(tag)) {
    if (tag === 'H1' || tag === 'H2') return 'H2';
    return 'H3';
  }

  const styles = parseStyle(element.getAttribute('style') || '');
  const pt = parseFontSizePt(styles);
  const bold = isBold(styles, tag) || element.querySelector('b,strong');

  if (pt && pt >= 16 && bold) return 'H2';
  if (pt && pt >= 13 && bold) return 'H3';
  if (bold && element.textContent && element.textContent.length < 120) return 'H3';

  return 'P';
}

function sanitizeHref(href) {
  const value = (href || '').trim();
  if (!value) return null;
  if (/^(https?:|mailto:|tel:|#)/i.test(value)) return value;
  if (value.startsWith('//')) return `https:${value}`;
  return `https://${value}`;
}

function wrapNodeContents(node, wrappers) {
  let current = node;
  wrappers.forEach((tagName) => {
    const wrapper = node.ownerDocument.createElement(tagName);
    while (current.firstChild) {
      wrapper.appendChild(current.firstChild);
    }
    current.appendChild(wrapper);
    current = wrapper;
  });
}

function promoteInlineElement(element) {
  const tag = element.tagName;
  const styles = parseStyle(element.getAttribute('style') || '');
  const wrappers = [];

  if (isStrike(styles, tag)) wrappers.push('s');
  if (isUnderline(styles, tag)) wrappers.push('u');
  if (isItalic(styles, tag)) wrappers.push('em');
  if (isBold(styles, tag)) wrappers.push('strong');

  if (wrappers.length) {
    wrapNodeContents(element, wrappers);
  }

  unwrapElement(element);
}

function unwrapElement(element) {
  const parent = element.parentNode;
  if (!parent) return;

  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }
  parent.removeChild(element);
}

function replaceElementTag(element, tagName) {
  const replacement = element.ownerDocument.createElement(tagName);
  while (element.firstChild) {
    replacement.appendChild(element.firstChild);
  }
  element.parentNode?.replaceChild(replacement, element);
  return replacement;
}

function stripAttributes(element, { keepHref = false } = {}) {
  [...element.attributes].forEach((attr) => {
    if (keepHref && attr.name === 'href') return;
    element.removeAttribute(attr.name);
  });
}

function hasBlockChild(element) {
  return [...element.children].some((child) => BLOCK_TAGS.has(child.tagName));
}

function normalizeNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    node.remove();
    return;
  }

  const element = node;
  const tag = element.tagName;

  if (tag === 'META' || tag === 'STYLE' || tag === 'SCRIPT' || tag === 'LINK' || tag === 'HEAD') {
    element.remove();
    return;
  }

  [...element.childNodes].forEach((child) => normalizeNode(child));

  if (tag === 'SPAN' || tag === 'FONT') {
    promoteInlineElement(element);
    return;
  }

  if (tag === 'B') {
    replaceElementTag(element, 'strong');
    stripAttributes(element);
    return;
  }

  if (tag === 'I') {
    replaceElementTag(element, 'em');
    stripAttributes(element);
    return;
  }

  if (tag === 'A') {
    const href = sanitizeHref(element.getAttribute('href'));
    if (!href || !element.textContent?.trim()) {
      unwrapElement(element);
      return;
    }
    stripAttributes(element);
    element.setAttribute('href', href);
    return;
  }

  if (tag === 'DIV') {
    const nextTag = hasBlockChild(element) ? null : inferBlockTag(element);
    if (nextTag) {
      replaceElementTag(element, nextTag);
      stripAttributes(element);
      return;
    }
    unwrapElement(element);
    return;
  }

  if (/^H[1-6]$/.test(tag)) {
    const nextTag = inferBlockTag(element);
    if (nextTag !== tag) {
      replaceElementTag(element, nextTag);
    }
    stripAttributes(element);
    return;
  }

  if (tag === 'P' || tag === 'LI' || tag === 'BLOCKQUOTE') {
    const styles = parseStyle(element.getAttribute('style') || '');
    let block = element;

    if (tag === 'P') {
      const inferred = inferBlockTag(element);
      if (inferred.startsWith('H')) {
        block = replaceElementTag(element, inferred);
      }
    }

    stripAttributes(block);

    if (tag === 'P' && isBold(styles, tag) && !block.querySelector('strong,em,u,s,a')) {
      wrapNodeContents(block, ['strong']);
    }
    return;
  }

  if (tag === 'UL' || tag === 'OL') {
    stripAttributes(element);
    return;
  }

  if (tag === 'BR') {
    stripAttributes(element);
    return;
  }

  if (!ALLOWED_TAGS.has(tag)) {
    unwrapElement(element);
    return;
  }

  stripAttributes(element);
}

function mergeAdjacentElements(parent) {
  const children = [...parent.childNodes];
  children.forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      mergeAdjacentElements(child);
    }
  });

  for (let index = 0; index < parent.childNodes.length - 1; ) {
    const current = parent.childNodes[index];
    const next = parent.childNodes[index + 1];

    if (
      current.nodeType === Node.ELEMENT_NODE &&
      next.nodeType === Node.ELEMENT_NODE &&
      current.tagName === next.tagName &&
      current.tagName === 'P' &&
      !current.innerHTML.trim()
    ) {
      next.remove();
      continue;
    }

    index += 1;
  }
}

function removeEmptyNodes(parent) {
  [...parent.childNodes].forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      removeEmptyNodes(child);
      if (
        child.tagName !== 'BR' &&
        !child.textContent?.replace(/\u00a0/g, ' ').trim() &&
        child.children.length === 0
      ) {
        child.remove();
      }
    }
  });
}

/**
 * Paste from Google Docs, Word, etc. → semantic HTML that uses site/cms styles,
 * not the source app's fonts, colors, or spacing.
 */
export function normalizePastedHtml(html, { singleLine = false } = {}) {
  const input = (html || '').trim();
  if (!input) return '';
  if (typeof document === 'undefined') return input;

  if (singleLine) {
    return stripHtmlToText(input);
  }

  if (!input.includes('<')) {
    return input
      .split(/\n\n+/)
      .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
      .join('');
  }

  const doc = new DOMParser().parseFromString(input, 'text/html');
  normalizeNode(doc.body);
  removeEmptyNodes(doc.body);
  mergeAdjacentElements(doc.body);

  const output = doc.body.innerHTML
    .replace(/\u00a0/g, ' ')
    .replace(/<p>\s*<\/p>/gi, '')
    .trim();

  return output || stripHtmlToText(input);
}
