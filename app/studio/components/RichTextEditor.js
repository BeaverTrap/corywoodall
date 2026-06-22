'use client';

import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { normalizeEditorHtml, toEditorContent } from '@/lib/studio/richTextContent';
import { RICH_TEXT_VARIANTS } from '@/lib/studio/richTextVariants';

function ToolbarButton({ active, onClick, title, children, className = '' }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`min-w-[2rem] px-2 py-1 text-sm rounded transition-colors ${
        active ? 'bg-black text-white' : 'hover:bg-black/10'
      } ${className}`}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function normalizeSingleLine(editor, html) {
  const normalized = normalizeEditorHtml(html);
  if (!normalized) return '';

  const json = editor.getJSON();
  if (json.content && json.content.length > 1) {
    editor.commands.setContent({ type: 'doc', content: [json.content[0]] }, { emitUpdate: false });
    return normalizeEditorHtml(editor.getHTML());
  }

  return normalized;
}

export default function RichTextEditor({
  value,
  onChange,
  minRows = 6,
  placeholder = 'Write here…',
  hint,
  variant = 'default',
  toolbar = 'full',
  bordered = true,
  singleLine = false,
}) {
  const minHeight = singleLine ? 40 : minRows * 26;
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const variantClass = RICH_TEXT_VARIANTS[variant] || RICH_TEXT_VARIANTS.default;
  const showLists = toolbar === 'full' && !singleLine;
  const showLink = toolbar === 'full' || toolbar === 'inline';

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: showLists,
        orderedList: showLists,
        blockquote: showLists,
        hardBreak: !singleLine,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'underline',
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: toEditorContent(value),
    immediatelyRender: false,
    onUpdate: ({ editor: activeEditor }) => {
      let html = activeEditor.getHTML();
      if (singleLine) {
        html = normalizeSingleLine(activeEditor, html);
      }
      onChange(normalizeEditorHtml(html));
    },
    editorProps: {
      attributes: {
        class: `${variantClass} focus:outline-none px-1 py-1`,
        style: `min-height: ${minHeight}px`,
      },
      handleKeyDown: (_view, event) => {
        if (singleLine && event.key === 'Enter') {
          event.preventDefault();
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const incoming = normalizeEditorHtml(value || '');
    const current = normalizeEditorHtml(editor.getHTML());

    if (incoming !== current) {
      editor.commands.setContent(toEditorContent(value || ''), { emitUpdate: false });
    }
  }, [value, editor]);

  const openLinkEditor = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setShowLinkInput(true);
  };

  const applyLink = () => {
    if (!editor) return;

    const url = linkUrl.trim();
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }

    setShowLinkInput(false);
    setLinkUrl('');
  };

  const removeLink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setShowLinkInput(false);
    setLinkUrl('');
  };

  if (!editor) {
    return (
      <div
        className={`${bordered ? 'rounded-lg border border-black/20 bg-white' : ''} animate-pulse`}
        style={{ minHeight }}
      />
    );
  }

  const toolbarEl = (
    <div
      className={`flex flex-wrap items-center gap-1 px-1 py-1 ${
        bordered ? 'border-b border-black/10 bg-stone-50' : 'bg-black/5 rounded mb-1'
      }`}
      role="toolbar"
      aria-label="Text formatting"
    >
      <ToolbarButton
        title="Bold"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="font-bold"
      >
        B
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="italic"
      >
        I
      </ToolbarButton>
      {showLink ? (
        <ToolbarButton title="Link" active={editor.isActive('link')} onClick={openLinkEditor}>
          Link
        </ToolbarButton>
      ) : null}
      {showLists ? (
        <>
          <span className="w-px h-5 bg-black/15 mx-1" aria-hidden="true" />
          <ToolbarButton
            title="Bullet list"
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            • List
          </ToolbarButton>
          <ToolbarButton
            title="Numbered list"
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1. List
          </ToolbarButton>
          <ToolbarButton
            title="Quote"
            active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            “
          </ToolbarButton>
        </>
      ) : null}
    </div>
  );

  return (
    <div className={bordered ? 'rounded-lg border border-black/20 overflow-hidden bg-white' : ''}>
      {toolbar !== 'none' ? toolbarEl : null}

      {showLinkInput ? (
        <div
          className={`flex flex-wrap items-center gap-2 px-2 py-2 ${
            bordered ? 'border-b border-black/10 bg-stone-50' : 'bg-black/5 rounded mb-1'
          }`}
        >
          <input
            type="url"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                applyLink();
              }
              if (event.key === 'Escape') {
                setShowLinkInput(false);
              }
            }}
            placeholder="https://example.com"
            className="flex-1 min-w-[200px] border border-black/20 rounded px-2 py-1 text-sm"
            autoFocus
          />
          <button
            type="button"
            className="px-3 py-1 text-sm rounded bg-black text-white"
            onClick={applyLink}
          >
            Apply
          </button>
          <button
            type="button"
            className="px-3 py-1 text-sm rounded border border-black/20"
            onClick={removeLink}
          >
            Remove
          </button>
        </div>
      ) : null}

      <EditorContent editor={editor} />
      {hint ? (
        <p className={`text-xs text-black/50 py-1 ${bordered ? 'px-3 border-t border-black/5' : ''}`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
