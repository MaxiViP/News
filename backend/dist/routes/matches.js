import { Router } from 'express';
import fetch from 'node-fetch';
import { env } from '../server/env.js';
const matchesRouter = Router();
const FOOTBALL_API = 'https://api.football-data.org/v4';
// ✅ Используем env с резервным ключом
const API_KEY = env.FOOTBALL_API_TOKEN || '563b1e8db9574057a9bae05e33cbbe85';
console.log('🔑 Football API Key loaded:', API_KEY ? `${API_KEY.slice(0, 8)}...` : 'MISSING');
async function fetchFromFootball(endpoint) {
    console.log(`🔗 Fetching: ${FOOTBALL_API}${endpoint}`);
    const res = await fetch(`${FOOTBALL_API}${endpoint}`, {
        headers: {
            'X-Auth-Token': API_KEY,
            'Content-Type': 'application/json',
        },
    });
    console.log(`📡 Response status: ${res.status}`);
    if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ API Error ${res.status}:`, errorText);
        throw new Error(`Football API error: ${res.status}`);
    }
    return res.json();
}
matchesRouter.get('/', async (_req, res) => {
    try {
        console.log('🚀 /api/matches called');
        const data = await fetchFromFootball('/matches?status=SCHEDULED,TIMED&limit=10');
        res.json({
            matches: data.matches || [],
            source: 'football-api',
            timestamp: new Date().toISOString(),
            count: data.matches?.length || 0,
        });
    }
    catch (err) {
        console.error('❌ Matches error:', err.message);
        // Fallback данные
        const fallbackMatches = [
            {
                id: 1,
                competition: { name: 'Premier League' },
                homeTeam: { name: 'Arsenal' },
                awayTeam: { name: 'Chelsea' },
                status: 'SCHEDULED',
                utcDate: new Date().toISOString(),
            },
            {
                id: 2,
                competition: { name: 'La Liga' },
                homeTeam: { name: 'Real Madrid' },
                awayTeam: { name: 'Barcelona' },
                status: 'SCHEDULED',
                utcDate: new Date().toISOString(),
            },
        ];
        res.json({
            matches: fallbackMatches,
            error: err.message,
            source: 'fallback',
            timestamp: new Date().toISOString(),
        });
    }
});
matchesRouter.get('/live', async (_req, res) => {
    try {
        console.log('🚀 /api/matches/live called');
        const data = await fetchFromFootball('/matches?status=IN_PLAY,PAUSED&limit=10');
        res.json({
            matches: data.matches || [],
            source: 'football-api',
            timestamp: new Date().toISOString(),
            count: data.matches?.length || 0,
        });
    }
    catch (err) {
        console.error('❌ Live matches error:', err.message);
        res.json({
            matches: [],
            error: err.message,
            source: 'fallback',
            timestamp: new Date().toISOString(),
        });
    }
});
matchesRouter.get('/debug', async (_req, res) => {
    try {
        console.log('🚀 /api/matches/debug called');
        // Проверяем доступность API
        const testData = await fetchFromFootball('/areas/2077');
        res.json({
            keyConfigured: !!API_KEY,
            keySource: env.FOOTBALL_API_TOKEN ? 'env' : 'fallback',
            keyPreview: API_KEY ? `${API_KEY.slice(0, 8)}...` : 'missing',
            apiStatus: 'working',
            testArea: testData,
            env: {
                NODE_ENV: env.NODE_ENV,
                CORS_ORIGIN: env.CORS_ORIGIN,
            },
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        console.error('❌ Debug error:', err.message);
        res.json({
            keyConfigured: !!API_KEY,
            keySource: env.FOOTBALL_API_TOKEN ? 'env' : 'fallback',
            keyPreview: API_KEY ? `${API_KEY.slice(0, 8)}...` : 'missing',
            apiStatus: 'error',
            error: err.message,
            env: {
                NODE_ENV: env.NODE_ENV,
                CORS_ORIGIN: env.CORS_ORIGIN,
            },
            timestamp: new Date().toISOString(),
        });
    }
});
export default matchesRouter;
//# sourceMappingURL=matches.js.map