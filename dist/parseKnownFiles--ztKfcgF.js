'use strict';var index=require('./index-C0LU9Dzu.js');const mergeConfigFiles = (...files) => {
    const merged = {};
    for (const file of files) {
        for (const [key, values] of Object.entries(file)) {
            if (merged[key] !== undefined) {
                Object.assign(merged[key], values);
            }
            else {
                merged[key] = values;
            }
        }
    }
    return merged;
};const parseKnownFiles = async (init) => {
    const parsedFiles = await index.l(init);
    return mergeConfigFiles(parsedFiles.configFile, parsedFiles.credentialsFile);
};exports.p=parseKnownFiles;