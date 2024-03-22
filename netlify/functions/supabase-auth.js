const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
    const { email, password } = JSON.parse(event.body);
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

    try {
        const response = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        const { user, session, error} = response.data;

        if (error) {
            return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({user, session}),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erreur du serveur." }),
        };
    }
};
