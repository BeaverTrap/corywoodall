'use client';

import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { normalizeEditorHtml, toEditorContent } from '@/lib/studio/richTextContent';

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

export default function RichTextEditor({
  value,
  onChange,
  minRows = 6,
  placeholder = 'Write here…',
  hint,
}) {
  const minHeight = minRows * 26;
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
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
      onChange(normalizeEditorHtml(activeEditor.getHTML()));
    },
    editorProps: {
      attributes: {
        class: 'studio-rich-text focus:outline-none px-3 py-2 text-sm leading-relaxed',
        style: `min-height: ${minHeight}px`,
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
        className="rounded-lg border border-black/20 bg-white animate-pulse"
        style={{ minHeight }}
      />
    );
  }

  return (
    <div className="rounded-lg border border-black/20 overflow-hidden bg-white">
      <div
        className="flex flex-wrap items-center gap-1 border-b border-black/10 bg-stone-50 px-2 py-1.5"
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
        <ToolbarButton title="Link" active={editor.isActive('link')} onClick={openLinkEditor}>
          Link
        </ToolbarButton>
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
      </div>

      {showLinkInput ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-black/10 bg-stone-50 px-3 py-2">
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
      {hint ? <p className="text-xs text-black/50 px-3 py-2 border-t border-black/5">{hint}</p> : null}
    </div>
  );
}
