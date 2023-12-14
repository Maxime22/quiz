import {
  handleKeyUp,
  updateToNextLesson,
} from "../../../src/shared/js/lessons/lessonManagement.js";
import * as uiHelpers from "../../../src/shared/js/lessons/uiHelpers.js";
import * as calculation from "../../../src/shared/js/lessons/calculation.js";
import * as indexedDB from "../../../src/shared/js/lessons/database/indexedDB.js";

// PLUS SIMPLE (VOIR UNIQUEMENT POSSIBLE) à MOCKER SI la fonction appelée est DANS UN AUTRE FICHIER, DE PLUS ILS ONT PAS LA MEME RESPONSABILITE DONC C'EST NORMAL DE PAS LE METTRE DANS LE MEME FICHIER
// IL Y A PEUT ETREN DE LE FAIRE MAIS CE SERAIT AVEC THIS OU AUTRE ET C'EST PLUS COMPLIQUE
jest.mock("../../../src/shared/js/lessons/uiHelpers.js", () => ({
  checkAnswer: jest.fn(),
  updateUI: jest.fn(),
}));

jest.mock("../../../src/shared/js/lessons/database/indexedDB.js", () => ({
  updateDatabaseAndDisplay: jest.fn(),
}));

jest.mock("../../../src/shared/js/lessons/calculation.js", () => ({
  calculateTimeSpent: jest.fn(),
  calculateScoreInPercentage: jest.fn(),
}));

// jest.mock('../../../src/shared/js/lessons/lessonManagement.js', () => ({
//     ...jest.requireActual('../../../src/shared/js/lessons/lessonManagement'),
//         updateDatabaseAndDisplay: jest.fn().mockImplementation(() => Promise.resolve()),
//         calculateTimeSpent:jest.fn(),
//         calculateScoreInPercentage:jest.fn(),
//         updateUI:jest.fn(),
// }));

describe("calculateTimeSpent", () => {
  it("should calculate the correct time spent", () => {
    // GIVEN
    // Get the actual implementation of calculateTimeSpent
    const realCalculateTimeSpent = jest.requireActual(
      "../../../src/shared/js/lessons/calculation.js",
    ).calculateTimeSpent;

    // Mock Date.now() to return a specific timestamp
    jest
      .spyOn(global.Date, "now")
      .mockImplementation(() => new Date("2023-12-11T12:00:00Z").getTime());

    // Initialize the timer
    let timerStart = new Date("2023-12-11T11:59:30Z").getTime();

    // WHEN
    const timeSpent = realCalculateTimeSpent(timerStart);

    // THEN
    expect(timeSpent).toBe(30); // 30 seconds
  });
});

describe("handleKeyUp", () => {
  it("should start timer and call checkAnswer on Enter key press", () => {
    // GIVEN
    const realHandleKeyUp = jest.requireActual(
      "../../../src/shared/js/lessons/lessonManagement.js",
    ).handleKeyUp;
    const mockEvent = { keyCode: 13 }; // 13 is the keycode for Enter

    // WHEN
    realHandleKeyUp(mockEvent);

    // THEN
    expect(uiHelpers.checkAnswer).toHaveBeenCalled();
  });
});

describe("updateToNextLesson", () => {
  it("should call updateUI on successful database update", async () => {
    // GIVEN
    const lessons = ["lesson1", "lesson2"];
    let currentLesson = 1;
    calculation.calculateTimeSpent.mockReturnValue(120);
    calculation.calculateScoreInPercentage.mockReturnValue(80);
    indexedDB.updateDatabaseAndDisplay.mockResolvedValue();

    // WHEN
    await updateToNextLesson(lessons, currentLesson);

    // THEN
    expect(indexedDB.updateDatabaseAndDisplay).toHaveBeenCalledWith(
      80,
      120,
      currentLesson,
    );
    expect(uiHelpers.updateUI).toHaveBeenCalledWith(lessons, currentLesson);
  });
});
