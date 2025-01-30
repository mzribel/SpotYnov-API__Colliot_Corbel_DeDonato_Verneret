import NodeCache from 'node-cache';
import log from "../../logger";

const myCache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

export const getOrSetCache = async (key: NodeCache.Key, fetchFunction: () => any): Promise<any> => {
    const cachedData = myCache.get(key);
    if (cachedData) {
        log.info(`Données pour la clé '${key}' récupérées depuis le cache.`);
        return cachedData;
    }

    const data = await fetchFunction();
    myCache.set(key, data);
    log.info(`Données pour la clé '${key}' mises en cache.`);
    return data;
};

