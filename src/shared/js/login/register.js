// // https://supabase.com/docs/reference/javascript/auth-api
//
// document.addEventListener('DOMContentLoaded', function () {
//
//     async function signUpUser(email, password) {
//         try {
//             const response = await fetch('/.netlify/functions/supabase-register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ email, password }),
//             });
//
//             const { error } = await response.json();
//
//             if (error) throw error;
//
//             alert("Un email de confirmation a été envoyé. Veuillez vérifier votre boîte de réception et confirmer votre compte.");
//             window.location.href = '../../html/login.html';
//
//         } catch (error) {
//             console.error(error);
//             alert("Une erreur est survenue lors de l'inscription.");
//         }
//     }
//
//     const signUpForm = document.getElementById('signUpForm');
//     signUpForm.addEventListener('submit', (event) => {
//         event.preventDefault();
//         const email = document.getElementById('emailSignUp').value;
//         const password = document.getElementById('passwordSignUp').value;
//         signUpUser(email, password);
//     });
//
//     // async function getCurrentUser() {
//     //     const {data, error} = await _supabase.auth.getUser();
//     //
//     //     if (error) {
//     //         console.error('Erreur lors de la récupération de l\'utilisateur:', error);
//     //         return null;
//     //     }
//     //
//     //     if (data && data.user) {
//     //         console.log("Utilisateur authentifié:", data.user);
//     //         return data.user;
//     //     } else {
//     //         console.log("Aucun utilisateur authentifié.");
//     //         return null;
//     //     }
//     // }
//
//
//     // async function sendLessonScore(lessonId, language, score, completionTime) {
//     //     try {
//     //         const user = await getCurrentUser();
//     //
//     //         if (!user) {
//     //             console.log('Utilisateur non connecté');
//     //             return {error: 'Utilisateur non connecté'};
//     //         }
//     //
//     //         const userId = user.id; // Utilisez l'ID de l'utilisateur directement obtenu de getCurrentUser
//     //         console.log('User ID:', userId);
//     //
//     //         const {data, error} = await _supabase
//     //             .from('language_lesson_completed')
//     //             .insert([
//     //                 {
//     //                     user_id: userId,
//     //                     lesson_id: lessonId,
//     //                     language: language,
//     //                     score: score,
//     //                     completion_time: completionTime
//     //                 },
//     //             ]);
//     //
//     //         if (error) {
//     //             console.error('Erreur lors de l\'envoi du score:', error);
//     //             return {error: error.message || 'Une erreur est survenue'};
//     //         }
//     //
//     //         console.log('Score envoyé avec succès');
//     //         return "ok";
//     //
//     //     } catch (error) {
//     //         console.error('Erreur dans le try de sendLessonScore:', error);
//     //         return {error: error.message || 'Une erreur est survenue'};
//     //     }
//     // }
//
//     // document.getElementById('sendScoreBtn').addEventListener('click', function () {
//     //     // Exemple d'utilisation avec des valeurs arbitraires
//     //     sendLessonScore(1, 'fr_FR', 100, 20)
//     //         .then(response => {
//     //             if (response.error) {
//     //                 console.error('Erreur lors de l\'envoi du score:', response.error);
//     //                 alert('Erreur lors de l\'envoi du score: ' + response.error);
//     //             } else {
//     //                 console.log('Score envoyé avec succès:', response);
//     //             }
//     //         })
//     //         .catch(error => {
//     //             // Gestion des erreurs pour les promesses rejetées
//     //             console.error('Erreur lors de l\'envoi du score:', error);
//     //             // Informer l'utilisateur de l'erreur
//     //             alert('Erreur lors de l\'envoi du score: ' + error.message);
//     //         });
//     // });
// });
//
//
