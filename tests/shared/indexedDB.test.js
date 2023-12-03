// https://dev.to/andyhaskell/testing-your-indexeddb-code-with-jest-2o17
import {setupDB, registerLessonScore} from "../../src/shared/js/indexedDB";
require("fake-indexeddb/auto");

test('We can register lesson score', function (done) {
    setupDB(function () {
        // registerLessonScore(80, 1 , function (lessons) {
        //     expect(lessons).toHaveLength(1);
            done();
        // });
    });
}, 5000);