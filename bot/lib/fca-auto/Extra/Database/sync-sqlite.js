/**
 * Synchronous SQLite wrapper using sqlite3 + deasync.
 * Provides a subset of the better-sqlite3 API used by the FCA database layer.
 */
const sqlite3 = require('sqlite3').verbose();
const deasync = require('deasync');

class Statement {
    constructor(db, sql) {
        this._db = db;
        this._sql = sql;
    }

    get(...params) {
        let done = false, result = null, err = null;
        this._db.get(this._sql, params.flat(), function (e, row) {
            err = e; result = row; done = true;
        });
        deasync.loopWhile(() => !done);
        if (err) throw err;
        return result || null;
    }

    run(...params) {
        let done = false, err = null;
        this._db.run(this._sql, params.flat(), function (e) {
            err = e; done = true;
        });
        deasync.loopWhile(() => !done);
        if (err) throw err;
        return this;
    }

    iterate(...params) {
        let done = false, rows = [], err = null;
        this._db.all(this._sql, params.flat(), function (e, r) {
            err = e; rows = r || []; done = true;
        });
        deasync.loopWhile(() => !done);
        if (err) throw err;
        return rows[Symbol.iterator]();
    }

    all(...params) {
        let done = false, rows = [], err = null;
        this._db.all(this._sql, params.flat(), function (e, r) {
            err = e; rows = r || []; done = true;
        });
        deasync.loopWhile(() => !done);
        if (err) throw err;
        return rows;
    }
}

class SyncDatabase {
    constructor(filename) {
        this._db = new sqlite3.Database(filename);
    }

    prepare(sql) {
        return new Statement(this._db, sql);
    }

    close() {
        this._db.close();
    }
}

module.exports = SyncDatabase;
