import { fetchRss } from './rss.js';
import { fetchNewsApi } from './newsapi.js';
export async function fetchFromProviders(opts) {
    const seen = new Set();
    const uniq = (arr) => arr.filter(x => {
        const k = x.url || x.id;
        if (seen.has(k))
            return false;
        seen.add(k);
        return true;
    });
    // 1) Для РФ — пробуем RSS (без лимитов)
    if ((opts.country ?? 'ru') === 'ru' && !opts.q) {
        const rss = await fetchRss({ category: opts.category, page: opts.page ?? 1 });
        if (rss.length)
            return uniq(rss);
    }
    // 2) Запасной вариант — NewsAPI (если ключ есть и не упёрлись в лимит)
    try {
        const a = await fetchNewsApi({
            category: opts.category,
            country: (opts.country ?? 'ru'),
            page: opts.page,
            q: opts.q
        });
        if (a.length)
            return uniq(a);
    }
    catch { }
    return [];
}
