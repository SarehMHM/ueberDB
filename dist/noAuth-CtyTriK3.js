'use strict';const SENSITIVE_STRING = "***SensitiveInformation***";function extendedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
}class NoAuthSigner {
    async sign(httpRequest, identity, signingProperties) {
        return httpRequest;
    }
}exports.N=NoAuthSigner;exports.S=SENSITIVE_STRING;exports.e=extendedEncodeURIComponent;