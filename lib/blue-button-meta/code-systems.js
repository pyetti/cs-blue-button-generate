"use strict";

const oids = require("./oids");

const codeSystem = {
    codeDisplayName: function (code) {
        return this.cs.table && this.cs.table[code];
    },
    displayNameCode: (function () {
        const reverseTables = {};

        return function (name) {
            const oid = this.oid;
            let reverseTable = reverseTables[oid];
            if (!reverseTable) {
                const table = this.cs.table || {};
                reverseTable = Object.keys(table).reduce(function (r, code) {
                    const name = table[code];
                    r[name] = code;
                    return r;
                }, {});
                reverseTables[oid] = reverseTable;
            }
            return reverseTable[name];
        };
    })(),
    name: function () {
        return this.cs.name;
    },
    systemId: function () {
        const systemOID = this.cs.code_system;
        if (systemOID) {
            return {
                codeSystem: systemOID,
                codeSystemName: oids[systemOID].name
            };
        } else {
            return {
                codeSystem: this.oid,
                codeSystemName: this.cs.name
            };
        }
    }
};

exports.find = function (oid) {
    const cs = oids[oid];
    if (cs) {
        const result = Object.create(codeSystem);
        result.oid = oid;
        result.cs = cs;
        return result;
    } else {
        return null;
    }
};

exports.findFromName = (function () {
    let nameIndex;

    return function (name) {
        if (!nameIndex) {
            nameIndex = Object.keys(oids).reduce(function (r, oid) {
                const n = oids[oid].name;
                r[n] = oid;
                return r;
            }, {});
        }
        return nameIndex[name];
    };
})();
