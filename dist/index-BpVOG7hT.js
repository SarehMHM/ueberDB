'use strict';require('os'),require('path');var index=require('./index-CifI2UyG.js');require('crypto'),require('fs');var parseKnownFiles=require('./parseKnownFiles-C356LZtt.js');require('util'),require('console'),require('process'),require('dns'),require('net'),require('events'),require('stream'),require('tls'),require('https'),require('zlib'),require('url'),require('vm'),require('http'),require('assert'),require('tty'),require('node:path'),require('child_process'),require('node:events'),require('buffer'),require('querystring'),require('stream/web'),require('node:stream'),require('node:util'),require('worker_threads'),require('perf_hooks'),require('util/types'),require('async_hooks'),require('string_decoder'),require('diagnostics_channel'),require('timers'),require('fs/promises'),require('timers/promises'),require('constants'),require('node:os'),require('node:process'),require('node:http'),require('node:https'),require('node:zlib'),require('node:fs'),require('dgram'),require('node:url'),require('http2'),require('rusty-store-kv');const resolveCredentialSource = (credentialSource, profileName, logger) => {
    const sourceProvidersMap = {
        EcsContainer: async (options) => {
            const { fromHttp } = await Promise.resolve().then(function(){return require('./index-DxDmuI2L.js')});
            const { fromContainerMetadata } = await Promise.resolve().then(function(){return require('./index-DHza_3Qf.js')});
            logger?.debug("@aws-sdk/credential-provider-ini - credential_source is EcsContainer");
            return index.h(fromHttp(options ?? {}), fromContainerMetadata(options));
        },
        Ec2InstanceMetadata: async (options) => {
            logger?.debug("@aws-sdk/credential-provider-ini - credential_source is Ec2InstanceMetadata");
            const { fromInstanceMetadata } = await Promise.resolve().then(function(){return require('./index-DHza_3Qf.js')});
            return fromInstanceMetadata(options);
        },
        Environment: async (options) => {
            logger?.debug("@aws-sdk/credential-provider-ini - credential_source is Environment");
            const { fromEnv } = await Promise.resolve().then(function(){return require('./index-D6bS6hV_.js')});
            return fromEnv(options);
        },
    };
    if (credentialSource in sourceProvidersMap) {
        return sourceProvidersMap[credentialSource];
    }
    else {
        throw new index.C(`Unsupported credential source in profile ${profileName}. Got ${credentialSource}, ` +
            `expected EcsContainer or Ec2InstanceMetadata or Environment.`, { logger });
    }
};const isAssumeRoleProfile = (arg, { profile = "default", logger } = {}) => {
    return (Boolean(arg) &&
        typeof arg === "object" &&
        typeof arg.role_arn === "string" &&
        ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1 &&
        ["undefined", "string"].indexOf(typeof arg.external_id) > -1 &&
        ["undefined", "string"].indexOf(typeof arg.mfa_serial) > -1 &&
        (isAssumeRoleWithSourceProfile(arg, { profile, logger }) || isCredentialSourceProfile(arg, { profile, logger })));
};
const isAssumeRoleWithSourceProfile = (arg, { profile, logger }) => {
    const withSourceProfile = typeof arg.source_profile === "string" && typeof arg.credential_source === "undefined";
    if (withSourceProfile) {
        logger?.debug?.(`    ${profile} isAssumeRoleWithSourceProfile source_profile=${arg.source_profile}`);
    }
    return withSourceProfile;
};
const isCredentialSourceProfile = (arg, { profile, logger }) => {
    const withProviderProfile = typeof arg.credential_source === "string" && typeof arg.source_profile === "undefined";
    if (withProviderProfile) {
        logger?.debug?.(`    ${profile} isCredentialSourceProfile credential_source=${arg.credential_source}`);
    }
    return withProviderProfile;
};
const resolveAssumeRoleCredentials = async (profileName, profiles, options, visitedProfiles = {}) => {
    options.logger?.debug("@aws-sdk/credential-provider-ini - resolveAssumeRoleCredentials (STS)");
    const data = profiles[profileName];
    if (!options.roleAssumer) {
        const { getDefaultRoleAssumer } = await Promise.resolve().then(function(){return require('./index-uZtJMD8Q.js')});
        options.roleAssumer = getDefaultRoleAssumer({
            ...options.clientConfig,
            credentialProviderLogger: options.logger,
            parentClientConfig: options?.parentClientConfig,
        }, options.clientPlugins);
    }
    const { source_profile } = data;
    if (source_profile && source_profile in visitedProfiles) {
        throw new index.C(`Detected a cycle attempting to resolve credentials for profile` +
            ` ${index.g(options)}. Profiles visited: ` +
            Object.keys(visitedProfiles).join(", "), { logger: options.logger });
    }
    options.logger?.debug(`@aws-sdk/credential-provider-ini - finding credential resolver using ${source_profile ? `source_profile=[${source_profile}]` : `profile=[${profileName}]`}`);
    const sourceCredsProvider = source_profile
        ? resolveProfileData(source_profile, profiles, options, {
            ...visitedProfiles,
            [source_profile]: true,
        }, isCredentialSourceWithoutRoleArn(profiles[source_profile] ?? {}))
        : (await resolveCredentialSource(data.credential_source, profileName, options.logger)(options))();
    if (isCredentialSourceWithoutRoleArn(data)) {
        return sourceCredsProvider;
    }
    else {
        const params = {
            RoleArn: data.role_arn,
            RoleSessionName: data.role_session_name || `aws-sdk-js-${Date.now()}`,
            ExternalId: data.external_id,
            DurationSeconds: parseInt(data.duration_seconds || "3600", 10),
        };
        const { mfa_serial } = data;
        if (mfa_serial) {
            if (!options.mfaCodeProvider) {
                throw new index.C(`Profile ${profileName} requires multi-factor authentication, but no MFA code callback was provided.`, { logger: options.logger, tryNextLink: false });
            }
            params.SerialNumber = mfa_serial;
            params.TokenCode = await options.mfaCodeProvider(mfa_serial);
        }
        const sourceCreds = await sourceCredsProvider;
        return options.roleAssumer(sourceCreds, params);
    }
};
const isCredentialSourceWithoutRoleArn = (section) => {
    return !section.role_arn && !!section.credential_source;
};const isProcessProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.credential_process === "string";
const resolveProcessCredentials = async (options, profile) => Promise.resolve().then(function(){return require('./index-DlIjs66W.js')}).then(({ fromProcess }) => fromProcess({
    ...options,
    profile,
})());const resolveSsoCredentials = async (profile, options = {}) => {
    const { fromSSO } = await Promise.resolve().then(function(){return require('./index-fqTxm4Hh.js')});
    return fromSSO({
        profile,
        logger: options.logger,
    })();
};
const isSsoProfile = (arg) => arg &&
    (typeof arg.sso_start_url === "string" ||
        typeof arg.sso_account_id === "string" ||
        typeof arg.sso_session === "string" ||
        typeof arg.sso_region === "string" ||
        typeof arg.sso_role_name === "string");const isStaticCredsProfile = (arg) => Boolean(arg) &&
    typeof arg === "object" &&
    typeof arg.aws_access_key_id === "string" &&
    typeof arg.aws_secret_access_key === "string" &&
    ["undefined", "string"].indexOf(typeof arg.aws_session_token) > -1 &&
    ["undefined", "string"].indexOf(typeof arg.aws_account_id) > -1;
