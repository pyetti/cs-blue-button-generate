"use strict";

const moment = require("moment");
const css = require("./blue-button-meta/code-systems");

exports.codeFromName = function (OID) {
    return function (input) {
        const cs = css.find(OID);
        const code = cs ? cs.displayNameCode(input) : undefined;
        const systemInfo = cs.systemId(OID);
        return {
            "displayName": input,
            "code": code,
            "codeSystem": systemInfo.codeSystem,
            "codeSystemName": systemInfo.codeSystemName
        };
    };
};

exports.code = function (input) {
    const result = {};
    if (input.code) {
        result.code = input.code;
    }

    if (input.name) {
        result.displayName = input.name;
    }

    const code_system = input.code_system || (input.code_system_name && css.findFromName(input.code_system_name));
    if (code_system) {
        result.codeSystem = code_system;
    }

    if (input.code_system_name) {
        result.codeSystemName = input.code_system_name;
    }

    return result;
};

const precisionToFormat = {
    year: 'YYYY',
    month: 'YYYYMM',
    day: 'YYYYMMDD',
    hour: 'YYYYMMDDHH',
    minute: 'YYYYMMDDHHMM',
    second: 'YYYYMMDDHHmmss',
    subsecond: 'YYYYMMDDHHmmss.SSS'
};

exports.time = function (input) {
    const m = moment.parseZone(input.date);
    const formatSpec = precisionToFormat[input.precision];
    return m.format(formatSpec);
};

const acronymize = exports.acronymize = function (string) {
    let ret = string.split(" ");
    let fL = ret[0].slice(0, 1);
    let lL = ret[1].slice(0, 1);
    fL = fL.toUpperCase();
    lL = lL.toUpperCase();
    ret = fL + lL;
    if (ret === "PH") {
        ret = "HP";
    }
    if (ret === "HA") {
        ret = "H";
    }
    return ret;
};

exports.telecom = function (input) {
    const transformPhones = function (input) {
        const phones = input.phone;
        if (phones) {
            return phones.reduce(function (r, phone) {
                if (phone && phone.number) {
                    const attrs = {
                        value: "tel:" + phone.number
                    };
                    if (phone.type) {
                        attrs.use = acronymize(phone.type);
                    }
                    r.push(attrs);
                }
                return r;
            }, []);
        } else {
            return [];
        }
    };

    const transformEmails = function (input) {
        const emails = input.email;
        if (emails) {
            return emails.reduce(function (r, email) {
                if (email && email.address) {
                    const attrs = {
                        value: "mailto:" + email.address
                    };
                    if (email.type) {
                        attrs.use = acronymize(email.type);
                    }
                    r.push(attrs);
                }
                return r;
            }, []);
        } else {
            return [];
        }
    };

    const result = [].concat(transformPhones(input), transformEmails(input));
    return result.length === 0 ? null : result;
};

const nameSingle = function (input) {
    let given = null;
    if (input.first) {
        given = [input.first];
        if (input.middle && input.middle[0]) {
            given.push(input.middle[0]);
        }
    }
    return {
        prefix: input.prefix,
        given: given,
        family: input.last,
        suffix: input.suffix
    };
};

exports.name = function (input) {
    if (Array.isArray(input)) {
        return input.map(function (e) {
            return nameSingle(e);
        });
    } else {
        return nameSingle(input);
    }
};
