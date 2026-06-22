export function CmsRichText({ value, as: Tag = 'div', className = '', ...props }) {
  const content = value || '';
  if (!content) return null;

  if (content.includes('<')) {
    return (
      <Tag
        className={`cms-rich-text ${className}`.trim()}
        dangerouslySetInnerHTML={{ __html: content }}
        {...props}
      />
    );
  }

  return (
    <Tag className={className} {...props}>
      {content}
    </Tag>
  );
}
