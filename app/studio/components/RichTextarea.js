'use client';

import RichTextEditor from '@/app/studio/components/RichTextEditor';

/** WYSIWYG rich text field (TipTap). `rows` sets minimum editor height. */
export default function RichTextarea({ value, onChange, rows = 6, placeholder, hint }) {
  return (
    <RichTextEditor
      value={value}
      onChange={onChange}
      minRows={rows}
      placeholder={placeholder}
      hint={hint}
    />
  );
}
