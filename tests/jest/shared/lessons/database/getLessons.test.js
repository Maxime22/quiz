// TODO: Faire les tests des fonctions qui call les fonctions serverless

// import { getLessons } from "../../../../../src/shared/js/lessons/database/getLessons.js";
// import fetchMock from 'jest-fetch-mock';
//
// fetchMock.enableMocks();
//
// const originalLocation = window.location;
//
// beforeAll(() => {
//     delete window.location;
//     window.location = { href: jest.fn() };
// });
//
// afterAll(() => {
//     window.location = originalLocation;
// });
//
// beforeEach(() => {
//     fetchMock.resetMocks();
// });
//
// it('should redirect to login if no token is found', async () => {
//     // Simuler l'absence de token
//     jest.spyOn(localStorage, 'getItem').mockReturnValue(null);
//
//     // Appeler la fonction
//     const lessons = await getLessons('en_US');
//
//     // Vérifier les comportements attendus
//     expect(window.location.href).toContain('/src/shared/html/login.html');
//     expect(lessons).toBeNull();
// });
//
// it('should return lessons on successful fetch', async () => {
//     // Mock du localStorage pour simuler un token existant
//     jest.spyOn(localStorage, 'getItem').mockReturnValue('fake-token');
//
//     // Mock de fetch pour simuler une réponse réussie
//     fetchMock.mockResponseOnce(JSON.stringify({ lessons: ['lesson1', 'lesson2'] }));
//
//     const lessons = await getLessons('en_US');
//
//     // Vérifications
//     expect(lessons).toEqual(['lesson1', 'lesson2']);
// });
//
// it('should redirect to login on 401 response', async () => {
//     jest.spyOn(localStorage, 'getItem').mockReturnValue('fake-token');
//     fetchMock.mockResponseOnce('', { status: 401 });
//
//     const lessons = await getLessons('en_US');
//
//     expect(window.location.href).toContain('/src/shared/html/login.html');
//     expect(lessons).toBeNull();
// });
//
// it('should redirect to login if no token is found', async () => {
//     // Simuler l'absence de token
//     jest.spyOn(localStorage, 'getItem').mockReturnValue(null);
//
//     // Appeler la fonction
//     const lessons = await getLessons('en_US');
//
//     // Vérifier les comportements attendus
//     expect(window.location.href).toContain('/src/shared/html/login.html');
//     expect(lessons).toBeNull();
// });
//
