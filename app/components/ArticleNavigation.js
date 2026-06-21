import Link from 'next/link';

export default function ArticleNavigation({ previous, next }) {
  if (!previous && !next) return null;

  return (
    <div className="mt-12 pt-8 border-t border-black/10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          {previous ? (
            <Link
              href={`/articles/${previous.slug}`}
              className="group inline-flex items-center gap-3 text-black/70 hover:text-black transition-colors"
            >
              <span className="text-black/40 group-hover:text-black/60">←</span>
              <div>
                <p className="text-sm text-black/50 group-hover:text-black/70">Previous article</p>
                <p className="font-medium group-hover:underline">{previous.title}</p>
              </div>
            </Link>
          ) : (
            <p className="text-sm text-black/50">No previous article</p>
          )}
        </div>
        <div className="flex-1 sm:text-right">
          {next ? (
            <Link
              href={`/articles/${next.slug}`}
              className="group inline-flex items-center gap-3 text-black/70 hover:text-black transition-colors sm:float-right"
            >
              <div className="sm:text-right">
                <p className="text-sm text-black/50 group-hover:text-black/70">Next article</p>
                <p className="font-medium group-hover:underline">{next.title}</p>
              </div>
              <span className="text-black/40 group-hover:text-black/60">→</span>
            </Link>
          ) : (
            <p className="text-sm text-black/50 sm:text-right">No next article</p>
          )}
        </div>
      </div>
    </div>
  );
}
