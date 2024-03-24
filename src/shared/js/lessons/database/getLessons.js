export async function getLessons(language) {
    const token = localStorage.getItem('supabase.auth.token');

    if (!token) {
        window.location.href = '/src/shared/html/login.html';
        return null;
    }

    try {
        const response = await fetch('/.netlify/functions/supabase-get-user-lessons', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token, language}),
        });

        const result = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = '/src/shared/html/login.html';
                return null;
            }
            if (response.status === 500) {
                console.error('Une erreur est survenue lors de la récupération des leçons : ', result.error);
                return null;
            }
        }

        return result.lessons;

    } catch (error) {
        console.error('Erreur lors de la récupération des leçons :', error);
        return null;
    }
}

