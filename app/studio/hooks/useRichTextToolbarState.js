'use client';

import { useEditorState } from '@tiptap/react';

export function useRichTextToolbarState(editor) {
  return useEditorState({
    editor,
    selector: ({ editor: activeEditor }) => {
      if (!activeEditor) {
        return null;
      }

      let textStyle = 'paragraph';
      if (activeEditor.isActive('heading', { level: 2 })) textStyle = 'h2';
      if (activeEditor.isActive('heading', { level: 3 })) textStyle = 'h3';

      return {
        textStyle,
        isBold: activeEditor.isActive('bold'),
        isItalic: activeEditor.isActive('italic'),
        isUnderline: activeEditor.isActive('underline'),
        isStrike: activeEditor.isActive('strike'),
        isLink: activeEditor.isActive('link'),
        linkHref: activeEditor.getAttributes('link').href || '',
        isBulletList: activeEditor.isActive('bulletList'),
        isOrderedList: activeEditor.isActive('orderedList'),
        isBlockquote: activeEditor.isActive('blockquote'),
        alignLeft: activeEditor.isActive({ textAlign: 'left' }),
        alignCenter: activeEditor.isActive({ textAlign: 'center' }),
        alignRight: activeEditor.isActive({ textAlign: 'right' }),
        alignJustify: activeEditor.isActive({ textAlign: 'justify' }),
        canUndo: activeEditor.can().chain().focus().undo().run(),
        canRedo: activeEditor.can().chain().focus().redo().run(),
      };
    },
  });
}
