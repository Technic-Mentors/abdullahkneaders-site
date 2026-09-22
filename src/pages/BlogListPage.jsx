import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { getBlogPosts } from '../api/blog.api';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { formatDate } from '../utils/format';
import { assetUrl } from '../utils/media';

export default function BlogListPage() {
  const [page, setPage] = useState(1);
  const { data, loading } = useAsync(() => getBlogPosts({ page, pageSize: 9 }), [page]);

  return (
    <div>
      {/* ══════════════ HERO — Sunlit Gradient ══════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gold-100 via-cream to-stone-200">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,96,10,0.1),transparent_65%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(28,25,23,1) 1px, transparent 1px), linear-gradient(90deg, rgba(28,25,23,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <nav className="mb-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-charcoal-light">
            <Link to="/" className="transition-colors hover:text-gold-600">Home</Link>
            <span className="text-stone-400">/</span>
            <span className="font-medium text-charcoal">Blog</span>
          </nav>

          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-600/70" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
              Recipes &amp; Guides
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-600/70" />
          </div>

          <h1 className="font-serif text-4xl leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            Dough Making <span className="text-gold-600">Guides</span>
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm text-charcoal-light sm:text-base">
            Tips, recipes, and guidance for making perfect roti, naan, pizza, and pastry dough at home.
          </p>

          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : !data?.data?.length ? (
          <EmptyState
            title="No articles yet"
            description="Check back soon for dough making guides, recipes, and kitchen tips."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
              {data.data.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group block">
                  <div className="mb-3 aspect-video overflow-hidden rounded-md bg-stone-100">
                    {post.featured_image && (
                      <img
                        src={assetUrl(post.featured_image)}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="text-xs uppercase tracking-wider text-gold-600">{post.category_name}</p>
                  <h2 className="mt-1 font-serif text-lg text-charcoal">{post.title}</h2>
                  <p className="mt-1 text-xs text-stone-400">{formatDate(post.published_at)}</p>
                </Link>
              ))}
            </div>

            {data.meta.totalPages > 1 && (
              <div className="mt-10 flex justify-center gap-3">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}