'use strict';require('os'),require('path'),require('crypto'),require('fs');var index=require('./index-CxyG0YOF.js');require('buffer'),require('stream'),require('http'),require('https'),require('http2'),require('util');var noAuth=require('./noAuth-CtyTriK3.js'),requestBuilder=require('./requestBuilder-p24otX9w.js');require('console'),require('process'),require('dns'),require('net'),require('events'),require('tls'),require('zlib'),require('url'),require('vm'),require('assert'),require('tty'),require('node:path'),require('child_process'),require('node:events'),require('querystring'),require('stream/web'),require('node:stream'),require('node:util'),require('worker_threads'),require('perf_hooks'),require('util/types'),require('async_hooks'),require('string_decoder'),require('diagnostics_channel'),require('timers'),require('fs/promises'),require('timers/promises'),require('constants'),require('node:os'),require('node:process'),require('node:http'),require('node:https'),require('node:zlib'),require('node:fs'),require('dgram'),require('node:url'),require('rusty-store-kv');const isSerializableHeaderValue = (value) => {
    return value != null;
};const defaultSSOHttpAuthSchemeParametersProvider = async (config, context, input) => {
    return {
        operation: index.q(context).operation,
        region: (await index.r(config.region)()) ||
            (() => {
                throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
            })(),
    };
};
function createAwsAuthSigv4HttpAuthOption(authParameters) {
    return {
        schemeId: "aws.auth#sigv4",
        signingProperties: {
            name: "awsssoportal",
            region: authParameters.region,
        },
        propertiesExtractor: (config, context) => ({
            signingProperties: {
                config,
                context,
            },
        }),
    };
}
function createSmithyApiNoAuthHttpAuthOption(authParameters) {
    return {
        schemeId: "smithy.api#noAuth",
    };
}
const defaultSSOHttpAuthSchemeProvider = (authParameters) => {
    const options = [];
    switch (authParameters.operation) {
        case "GetRoleCredentials": {
            options.push(createSmithyApiNoAuthHttpAuthOption());
            break;
        }
        case "ListAccountRoles": {
            options.push(createSmithyApiNoAuthHttpAuthOption());
            break;
        }
        case "ListAccounts": {
            options.push(createSmithyApiNoAuthHttpAuthOption());
            break;
        }
        case "Logout": {
            options.push(createSmithyApiNoAuthHttpAuthOption());
            break;
        }
        default: {
            options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
        }
    }
    return options;
};
const resolveHttpAuthSchemeConfig = (config) => {
    const config_0 = index.u(config);
    return {
        ...config_0,
    };
};const resolveClientEndpointParameters = (options) => {
    return {
        ...options,
        useDualstackEndpoint: options.useDualstackEndpoint ?? false,
        useFipsEndpoint: options.useFipsEndpoint ?? false,
        defaultSigningName: "awsssoportal",
    };
};
const commonParams = {
    UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
    Endpoint: { type: "builtInParams", name: "endpoint" },
    Region: { type: "builtInParams", name: "region" },
    UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
};var name = "@aws-sdk/client-sso";
var description = "AWS SDK for JavaScript Sso Client for Node.js, Browser and React Native";
var version = "3.665.0";
var scripts = {
	build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
	"build:cjs": "node ../../scripts/compilation/inline client-sso",
	"build:es": "tsc -p tsconfig.es.json",
	"build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
	"build:types": "tsc -p tsconfig.types.json",
	"build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
	clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
	"extract:docs": "api-extractor run --local",
	"generate:client": "node ../../scripts/generate-clients/single-service --solo sso"
};
var main = "./dist-cjs/index.js";
var types = "./dist-types/index.d.ts";
var module$1 = "./dist-es/index.js";
var sideEffects = false;
var dependencies = {
	"@aws-crypto/sha256-browser": "5.2.0",
	"@aws-crypto/sha256-js": "5.2.0",
	"@aws-sdk/core": "3.665.0",
	"@aws-sdk/middleware-host-header": "3.664.0",
	"@aws-sdk/middleware-logger": "3.664.0",
	"@aws-sdk/middleware-recursion-detection": "3.664.0",
	"@aws-sdk/middleware-user-agent": "3.664.0",
	"@aws-sdk/region-config-resolver": "3.664.0",
	"@aws-sdk/types": "3.664.0",
	"@aws-sdk/util-endpoints": "3.664.0",
	"@aws-sdk/util-user-agent-browser": "3.664.0",
	"@aws-sdk/util-user-agent-node": "3.664.0",
	"@smithy/config-resolver": "^3.0.9",
	"@smithy/core": "^2.4.7",
	"@smithy/fetch-http-handler": "^3.2.9",
	"@smithy/hash-node": "^3.0.7",
	"@smithy/invalid-dependency": "^3.0.7",
	"@smithy/middleware-content-length": "^3.0.9",
	"@smithy/middleware-endpoint": "^3.1.4",
	"@smithy/middleware-retry": "^3.0.22",
	"@smithy/middleware-serde": "^3.0.7",
	"@smithy/middleware-stack": "^3.0.7",
	"@smithy/node-config-provider": "^3.1.8",
	"@smithy/node-http-handler": "^3.2.4",
	"@smithy/protocol-http": "^4.1.4",
	"@smithy/smithy-client": "^3.3.6",
	"@smithy/types": "^3.5.0",
	"@smithy/url-parser": "^3.0.7",
	"@smithy/util-base64": "^3.0.0",
	"@smithy/util-body-length-browser": "^3.0.0",
	"@smithy/util-body-length-node": "^3.0.0",
	"@smithy/util-defaults-mode-browser": "^3.0.22",
	"@smithy/util-defaults-mode-node": "^3.0.22",
	"@smithy/util-endpoints": "^2.1.3",
	"@smithy/util-middleware": "^3.0.7",
	"@smithy/util-retry": "^3.0.7",
	"@smithy/util-utf8": "^3.0.0",
	tslib: "^2.6.2"
};
var devDependencies = {
	"@tsconfig/node16": "16.1.3",
	"@types/node": "^16.18.96",
	concurrently: "7.0.0",
	"downlevel-dts": "0.10.1",
	rimraf: "3.0.2",
	typescript: "~4.9.5"
};
var engines = {
	node: ">=16.0.0"
};
var typesVersions = {
	"<4.0": {
		"dist-types/*": [
			"dist-types/ts3.4/*"
		]
	}
};
var files = [
	"dist-*/**"
];
var author = {
	name: "AWS SDK for JavaScript Team",
	url: "https://aws.amazon.com/javascript/"
};
var license = "Apache-2.0";
var browser = {
	"./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
};
var homepage = "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sso";
var repository = {
	type: "git",
	url: "https://github.com/aws/aws-sdk-js-v3.git",
	directory: "clients/client-sso"
};
var packageInfo = {
	name: name,
	description: description,
	version: version,
	scripts: scripts,
	main: main,
	types: types,
	module: module$1,
	sideEffects: sideEffects,
	dependencies: dependencies,
	devDependencies: devDependencies,
	engines: engines,
	typesVersions: typesVersions,
	files: files,
	author: author,
	license: license,
	browser: browser,
	"react-native": {
	"./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
},
	homepage: homepage,
	repository: repository
};const u = "required", v = "fn", w = "argv", x = "ref";
const a = true, b = "isSet", c = "booleanEquals", d = "error", e = "endpoint", f = "tree", g = "PartitionResult", h = "getAttr", i = { [u]: false, "type": "String" }, j = { [u]: true, "default": false, "type": "Boolean" }, k = { [x]: "Endpoint" }, l = { [v]: c, [w]: [{ [x]: "UseFIPS" }, true] }, m = { [v]: c, [w]: [{ [x]: "UseDualStack" }, true] }, n = {}, o = { [v]: h, [w]: [{ [x]: g }, "supportsFIPS"] }, p = { [x]: g }, q = { [v]: c, [w]: [true, { [v]: h, [w]: [p, "supportsDualStack"] }] }, r = [l], s = [m], t = [{ [x]: "Region" }];
const _data = { version: "1.0", parameters: { Region: i, UseDualStack: j, UseFIPS: j, Endpoint: i }, rules: [{ conditions: [{ [v]: b, [w]: [k] }], rules: [{ conditions: r, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: d }, { conditions: s, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: d }, { endpoint: { url: k, properties: n, headers: n }, type: e }], type: f }, { conditions: [{ [v]: b, [w]: t }], rules: [{ conditions: [{ [v]: "aws.partition", [w]: t, assign: g }], rules: [{ conditions: [l, m], rules: [{ conditions: [{ [v]: c, [w]: [a, o] }, q], rules: [{ endpoint: { url: "https://portal.sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: n, headers: n }, type: e }], type: f }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: d }], type: f }, { conditions: r, rules: [{ conditions: [{ [v]: c, [w]: [o, a] }], rules: [{ conditions: [{ [v]: "stringEquals", [w]: [{ [v]: h, [w]: [p, "name"] }, "aws-us-gov"] }], endpoint: { url: "https://portal.sso.{Region}.amazonaws.com", properties: n, headers: n }, type: e }, { endpoint: { url: "https://portal.sso-fips.{Region}.{PartitionResult#dnsSuffix}", properties: n, headers: n }, type: e }], type: f }, { error: "FIPS is enabled but this partition does not support FIPS", type: d }], type: f }, { conditions: s, rules: [{ conditions: [q], rules: [{ endpoint: { url: "https://portal.sso.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: n, headers: n }, type: e }], type: f }, { error: "DualStack is enabled but this partition does not support DualStack", type: d }], type: f }, { endpoint: { url: "https://portal.sso.{Region}.{PartitionResult#dnsSuffix}", properties: n, headers: n }, type: e }], type: f }], type: f }, { error: "Invalid Configuration: Missing Region", type: d }] };
const ruleSet = _data;const cache = new index.y({
    size: 50,
    params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"],
});
const defaultEndpointResolver = (endpointParams, context = {}) => {
    return cache.get(endpointParams, () => index.v(ruleSet, {
        endpointParams: endpointParams,
        logger: context.logger,
    }));
};
index.w.aws = index.x;const getRuntimeConfig$1 = (config) => {
    return {
        apiVersion: "2019-06-10",
        base64Decoder: config?.base64Decoder ?? index.i,
        base64Encoder: config?.base64Encoder ?? index.t,
        disableHostPrefix: config?.disableHostPrefix ?? false,
        endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
        extensions: config?.extensions ?? [],
        httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultSSOHttpAuthSchemeProvider,
        httpAuthSchemes: config?.httpAuthSchemes ?? [
            {
                schemeId: "aws.auth#sigv4",
                identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
                signer: new index.A(),
            },
            {
                schemeId: "smithy.api#noAuth",
                identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                signer: new noAuth.N(),
            },
        ],
        logger: config?.logger ?? new index.z(),
        serviceId: config?.serviceId ?? "SSO",
        urlParser: config?.urlParser ?? index.n,
        utf8Decoder: config?.utf8Decoder ?? index.B,
        utf8Encoder: config?.utf8Encoder ?? index.k,
    };
};const getRuntimeConfig = (config) => {
    index.D(process.version);
    const defaultsMode = index.V(config);
    const defaultConfigProvider = () => defaultsMode().then(index.W);
    const clientSharedValues = getRuntimeConfig$1(config);
    index.F(process.version);
    return {
        ...clientSharedValues,
        ...config,
        runtime: "node",
        defaultsMode,
        bodyLengthChecker: config?.bodyLengthChecker ?? index.G,
        defaultUserAgentProvider: config?.defaultUserAgentProvider ??
            index.J({ serviceId: clientSharedValues.serviceId, clientVersion: packageInfo.version }),
        maxAttempts: config?.maxAttempts ?? index.o(index.K),
        region: config?.region ?? index.o(index.M, index.L),
        requestHandler: index.N.create(config?.requestHandler ?? defaultConfigProvider),
        retryMode: config?.retryMode ??
            index.o({
                ...index.O,
                default: async () => (await defaultConfigProvider()).retryMode || index.Q,
            }),
        sha256: config?.sha256 ?? index.R.bind(null, "sha256"),
        streamCollector: config?.streamCollector ?? index.s,
        useDualstackEndpoint: config?.useDualstackEndpoint ?? index.o(index.S),
        useFipsEndpoint: config?.useFipsEndpoint ?? index.o(index.T),
        userAgentAppId: config?.userAgentAppId ?? index.o(index.U),
    };
};const getHttpAuthExtensionConfiguration = (runtimeConfig) => {
    const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
    let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
    let _credentials = runtimeConfig.credentials;
    return {
        setHttpAuthScheme(httpAuthScheme) {
            const index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
            if (index === -1) {
                _httpAuthSchemes.push(httpAuthScheme);
            }
            else {
                _httpAuthSchemes.splice(index, 1, httpAuthScheme);
            }
        },
        httpAuthSchemes() {
            return _httpAuthSchemes;
        },
        setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
            _httpAuthSchemeProvider = httpAuthSchemeProvider;
        },
        httpAuthSchemeProvider() {
            return _httpAuthSchemeProvider;
        },
        setCredentials(credentials) {
            _credentials = credentials;
        },
        credentials() {
            return _credentials;
        },
    };
};
const resolveHttpAuthRuntimeConfig = (config) => {
    return {
        httpAuthSchemes: config.httpAuthSchemes(),
        httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
        credentials: config.credentials(),
    };
};const asPartial = (t) => t;
const resolveRuntimeExtensions = (runtimeConfig, extensions) => {
    const extensionConfiguration = {
        ...asPartial(index.a0(runtimeConfig)),
        ...asPartial(index.X(runtimeConfig)),
        ...asPartial(index.Y(runtimeConfig)),
        ...asPartial(getHttpAuthExtensionConfiguration(runtimeConfig)),
    };
    extensions.forEach((extension) => extension.configure(extensionConfiguration));
    return {
        ...runtimeConfig,
        ...index.Z(extensionConfiguration),
        ...index._(extensionConfiguration),
        ...index.$(extensionConfiguration),
        ...resolveHttpAuthRuntimeConfig(extensionConfiguration),
    };
};class SSOClient extends index.a1 {
    constructor(...[configuration]) {
        const _config_0 = getRuntimeConfig(configuration || {});
        const _config_1 = resolveClientEndpointParameters(_config_0);
        const _config_2 = index.a2(_config_1);
        const _config_3 = index.a3(_config_2);
        const _config_4 = index.a4(_config_3);
        const _config_5 = index.af(_config_4);
        const _config_6 = index.a5(_config_5);
        const _config_7 = resolveHttpAuthSchemeConfig(_config_6);
        const _config_8 = resolveRuntimeExtensions(_config_7, configuration?.extensions || []);
        super(_config_8);
        this.config = _config_8;
        this.middlewareStack.use(index.a6(this.config));
        this.middlewareStack.use(index.a7(this.config));
        this.middlewareStack.use(index.a8(this.config));
        this.middlewareStack.use(index.a9(this.config));
        this.middlewareStack.use(index.aa(this.config));
        this.middlewareStack.use(index.ab(this.config));
        this.middlewareStack.use(index.ac(this.config, {
            httpAuthSchemeParametersProvider: defaultSSOHttpAuthSchemeParametersProvider,
            identityProviderConfigProvider: async (config) => new index.ad({
                "aws.auth#sigv4": config.credentials,
            }),
        }));
        this.middlewareStack.use(index.ae(this.config));
    }
    destroy() {
        super.destroy();
    }
}class SSOServiceException extends index.ag {
    constructor(options) {
        super(options);
        Object.setPrototypeOf(this, SSOServiceException.prototype);
    }
}class InvalidRequestException extends SSOServiceException {
    constructor(opts) {
        super({
            name: "InvalidRequestException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidRequestException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidRequestException.prototype);
    }
}
class ResourceNotFoundException extends SSOServiceException {
    constructor(opts) {
        super({
            name: "ResourceNotFoundException",
            $fault: "client",
            ...opts,
        });
        this.name = "ResourceNotFoundException";
        this.$fault = "client";
        Object.setPrototypeOf(this, ResourceNotFoundException.prototype);
    }
}
class TooManyRequestsException extends SSOServiceException {
    constructor(opts) {
        super({
            name: "TooManyRequestsException",
            $fault: "client",
            ...opts,
        });
        this.name = "TooManyRequestsException";
        this.$fault = "client";
        Object.setPrototypeOf(this, TooManyRequestsException.prototype);
    }
}
class UnauthorizedException extends SSOServiceException {
    constructor(opts) {
        super({
            name: "UnauthorizedException",
            $fault: "client",
            ...opts,
        });
        this.name = "UnauthorizedException";
        this.$fault = "client";
        Object.setPrototypeOf(this, UnauthorizedException.prototype);
    }
}
const GetRoleCredentialsRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.accessToken && { accessToken: noAuth.S }),
});
const RoleCredentialsFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.secretAccessKey && { secretAccessKey: noAuth.S }),
    ...(obj.sessionToken && { sessionToken: noAuth.S }),
});
const GetRoleCredentialsResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.roleCredentials && { roleCredentials: RoleCredentialsFilterSensitiveLog(obj.roleCredentials) }),
});const se_GetRoleCredentialsCommand = async (input, context) => {
    const b = requestBuilder.r(input, context);
    const headers = index.aj({}, isSerializableHeaderValue, {
        [_xasbt]: input[_aT],
    });
    b.bp("/federation/credentials");
    const query = index.aj({
        [_rn]: [, index.ak(input[_rN], `roleName`)],
        [_ai]: [, index.ak(input[_aI], `accountId`)],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const de_GetRoleCredentialsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = index.aj({
        $metadata: deserializeMetadata(output),
    });
    const data = index.ak(index.al(await index.am(output.body, context)), "body");
    const doc = index.ah(data, {
        roleCredentials: index.ai,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_CommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await index.ap(output.body, context),
    };
    const errorCode = index.aq(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput);
        case "ResourceNotFoundException":
        case "com.amazonaws.sso#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput);
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
            throw await de_TooManyRequestsExceptionRes(parsedOutput);
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
            throw await de_UnauthorizedExceptionRes(parsedOutput);
        default:
            const parsedBody = parsedOutput.body;
            return throwDefaultError({
                output,
                parsedBody,
                errorCode,
            });
    }
};
const throwDefaultError = index.ar(SSOServiceException);
const de_InvalidRequestExceptionRes = async (parsedOutput, context) => {
    const contents = index.aj({});
    const data = parsedOutput.body;
    const doc = index.ah(data, {
        message: index.an,
    });
    Object.assign(contents, doc);
    const exception = new InvalidRequestException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return index.as(exception, parsedOutput.body);
};
const de_ResourceNotFoundExceptionRes = async (parsedOutput, context) => {
    const contents = index.aj({});
    const data = parsedOutput.body;
    const doc = index.ah(data, {
        message: index.an,
    });
    Object.assign(contents, doc);
    const exception = new ResourceNotFoundException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return index.as(exception, parsedOutput.body);
};
const de_TooManyRequestsExceptionRes = async (parsedOutput, context) => {
    const contents = index.aj({});
    const data = parsedOutput.body;
    const doc = index.ah(data, {
        message: index.an,
    });
    Object.assign(contents, doc);
    const exception = new TooManyRequestsException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return index.as(exception, parsedOutput.body);
};
const de_UnauthorizedExceptionRes = async (parsedOutput, context) => {
    const contents = index.aj({});
    const data = parsedOutput.body;
    const doc = index.ah(data, {
        message: index.an,
    });
    Object.assign(contents, doc);
    const exception = new UnauthorizedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return index.as(exception, parsedOutput.body);
};
const deserializeMetadata = (output) => ({
    httpStatusCode: output.statusCode,
    requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"],
});
const _aI = "accountId";
const _aT = "accessToken";
const _ai = "account_id";
const _rN = "roleName";
const _rn = "role_name";
const _xasbt = "x-amz-sso_bearer_token";class GetRoleCredentialsCommand extends index.at
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        index.au(config, this.serialize, this.deserialize),
        index.av(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SWBPortalService", "GetRoleCredentials", {})
    .n("SSOClient", "GetRoleCredentialsCommand")
    .f(GetRoleCredentialsRequestFilterSensitiveLog, GetRoleCredentialsResponseFilterSensitiveLog)
    .ser(se_GetRoleCredentialsCommand)
    .de(de_GetRoleCredentialsCommand)
    .build() {
}exports.GetRoleCredentialsCommand=GetRoleCredentialsCommand;exports.SSOClient=SSOClient;