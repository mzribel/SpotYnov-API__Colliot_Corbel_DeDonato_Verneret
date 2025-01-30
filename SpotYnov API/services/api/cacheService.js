const NodeCache = require('node-cache');
const log = require("../../logger");

const myCache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

/**
 * Récupère une valeur du cache ou exécute une fonction de récupération si la clé est absente.
 * @param {string} key - Clé unique du cache.
 * @param {Function} fetchFunction - Fonction pour récupérer les données si absentes dans le cache.
 * @returns {Promise<any>} - Données récupérées.
 */
const getOrSetCache = async (key, fetchFunction) => {
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

module.exports = { getOrSetCache };
