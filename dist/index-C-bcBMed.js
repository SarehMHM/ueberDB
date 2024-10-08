'use strict';var index=require('./index-CKz3iZMO.js');require('os');var require$$1=require('path'),require$$0=require('crypto'),require$$0$1=require('fs'),parseKnownFiles=require('./parseKnownFiles-BggHVaSF.js');require('util'),require('console'),require('process'),require('dns'),require('net'),require('events'),require('stream'),require('tls'),require('https'),require('zlib'),require('url'),require('vm'),require('http'),require('assert'),require('tty'),require('node:path'),require('child_process'),require('node:events'),require('buffer'),require('querystring'),require('stream/web'),require('node:stream'),require('node:util'),require('worker_threads'),require('perf_hooks'),require('util/types'),require('async_hooks'),require('string_decoder'),require('diagnostics_channel'),require('timers'),require('fs/promises'),require('timers/promises'),require('constants'),require('node:os'),require('node:process'),require('node:http'),require('node:https'),require('node:zlib'),require('node:fs'),require('dgram'),require('node:url'),require('http2'),require('rusty-store-kv');class TokenProviderError extends index.P {
    constructor(message, options = true) {
        super(message, options);
        this.name = "TokenProviderError";
        Object.setPrototypeOf(this, TokenProviderError.prototype);
    }
}const getSSOTokenFilepath = (id) => {
    const hasher = require$$0.createHash("sha1");
    const cacheName = hasher.update(id).digest("hex");
    return require$$1.join(index.aw(), ".aws", "sso", "cache", `${cacheName}.json`);
};const { readFile } = require$$0$1.promises;
const getSSOTokenFromFile = async (id) => {
    const ssoTokenFilepath = getSSOTokenFilepath(id);
    const ssoTokenText = await readFile(ssoTokenFilepath, "utf8");
    return JSON.parse(ssoTokenText);
};const getSsoSessionData = (data) => Object.entries(data)
    .filter(([key]) => key.startsWith(index.ax.SSO_SESSION + index.ay))
    .reduce((acc, [key, value]) => ({ ...acc, [key.substring(key.indexOf(index.ay) + 1)]: value }), {});const swallowError = () => ({});
const loadSsoSessionData = async (init = {}) => index.az(init.configFilepath ?? index.aA())
    .then(index.aB)
    .then(getSsoSessionData)
    .catch(swallowError);const isSsoProfile = (arg) => arg &&
    (typeof arg.sso_start_url === "string" ||
        typeof arg.sso_account_id === "string" ||
        typeof arg.sso_session === "string" ||
        typeof arg.sso_region === "string" ||
        typeof arg.sso_role_name === "string");const EXPIRE_WINDOW_MS = 5 * 60 * 1000;
