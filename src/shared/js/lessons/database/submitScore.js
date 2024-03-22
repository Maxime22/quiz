export async function submitScore(scoreData) {
    // Récupérer le token d'authentification du localStorage
    const token = localStorage.getItem('supabase.auth.token');

    // Assurez-vous d'avoir un token avant de continuer
    if (!token) {
        window.location.href = '/src/shared/html/login.html';
        return;
    }

    try {
        const response = await fetch('/.netlify/functions/supabase-submit-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token, scoreData}),
        });

        const result = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = '/src/shared/html/login.html';
                return;
            }
            if (response.status === 500) {
                console.error('Une erreur est survenue lors de la soumission du score : ', result.error);
                return;
            }
        }

        console.log('Score soumis avec succès');
    } catch (error) {
        console.error('Erreur lors de la soumission du score:', error);
    }
}

