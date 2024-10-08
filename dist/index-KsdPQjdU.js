'use strict';require('os'),require('path');var index=require('./index-C0LU9Dzu.js');require('crypto'),require('fs');var parseKnownFiles=require('./parseKnownFiles--ztKfcgF.js'),child_process=require('child_process'),require$$0=require('util');require('console'),require('process'),require('dns'),require('net'),require('events'),require('stream'),require('tls'),require('https'),require('zlib'),require('url'),require('vm'),require('http'),require('assert'),require('tty'),require('node:path'),require('node:events'),require('buffer'),require('querystring'),require('stream/web'),require('node:stream'),require('node:util'),require('worker_threads'),require('perf_hooks'),require('util/types'),require('async_hooks'),require('string_decoder'),require('diagnostics_channel'),require('timers'),require('fs/promises'),require('timers/promises'),require('constants'),require('node:os'),require('node:process'),require('node:http'),require('node:https'),require('node:zlib'),require('node:fs'),require('dgram'),require('node:url'),require('http2'),require('rusty-store-kv');const getValidatedProcessCredentials = (profileName, data, profiles) => {
    if (data.Version !== 1) {
        throw Error(`Profile ${profileName} credential_process did not return Version 1.`);
    }
    if (data.AccessKeyId === undefined || data.SecretAccessKey === undefined) {
        throw Error(`Profile ${profileName} credential_process returned invalid credentials.`);
    }
    if (data.Expiration) {
        const currentTime = new Date();
        const expireTime = new Date(data.Expiration);
        if (expireTime < currentTime) {
            throw Error(`Profile ${profileName} credential_process returned expired credentials.`);
        }
    }
    let accountId = data.AccountId;
    if (!accountId && profiles?.[profileName]?.aws_account_id) {
        accountId = profiles[profileName].aws_account_id;
    }
    return {
        accessKeyId: data.AccessKeyId,
        secretAccessKey: data.SecretAccessKey,
        ...(data.SessionToken && { sessionToken: data.SessionToken }),
        ...(data.Expiration && { expiration: new Date(data.Expiration) }),
        ...(data.CredentialScope && { credentialScope: data.CredentialScope }),
        ...(accountId && { accountId }),
    };
};const resolveProcessCredentials = async (profileName, profiles, logger) => {
    const profile = profiles[profileName];
    if (profiles[profileName]) {
        const credentialProcess = profile["credential_process"];
        if (credentialProcess !== undefined) {
            const execPromise = require$$0.promisify(child_process.exec);
            try {
                const { stdout } = await execPromise(credentialProcess);
                let data;
                try {
                    data = JSON.parse(stdout.trim());
                }
                catch {
                    throw Error(`Profile ${profileName} credential_process returned invalid JSON.`);
                }
                return getValidatedProcessCredentials(profileName, data, profiles);
            }
            catch (error) {
                throw new index.C(error.message, { logger });
            }
        }
        else {
            throw new index.C(`Profile ${profileName} did not contain credential_process.`, { logger });
        }
    }
    else {
        throw new index.C(`Profile ${profileName} could not be found in shared credentials file.`, {
            logger,
        });
    }
};const fromProcess = (init = {}) => async () => {
    init.logger?.debug("@aws-sdk/credential-provider-process - fromProcess");
    const profiles = await parseKnownFiles.p(init);
    return resolveProcessCredentials(index.g(init), profiles, init.logger);
};exports.fromProcess=fromProcess;