const resolveStaticCredentials = (profile, options) => {
    options?.logger?.debug("@aws-sdk/credential-provider-ini - resolveStaticCredentials");
    return Promise.resolve({
        accessKeyId: profile.aws_access_key_id,
        secretAccessKey: profile.aws_secret_access_key,
        sessionToken: profile.aws_session_token,
        ...(profile.aws_credential_scope && { credentialScope: profile.aws_credential_scope }),
        ...(profile.aws_account_id && { accountId: profile.aws_account_id }),
    });
};const isWebIdentityProfile = (arg) => Boolean(arg) &&
    typeof arg === "object" &&
    typeof arg.web_identity_token_file === "string" &&
    typeof arg.role_arn === "string" &&
    ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1;
const resolveWebIdentityCredentials = async (profile, options) => Promise.resolve().then(function(){return require('./index-B_sU0XuB.js')}).then(({ fromTokenFile }) => fromTokenFile({
    webIdentityTokenFile: profile.web_identity_token_file,
    roleArn: profile.role_arn,
    roleSessionName: profile.role_session_name,
    roleAssumerWithWebIdentity: options.roleAssumerWithWebIdentity,
    logger: options.logger,
    parentClientConfig: options.parentClientConfig,
})());const resolveProfileData = async (profileName, profiles, options, visitedProfiles = {}, isAssumeRoleRecursiveCall = false) => {
    const data = profiles[profileName];
    if (Object.keys(visitedProfiles).length > 0 && isStaticCredsProfile(data)) {
        return resolveStaticCredentials(data, options);
    }
    if (isAssumeRoleRecursiveCall || isAssumeRoleProfile(data, { profile: profileName, logger: options.logger })) {
        return resolveAssumeRoleCredentials(profileName, profiles, options, visitedProfiles);
    }
    if (isStaticCredsProfile(data)) {
        return resolveStaticCredentials(data, options);
    }
    if (isWebIdentityProfile(data)) {
        return resolveWebIdentityCredentials(data, options);
    }
    if (isProcessProfile(data)) {
        return resolveProcessCredentials(options, profileName);
    }
    if (isSsoProfile(data)) {
        return await resolveSsoCredentials(profileName, options);
    }
    throw new index.C(`Could not resolve credentials using profile: [${profileName}] in configuration/credentials file(s).`, { logger: options.logger });
};const fromIni = (init = {}) => async () => {
    init.logger?.debug("@aws-sdk/credential-provider-ini - fromIni");
    const profiles = await parseKnownFiles.p(init);
    return resolveProfileData(index.g(init), profiles, init);
};exports.fromIni=fromIni;