const REFRESH_MESSAGE = `To refresh this SSO session run 'aws sso login' with the corresponding profile.`;const ssoOidcClientsHash = {};
const getSsoOidcClient = async (ssoRegion) => {
    const { SSOOIDCClient } = await Promise.resolve().then(function(){return require('./index-CU4f7sG9.js')});
    if (ssoOidcClientsHash[ssoRegion]) {
        return ssoOidcClientsHash[ssoRegion];
    }
    const ssoOidcClient = new SSOOIDCClient({ region: ssoRegion });
    ssoOidcClientsHash[ssoRegion] = ssoOidcClient;
    return ssoOidcClient;
};const getNewSsoOidcToken = async (ssoToken, ssoRegion) => {
    const { CreateTokenCommand } = await Promise.resolve().then(function(){return require('./index-CU4f7sG9.js')});
    const ssoOidcClient = await getSsoOidcClient(ssoRegion);
    return ssoOidcClient.send(new CreateTokenCommand({
        clientId: ssoToken.clientId,
        clientSecret: ssoToken.clientSecret,
        refreshToken: ssoToken.refreshToken,
        grantType: "refresh_token",
    }));
};const validateTokenExpiry = (token) => {
    if (token.expiration && token.expiration.getTime() < Date.now()) {
        throw new TokenProviderError(`Token is expired. ${REFRESH_MESSAGE}`, false);
    }
};const validateTokenKey = (key, value, forRefresh = false) => {
    if (typeof value === "undefined") {
        throw new TokenProviderError(`Value not present for '${key}' in SSO Token${forRefresh ? ". Cannot refresh" : ""}. ${REFRESH_MESSAGE}`, false);
    }
};const { writeFile } = require$$0$1.promises;
const writeSSOTokenToFile = (id, ssoToken) => {
    const tokenFilepath = getSSOTokenFilepath(id);
    const tokenString = JSON.stringify(ssoToken, null, 2);
    return writeFile(tokenFilepath, tokenString);
};const lastRefreshAttemptTime = new Date(0);
const fromSso = (init = {}) => async () => {
    init.logger?.debug("@aws-sdk/token-providers - fromSso");
    const profiles = await parseKnownFiles.p(init);
    const profileName = index.g(init);
    const profile = profiles[profileName];
    if (!profile) {
        throw new TokenProviderError(`Profile '${profileName}' could not be found in shared credentials file.`, false);
    }
    else if (!profile["sso_session"]) {
        throw new TokenProviderError(`Profile '${profileName}' is missing required property 'sso_session'.`);
    }
    const ssoSessionName = profile["sso_session"];
    const ssoSessions = await loadSsoSessionData(init);
    const ssoSession = ssoSessions[ssoSessionName];
    if (!ssoSession) {
        throw new TokenProviderError(`Sso session '${ssoSessionName}' could not be found in shared credentials file.`, false);
    }
    for (const ssoSessionRequiredKey of ["sso_start_url", "sso_region"]) {
        if (!ssoSession[ssoSessionRequiredKey]) {
            throw new TokenProviderError(`Sso session '${ssoSessionName}' is missing required property '${ssoSessionRequiredKey}'.`, false);
        }
    }
    ssoSession["sso_start_url"];
    const ssoRegion = ssoSession["sso_region"];
    let ssoToken;
    try {
        ssoToken = await getSSOTokenFromFile(ssoSessionName);
    }
    catch (e) {
        throw new TokenProviderError(`The SSO session token associated with profile=${profileName} was not found or is invalid. ${REFRESH_MESSAGE}`, false);
    }
    validateTokenKey("accessToken", ssoToken.accessToken);
    validateTokenKey("expiresAt", ssoToken.expiresAt);
    const { accessToken, expiresAt } = ssoToken;
    const existingToken = { token: accessToken, expiration: new Date(expiresAt) };
    if (existingToken.expiration.getTime() - Date.now() > EXPIRE_WINDOW_MS) {
        return existingToken;
    }
    if (Date.now() - lastRefreshAttemptTime.getTime() < 30 * 1000) {
        validateTokenExpiry(existingToken);
        return existingToken;
    }
    validateTokenKey("clientId", ssoToken.clientId, true);
    validateTokenKey("clientSecret", ssoToken.clientSecret, true);
    validateTokenKey("refreshToken", ssoToken.refreshToken, true);
    try {
        lastRefreshAttemptTime.setTime(Date.now());
        const newSsoOidcToken = await getNewSsoOidcToken(ssoToken, ssoRegion);
        validateTokenKey("accessToken", newSsoOidcToken.accessToken);
        validateTokenKey("expiresIn", newSsoOidcToken.expiresIn);
        const newTokenExpiration = new Date(Date.now() + newSsoOidcToken.expiresIn * 1000);
        try {
            await writeSSOTokenToFile(ssoSessionName, {
                ...ssoToken,
                accessToken: newSsoOidcToken.accessToken,
                expiresAt: newTokenExpiration.toISOString(),
                refreshToken: newSsoOidcToken.refreshToken,
            });
        }
        catch (error) {
        }
        return {
            token: newSsoOidcToken.accessToken,
            expiration: newTokenExpiration,
        };
    }
    catch (error) {
        validateTokenExpiry(existingToken);
        return existingToken;
    }
};const SHOULD_FAIL_CREDENTIAL_CHAIN = false;
const resolveSSOCredentials = async ({ ssoStartUrl, ssoSession, ssoAccountId, ssoRegion, ssoRoleName, ssoClient, clientConfig, profile, logger, }) => {
    let token;
    const refreshMessage = `To refresh this SSO session run aws sso login with the corresponding profile.`;
    if (ssoSession) {
        try {
            const _token = await fromSso({ profile })();
            token = {
                accessToken: _token.token,
                expiresAt: new Date(_token.expiration).toISOString(),
            };
        }
        catch (e) {
            throw new index.C(e.message, {
                tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
                logger,
            });
        }
    }
    else {
        try {
            token = await getSSOTokenFromFile(ssoStartUrl);
        }
        catch (e) {
            throw new index.C(`The SSO session associated with this profile is invalid. ${refreshMessage}`, {
                tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
                logger,
            });
        }
    }
    if (new Date(token.expiresAt).getTime() - Date.now() <= 0) {
        throw new index.C(`The SSO session associated with this profile has expired. ${refreshMessage}`, {
            tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
            logger,
        });
    }
    const { accessToken } = token;
    const { SSOClient, GetRoleCredentialsCommand } = await Promise.resolve().then(function(){return require('./loadSso-DM_KxhuL.js')});
    const sso = ssoClient ||
        new SSOClient(Object.assign({}, clientConfig ?? {}, {
            region: clientConfig?.region ?? ssoRegion,
        }));
    let ssoResp;
    try {
        ssoResp = await sso.send(new GetRoleCredentialsCommand({
            accountId: ssoAccountId,
            roleName: ssoRoleName,
            accessToken,
        }));
    }
    catch (e) {
        throw new index.C(e, {
            tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
            logger,
        });
    }
    const { roleCredentials: { accessKeyId, secretAccessKey, sessionToken, expiration, credentialScope, accountId } = {}, } = ssoResp;
    if (!accessKeyId || !secretAccessKey || !sessionToken || !expiration) {
        throw new index.C("SSO returns an invalid temporary credential.", {
            tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
            logger,
        });
    }
    return {
        accessKeyId,
        secretAccessKey,
        sessionToken,
        expiration: new Date(expiration),
        ...(credentialScope && { credentialScope }),
        ...(accountId && { accountId }),
    };
};const validateSsoProfile = (profile, logger) => {
    const { sso_start_url, sso_account_id, sso_region, sso_role_name } = profile;
    if (!sso_start_url || !sso_account_id || !sso_region || !sso_role_name) {
        throw new index.C(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", ` +
            `"sso_region", "sso_role_name", "sso_start_url". Got ${Object.keys(profile).join(", ")}\nReference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`, { tryNextLink: false, logger });
    }
    return profile;
};const fromSSO = (init = {}) => async () => {
    init.logger?.debug("@aws-sdk/credential-provider-sso - fromSSO");
    const { ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoSession } = init;
    const { ssoClient } = init;
    const profileName = index.g(init);
    if (!ssoStartUrl && !ssoAccountId && !ssoRegion && !ssoRoleName && !ssoSession) {
        const profiles = await parseKnownFiles.p(init);
        const profile = profiles[profileName];
        if (!profile) {
            throw new index.C(`Profile ${profileName} was not found.`, { logger: init.logger });
        }
        if (!isSsoProfile(profile)) {
            throw new index.C(`Profile ${profileName} is not configured with SSO credentials.`, {
                logger: init.logger,
            });
        }
        if (profile?.sso_session) {
            const ssoSessions = await loadSsoSessionData(init);
            const session = ssoSessions[profile.sso_session];
            const conflictMsg = ` configurations in profile ${profileName} and sso-session ${profile.sso_session}`;
            if (ssoRegion && ssoRegion !== session.sso_region) {
                throw new index.C(`Conflicting SSO region` + conflictMsg, {
                    tryNextLink: false,
                    logger: init.logger,
                });
            }
            if (ssoStartUrl && ssoStartUrl !== session.sso_start_url) {
                throw new index.C(`Conflicting SSO start_url` + conflictMsg, {
                    tryNextLink: false,
                    logger: init.logger,
                });
            }
            profile.sso_region = session.sso_region;
            profile.sso_start_url = session.sso_start_url;
        }
        const { sso_start_url, sso_account_id, sso_region, sso_role_name, sso_session } = validateSsoProfile(profile, init.logger);
        return resolveSSOCredentials({
            ssoStartUrl: sso_start_url,
            ssoSession: sso_session,
            ssoAccountId: sso_account_id,
            ssoRegion: sso_region,
            ssoRoleName: sso_role_name,
            ssoClient: ssoClient,
            clientConfig: init.clientConfig,
            profile: profileName,
        });
    }
    else if (!ssoStartUrl || !ssoAccountId || !ssoRegion || !ssoRoleName) {
        throw new index.C("Incomplete configuration. The fromSSO() argument hash must include " +
            '"ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"', { tryNextLink: false, logger: init.logger });
    }
    else {
        return resolveSSOCredentials({
            ssoStartUrl,
            ssoSession,
            ssoAccountId,
            ssoRegion,
            ssoRoleName,
            ssoClient,
            clientConfig: init.clientConfig,
            profile: profileName,
        });
    }
};exports.fromSSO=fromSSO;exports.isSsoProfile=isSsoProfile;exports.validateSsoProfile=validateSsoProfile;