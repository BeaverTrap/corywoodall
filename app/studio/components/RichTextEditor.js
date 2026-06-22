'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { MdOpenInNew, MdEdit, MdLinkOff } from 'react-icons/md';
import { normalizePastedHtml } from '@/lib/studio/pasteCleanup';
import { normalizeEditorHtml, toEditorContent } from '@/lib/studio/richTextContent';
import { createRichTextExtensions } from '@/lib/studio/richTextExtensions';
import { RICH_TEXT_VARIANTS } from '@/lib/studio/richTextVariants';
import RichTextToolbar, { RichTextBubbleToolbar } from '@/app/studio/components/RichTextToolbar';

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
  toolbarReveal = bordered ? 'always' : 'focus',
}) {
  const minHeight = singleLine ? 44 : minRows * 28;
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const openLinkRef = useRef(() => {});
  const variantClass = RICH_TEXT_VARIANTS[variant] || RICH_TEXT_VARIANTS.default;
  const effectiveToolbar = singleLine && toolbar === 'full' ? 'inline' : toolbar;

  const extensions = useMemo(
    () => createRichTextExtensions({ placeholder, toolbar: effectiveToolbar, singleLine }),
    [placeholder, effectiveToolbar, singleLine]
  );

  const editor = useEditor(
    {
      extensions,
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
          class: `${variantClass} studio-editor-prose focus:outline-none`,
          style: `min-height: ${minHeight}px`,
        },
        handleKeyDown: (_view, event) => {
          if (singleLine && event.key === 'Enter') {
            event.preventDefault();
            return true;
          }
          if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            openLinkRef.current();
            return true;
          }
          return false;
        },
        transformPastedHTML: (html) => normalizePastedHtml(html, { singleLine }),
      },
    },
    [extensions, minHeight, singleLine, variantClass]
  );

  useEffect(() => {
    if (!editor) return;

    const onFocus = () => setIsFocused(true);
    const onBlur = () => {
      if (!showLinkInput) {
        setIsFocused(false);
      }
    };

    editor.on('focus', onFocus);
    editor.on('blur', onBlur);

    return () => {
      editor.off('focus', onFocus);
      editor.off('blur', onBlur);
    };
  }, [editor, showLinkInput]);

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
    setIsFocused(true);
  };

  openLinkRef.current = openLinkEditor;

  const applyLink = () => {
    if (!editor) return;

    const url = linkUrl.trim();
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
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
        className={`studio-editor ${bordered ? 'studio-editor-bordered' : 'studio-editor-embedded'}`}
        style={{ minHeight: minHeight + (effectiveToolbar !== 'none' ? 48 : 0) }}
      >
        <div className="studio-editor-surface animate-pulse" style={{ minHeight }} />
      </div>
    );
  }

  const showBubble = effectiveToolbar === 'full' && !singleLine;
  const showToolbar =
    effectiveToolbar !== 'none' &&
    (toolbarReveal === 'always' || isFocused || showLinkInput);
  const editorClassName = [
    'studio-editor',
    bordered ? 'studio-editor-bordered' : 'studio-editor-embedded',
    isFocused ? 'studio-editor-focused' : '',
    toolbarReveal === 'focus' && !showToolbar && effectiveToolbar !== 'none'
      ? 'studio-editor-toolbar-hidden'
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={editorClassName}>
      {showToolbar ? (
        <RichTextToolbar
          editor={editor}
          mode={effectiveToolbar}
          showLinkInput={showLinkInput}
          linkUrl={linkUrl}
          onLinkUrlChange={setLinkUrl}
          onOpenLink={openLinkEditor}
          onApplyLink={applyLink}
          onRemoveLink={removeLink}
          onCloseLink={() => {
            setShowLinkInput(false);
            setLinkUrl('');
          }}
        />
      ) : null}

      {showBubble ? (
        <>
          <BubbleMenu
            editor={editor}
            shouldShow={({ editor: activeEditor, state }) => {
              const { empty } = state.selection;
              return !empty && !activeEditor.isActive('link');
            }}
            tippyOptions={{ duration: 120, placement: 'top' }}
            className="studio-bubble-menu"
          >
            <RichTextBubbleToolbar editor={editor} onOpenLink={openLinkEditor} />
          </BubbleMenu>

          <BubbleMenu
            editor={editor}
            shouldShow={({ editor: activeEditor }) => activeEditor.isActive('link')}
            tippyOptions={{ duration: 120, placement: 'bottom' }}
            className="studio-bubble-menu"
          >
            <div className="studio-link-bubble">
              <a
                href={editor.getAttributes('link').href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="studio-link-bubble-url"
              >
                {editor.getAttributes('link').href || 'Link'}
              </a>
              <button
                type="button"
                className="studio-toolbar-btn"
                title="Open link"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  const href = editor.getAttributes('link').href;
                  if (href) window.open(href, '_blank', 'noopener,noreferrer');
                }}
              >
                <MdOpenInNew className="studio-toolbar-icon" />
              </button>
              <button
                type="button"
                className="studio-toolbar-btn"
                title="Edit link"
                onMouseDown={(event) => event.preventDefault()}
                onClick={openLinkEditor}
              >
                <MdEdit className="studio-toolbar-icon" />
              </button>
              <button
                type="button"
                className="studio-toolbar-btn"
                title="Remove link"
                onMouseDown={(event) => event.preventDefault()}
                onClick={removeLink}
              >
                <MdLinkOff className="studio-toolbar-icon" />
              </button>
            </div>
          </BubbleMenu>
        </>
      ) : null}

      <div className="studio-editor-surface">
        <EditorContent editor={editor} />
      </div>

      {hint ? <p className="studio-editor-hint">{hint}</p> : null}
    </div>
  );
}
