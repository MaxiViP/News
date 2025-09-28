import { Router } from 'express';
import fetch from 'node-fetch';
import { env } from '../server/env.js';
const matchesRouter = Router();
const FOOTBALL_API = 'https://api.football-data.org/v4';
// ✅ используем оба ключа: сначала FOOTBALL_API_TOKEN, если пусто — FOOTBALL_DATA_KEY, потом резервный ключ
const API_KEY = env.FOOTBALL_API_TOKEN || process.env.FOOTBALL_DATA_KEY || '563b1e8db9574057a9bae05e33cbbe85';
async function fetchFromFootball(endpoint) {
    if (!API_KEY) {
        throw new Error('Football API token not configured');
    }
    const res = await fetch(`${FOOTBALL_API}${endpoint}`, {
        headers: { 'X-Auth-Token': API_KEY },
    });
    if (!res.ok) {
        // Добавляем больше информации об ошибке
        const errorText = await res.text();
        throw new Error(`football-data.org error: ${res.status} - ${errorText}`);
    }
    return res.json();
}
// Вспомогательная функция для логирования источника ключа
function getKeySource() {
    if (env.FOOTBALL_API_TOKEN)
        return 'FOOTBALL_API_TOKEN (env)';
    if (process.env.FOOTBALL_DATA_KEY)
        return 'FOOTBALL_DATA_KEY (env)';
    return 'резервный ключ';
}
matchesRouter.get('/', async (_req, res) => {
    try {
        console.log(`🔑 Используется ключ из: ${getKeySource()}`);
        const data = await fetchFromFootball('/matches?status=SCHEDULED,TIMED');
        res.json({
            matches: data.matches || [],
            _keySource: getKeySource(), // для отладки
        });
    }
    catch (err) {
        console.error('❌ Ошибка загрузки матчей:', err.message);
        res.status(500).json({
            error: err.message,
            _keySource: getKeySource(),
        });
    }
});
matchesRouter.get('/live', async (_req, res) => {
    try {
        console.log(`🔑 Используется ключ из: ${getKeySource()}`);
        const data = await fetchFromFootball('/matches?status=IN_PLAY,PAUSED');
        res.json({
            matches: data.matches || [],
            _keySource: getKeySource(), // для отладки
        });
    }
    catch (err) {
        console.error('❌ Ошибка загрузки LIVE матчей:', err.message);
        res.status(500).json({
            error: err.message,
            _keySource: getKeySource(),
        });
    }
});
// Добавим эндпоинт для проверки ключа
matchesRouter.get('/debug', async (_req, res) => {
    try {
        const keySource = getKeySource();
        const hasKey = !!API_KEY;
        const keyPreview = hasKey ? `${API_KEY.slice(0, 8)}...` : 'отсутствует';
        // Проверяем доступность API
        const testData = await fetchFromFootball('/areas/2077'); // небольшая область для теста
        res.json({
            keyConfigured: hasKey,
            keySource,
            keyPreview,
            apiStatus: 'working',
            testArea: testData,
        });
    }
    catch (err) {
        const keySource = getKeySource();
        const hasKey = !!API_KEY;
        const keyPreview = hasKey ? `${API_KEY.slice(0, 8)}...` : 'отсутствует';
        res.status(500).json({
            keyConfigured: hasKey,
            keySource,
            keyPreview,
            apiStatus: 'error',
            error: err.message,
        });
    }
});
export default matchesRouter;
//# sourceMappingURL=matches.js.map