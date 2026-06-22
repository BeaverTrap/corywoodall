'use client';

import RichTextEditor from '@/app/studio/components/RichTextEditor';

/** WYSIWYG rich text field (TipTap). `rows` sets minimum editor height. */
export default function RichTextarea({
  value,
  onChange,
  rows = 6,
  placeholder,
  hint,
  variant = 'default',
  toolbar = 'full',
  bordered = true,
  singleLine = false,
}) {
  return (
    <RichTextEditor
      value={value}
      onChange={onChange}
      minRows={rows}
      placeholder={placeholder}
      hint={hint}
      variant={variant}
      toolbar={toolbar}
      bordered={bordered}
      singleLine={singleLine}
    />
  );
}
