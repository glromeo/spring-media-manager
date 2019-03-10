import React from 'react';
import Options from './Options';

describe('options', () => {

    it('fetches first page, then second page', async () => {
        let options = new Options(0, 10);
        let deferred = {};
        options.fetch = async function (pageIndex, pageSize) {
            const page = [];
            for (let p = 0; p < pageSize; p++) {
                page[p] = {key: p + pageSize * pageIndex, value: p};
            }
            return new Promise(resolve => {
                deferred.resolve = () => resolve({page, total: 1000});
            });
        }
        expect(deferred.promise = options.get(0)).toBeInstanceOf(Promise);
        expect(options.get(0)).toBe(null);
        deferred.resolve();
        await deferred.promise;
        expect(options.get(0).key).toBe(0);
        expect(options.get(9).key).toBe(9);
        expect(deferred.promise = options.get(10)).toBeInstanceOf(Promise);
        deferred.resolve();
        await deferred.promise;
        expect(options.get(10).key).toBe(10);
    });

    it('fetches first page and second page', async () => {
        let options = new Options(0, 10);
        let promises = [], resolvers = [];
        options.fetch = async function (pageIndex, pageSize) {
            const page = [];
            for (let p = 0; p < pageSize; p++) {
                page[p] = {key: p + pageSize * pageIndex, value: p};
            }
            return new Promise(resolve => {
                resolvers.push(() => resolve({page, total: 1000}));
            });
        }
        expect(promises[0] = options.get(0)).toBeInstanceOf(Promise);
        expect(options.get(0)).toBe(null);
        expect(promises[1] = options.get(15)).toBeInstanceOf(Promise);
        expect(options.get(13)).toBe(null);
        resolvers[0]();
        resolvers[1]();
        await promises[0];
        console.log("checking:", 0);
        expect(options.get(0).key).toBe(0);
        await promises[1];
        console.log("checking:", 1);
        expect(options.get(12).key).toBe(12);
        expect(options.get(15).key).toBe(15);
    });

});

