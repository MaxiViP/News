import crypto from 'crypto';
function idFrom(...parts) {
    return crypto.createHash('sha1').update(parts.join('|')).digest('hex');
}
export const normalize = {
    fromNewsApi(a, category) {
        return {
            id: idFrom(a.url || a.title || ''),
            title: a.title ?? '',
            summary: a.description ?? '',
            url: a.url ?? '',
            imageUrl: a.urlToImage ?? undefined,
            source: { id: a.source?.id, name: a.source?.name ?? 'Unknown' },
            publishedAt: a.publishedAt ?? new Date().toISOString(),
            category,
        };
    },
    fromRss(a, category) {
        return {
            id: idFrom(a.link || a.title || ''),
            title: a.title ?? '',
            summary: a.summary ?? '',
            url: a.link ?? '',
            imageUrl: a.image,
            source: { name: a.sourceName ?? 'RSS' },
            publishedAt: a.publishedAt ?? new Date().toISOString(),
            category,
            country: 'ru',
            language: 'ru',
        };
    },
};
