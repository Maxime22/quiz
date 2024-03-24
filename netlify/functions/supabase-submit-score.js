const {createClient} = require('@supabase/supabase-js');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {statusCode: 405, body: 'Method Not Allowed'};
    }

    // Récupérer le token d'authentification et les données du score à partir du corps de la requête
    const {token, scoreData} = JSON.parse(event.body);

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        },
    });

    // Tenter de récupérer l'utilisateur pour valider le token
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        return {statusCode: 401, body: JSON.stringify({error: "Authentification échouée"})};
    }

    // SQL
    const { data, error } = await supabase.rpc('update_score_and_time', {
        v_language: scoreData.language,
        v_lesson_id: scoreData.lesson_id,
        v_new_completion_time: scoreData.completion_time, // Assurez-vous que 'completion_time' est bien le champ dans scoreData
        v_new_score: scoreData.score, // Assurez-vous que 'score' est bien le champ dans scoreData
        v_user_id: user.id // Assurez-vous que cet ID est bien celui de l'utilisateur
    });

    if (error) {
        return {statusCode: 500, body: JSON.stringify({error: error.message})};
    }

    return {statusCode: 200, body: JSON.stringify({data})};
};
