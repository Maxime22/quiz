// https://dev.to/andyhaskell/testing-your-indexeddb-code-with-jest-2o17
import {setupDB, registerLessonScore} from "../../src/shared/js/indexedDB";

require("fake-indexeddb/auto");

if (typeof structuredClone === 'undefined') {
    global.structuredClone = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };
}

test('test setupDB with empty callback', function (done) {
    setupDB(function () {
        done();
    });
});

// test('test registerLessonScore', function (done) {
//     setupDB(function () {
//         registerLessonScore(80, 1, function () {
//             done();
//         })
//     });
// });

test('la donnée est peanut butter', (done) => {
    function callback(error, data) {
        if (error) {
            done(error);
            return;
        }
        try {
            expect(data).toBe('peanut butter');
            done();
        } catch (error) {
            done(error);
        }
    }

    registerLessonScore(80,1, callback);
});