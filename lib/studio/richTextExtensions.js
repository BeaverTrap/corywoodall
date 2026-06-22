import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import TextAlign from '@tiptap/extension-text-align';

export function createRichTextExtensions({ placeholder, toolbar, singleLine }) {
  const isFull = toolbar === 'full' && !singleLine;

  return [
    StarterKit.configure({
      heading: isFull ? { levels: [2, 3] } : false,
      bulletList: isFull,
      orderedList: isFull,
      blockquote: isFull,
      hardBreak: !singleLine,
    }),
    Underline,
    Strike,
    ...(isFull
      ? [
          TextAlign.configure({
            types: ['heading', 'paragraph'],
          }),
        ]
      : []),
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      HTMLAttributes: {
        class: 'underline',
        rel: 'noopener noreferrer',
        target: '_blank',
      },
    }),
    Placeholder.configure({ placeholder }),
  ];
}
