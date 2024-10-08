'use strict';var index=require('./index-C0LU9Dzu.js'),require$$0=require('fs');require('util'),require('console'),require('process'),require('dns'),require('net'),require('events'),require('crypto'),require('stream'),require('tls'),require('os'),require('path'),require('https'),require('zlib'),require('url'),require('vm'),require('http'),require('assert'),require('tty'),require('node:path'),require('child_process'),require('node:events'),require('buffer'),require('querystring'),require('stream/web'),require('node:stream'),require('node:util'),require('worker_threads'),require('perf_hooks'),require('util/types'),require('async_hooks'),require('string_decoder'),require('diagnostics_channel'),require('timers'),require('fs/promises'),require('timers/promises'),require('constants'),require('node:os'),require('node:process'),require('node:http'),require('node:https'),require('node:zlib'),require('node:fs'),require('dgram'),require('node:url'),require('http2'),require('rusty-store-kv');const fromWebToken = (init) => async () => {
    init.logger?.debug("@aws-sdk/credential-provider-web-identity - fromWebToken");
    const { roleArn, roleSessionName, webIdentityToken, providerId, policyArns, policy, durationSeconds } = init;
    let { roleAssumerWithWebIdentity } = init;
    if (!roleAssumerWithWebIdentity) {
        const { getDefaultRoleAssumerWithWebIdentity } = await Promise.resolve().then(function(){return require('./index-Cgor3qRl.js')});
        roleAssumerWithWebIdentity = getDefaultRoleAssumerWithWebIdentity({
            ...init.clientConfig,
            credentialProviderLogger: init.logger,
            parentClientConfig: init.parentClientConfig,
        }, init.clientPlugins);
    }
    return roleAssumerWithWebIdentity({
        RoleArn: roleArn,
        RoleSessionName: roleSessionName ?? `aws-sdk-js-session-${Date.now()}`,
        WebIdentityToken: webIdentityToken,
        ProviderId: providerId,
        PolicyArns: policyArns,
        Policy: policy,
        DurationSeconds: durationSeconds,
    });
};const ENV_TOKEN_FILE = "AWS_WEB_IDENTITY_TOKEN_FILE";
const ENV_ROLE_ARN = "AWS_ROLE_ARN";
const ENV_ROLE_SESSION_NAME = "AWS_ROLE_SESSION_NAME";
const fromTokenFile = (init = {}) => async () => {
    init.logger?.debug("@aws-sdk/credential-provider-web-identity - fromTokenFile");
    const webIdentityTokenFile = init?.webIdentityTokenFile ?? process.env[ENV_TOKEN_FILE];
    const roleArn = init?.roleArn ?? process.env[ENV_ROLE_ARN];
    const roleSessionName = init?.roleSessionName ?? process.env[ENV_ROLE_SESSION_NAME];
    if (!webIdentityTokenFile || !roleArn) {
        throw new index.C("Web identity configuration not specified", {
            logger: init.logger,
        });
    }
    return fromWebToken({
        ...init,
        webIdentityToken: require$$0.readFileSync(webIdentityTokenFile, { encoding: "ascii" }),
        roleArn,
        roleSessionName,
    })();
};exports.fromTokenFile=fromTokenFile;exports.fromWebToken=fromWebToken;