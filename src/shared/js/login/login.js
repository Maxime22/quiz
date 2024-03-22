// https://supabase.com/docs/reference/javascript/auth-api

document.addEventListener('DOMContentLoaded', function () {
    async function signInUser(email, password) {
        try {
            const response = await fetch('/.netlify/functions/supabase-auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            });

            const {session, error} = await response.json();

            if (response.status !== 200) {
                throw new Error(error);
            }

            localStorage.setItem('supabase.auth.token', session.access_token);

            console.log('User signed in successfully', session);
            return "ok";
        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue lors de la connexion.");
        }
    }

    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('emailLogin').value;
        const password = document.getElementById('passwordLogin').value;
        signInUser(email, password).then((result) => {
            if (result === "ok") {
                window.location.href = '/index.html';
            }
        });
    });

});


