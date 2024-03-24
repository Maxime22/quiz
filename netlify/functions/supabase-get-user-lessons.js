const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {statusCode: 405, body: 'Method Not Allowed'};
    }

    const {token, language} = JSON.parse(event.body);

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        },
    });

    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        return {statusCode: 401, body: JSON.stringify({error: "Authentification échouée"})};
    }

    if (!user.id || !language) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing user_id or language parameter' })
        };
    }

    try {
        const { data: lessons, error } = await supabase
            .from('language_lesson_completed')
            .select('*')
            .eq('user_id', user.id)
            .eq('language', language);

        if (error) throw error;

        return {
            statusCode: 200,
            body: JSON.stringify({ lessons })
        };
    } catch (error) {
        console.error('Error fetching lessons:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch lessons' })
        };
    }
};
