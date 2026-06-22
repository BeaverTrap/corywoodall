'use client';

import {
  MdUndo,
  MdRedo,
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdStrikethroughS,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdFormatAlignJustify,
  MdLink,
  MdFormatClear,
  MdFormatQuote,
} from 'react-icons/md';
import { useRichTextToolbarState } from '@/app/studio/hooks/useRichTextToolbarState';

function ToolbarDivider() {
  return <span className="studio-toolbar-divider" aria-hidden="true" />;
}

function ToolbarButton({ active, onClick, title, children, disabled = false }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      className={`studio-toolbar-btn ${active ? 'studio-toolbar-btn-active' : ''}`}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function StyleSelect({ value, onChange }) {
  return (
    <select
      className="studio-toolbar-select"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Text style"
    >
      <option value="paragraph">Normal text</option>
      <option value="h2">Heading 2</option>
      <option value="h3">Heading 3</option>
    </select>
  );
}

export default function RichTextToolbar({
  editor,
  mode = 'full',
  showLinkInput,
  linkUrl,
  onLinkUrlChange,
  onOpenLink,
  onApplyLink,
  onRemoveLink,
  onCloseLink,
}) {
  const state = useRichTextToolbarState(editor);

  if (!editor || mode === 'none') return null;

  const isFull = mode === 'full';
  const isInline = mode === 'inline';
  const isMinimal = mode === 'minimal';
  const showLink = isFull || isInline;
  const showLists = isFull;
  const showAlign = isFull;
  const showStyle = isFull;
  const showUndo = isFull || isInline;
  const showClear = isFull;

  const applyStyle = (next) => {
    if (next === 'paragraph') {
      editor.chain().focus().setParagraph().run();
      return;
    }
    editor.chain().focus().toggleHeading({ level: Number(next.replace('h', '')) }).run();
  };

  return (
    <div className="studio-toolbar" role="toolbar" aria-label="Text formatting">
      <div className="studio-toolbar-scroll">
        {showUndo ? (
          <>
            <ToolbarButton
              title="Undo (Ctrl+Z)"
              disabled={!state?.canUndo}
              onClick={() => editor.chain().focus().undo().run()}
            >
              <MdUndo className="studio-toolbar-icon" />
            </ToolbarButton>
            <ToolbarButton
              title="Redo (Ctrl+Y)"
              disabled={!state?.canRedo}
              onClick={() => editor.chain().focus().redo().run()}
            >
              <MdRedo className="studio-toolbar-icon" />
            </ToolbarButton>
            <ToolbarDivider />
          </>
        ) : null}

        {showStyle ? (
          <>
            <StyleSelect value={state?.textStyle || 'paragraph'} onChange={applyStyle} />
            <ToolbarDivider />
          </>
        ) : null}

        <ToolbarButton
          title="Bold (Ctrl+B)"
          active={state?.isBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <MdFormatBold className="studio-toolbar-icon" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic (Ctrl+I)"
          active={state?.isItalic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <MdFormatItalic className="studio-toolbar-icon" />
        </ToolbarButton>
        {!isMinimal ? (
          <>
            <ToolbarButton
              title="Underline (Ctrl+U)"
              active={state?.isUnderline}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <MdFormatUnderlined className="studio-toolbar-icon" />
            </ToolbarButton>
            {isFull ? (
              <ToolbarButton
                title="Strikethrough"
                active={state?.isStrike}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              >
                <MdStrikethroughS className="studio-toolbar-icon" />
              </ToolbarButton>
            ) : null}
          </>
        ) : null}

        {showLink ? (
          <>
            <ToolbarDivider />
            <ToolbarButton title="Insert link (Ctrl+K)" active={state?.isLink} onClick={onOpenLink}>
              <MdLink className="studio-toolbar-icon" />
            </ToolbarButton>
          </>
        ) : null}

        {showLists ? (
          <>
            <ToolbarDivider />
            <ToolbarButton
              title="Bulleted list"
              active={state?.isBulletList}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <MdFormatListBulleted className="studio-toolbar-icon" />
            </ToolbarButton>
            <ToolbarButton
              title="Numbered list"
              active={state?.isOrderedList}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <MdFormatListNumbered className="studio-toolbar-icon" />
            </ToolbarButton>
            <ToolbarButton
              title="Quote"
              active={state?.isBlockquote}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <MdFormatQuote className="studio-toolbar-icon" />
            </ToolbarButton>
          </>
        ) : null}

        {showAlign ? (
          <>
            <ToolbarDivider />
            <ToolbarButton
              title="Align left"
              active={state?.alignLeft}
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
              <MdFormatAlignLeft className="studio-toolbar-icon" />
            </ToolbarButton>
            <ToolbarButton
              title="Align center"
              active={state?.alignCenter}
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
            >
              <MdFormatAlignCenter className="studio-toolbar-icon" />
            </ToolbarButton>
            <ToolbarButton
              title="Align right"
              active={state?.alignRight}
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
            >
              <MdFormatAlignRight className="studio-toolbar-icon" />
            </ToolbarButton>
            <ToolbarButton
              title="Justify"
              active={state?.alignJustify}
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            >
              <MdFormatAlignJustify className="studio-toolbar-icon" />
            </ToolbarButton>
          </>
        ) : null}

        {showClear ? (
          <>
            <ToolbarDivider />
            <ToolbarButton
              title="Clear formatting"
              onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            >
              <MdFormatClear className="studio-toolbar-icon" />
            </ToolbarButton>
          </>
        ) : null}
      </div>

      {showLinkInput ? (
        <div className="studio-link-popover">
          <input
            type="url"
            value={linkUrl}
            onChange={(event) => onLinkUrlChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onApplyLink();
              }
              if (event.key === 'Escape') {
                onCloseLink();
              }
            }}
            placeholder="Paste or type a link"
            className="studio-link-input"
            autoFocus
          />
          <button type="button" className="studio-link-apply" onClick={onApplyLink}>
            Apply
          </button>
          <button type="button" className="studio-link-remove" onClick={onRemoveLink}>
            Remove
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function RichTextBubbleToolbar({ editor, onOpenLink }) {
  const state = useRichTextToolbarState(editor);

  if (!editor) return null;

  return (
    <div className="studio-bubble-toolbar" role="toolbar" aria-label="Quick formatting">
      <ToolbarButton
        title="Bold"
        active={state?.isBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <MdFormatBold className="studio-toolbar-icon" />
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        active={state?.isItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <MdFormatItalic className="studio-toolbar-icon" />
      </ToolbarButton>
      <ToolbarButton
        title="Underline"
        active={state?.isUnderline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <MdFormatUnderlined className="studio-toolbar-icon" />
      </ToolbarButton>
      <ToolbarButton title="Link (Ctrl+K)" active={state?.isLink} onClick={onOpenLink}>
        <MdLink className="studio-toolbar-icon" />
      </ToolbarButton>
    </div>
  );
}
