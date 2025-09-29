import { fetchRss } from './rss.js';
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
    return [];
}
//# sourceMappingURL=index.js.map