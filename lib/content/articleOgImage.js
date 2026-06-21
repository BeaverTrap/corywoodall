export function getArticleOgImage(blocks) {
  for (const block of blocks || []) {
    if (block.block_type === 'image' && block.content?.src) {
      return block.content.src;
    }

    if (block.block_type === 'image_grid') {
      const first = (block.content?.images || []).find((image) => image.src);
      if (first?.src) return first.src;
    }
  }

  return null;
}
