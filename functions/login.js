import jwt from "@tsndr/cloudflare-worker-jwt";

export async function onRequestPost(context) {
    const { request, env } = context;
    const credentials = await request.json();

    const validUsername = env.LOGIN_USER;
    const validPassword = env.LOGIN_PASS;

    if (credentials.username === validUsername && credentials.password === validPassword) {
        // ✅ JWT-Token generieren (30 Minuten gültig)
        const token = await jwt.sign({ user: credentials.username }, env.JWT_SECRET, { expiresIn: "30m" });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                // ✅ Setzt das JWT-Cookie für die gesamte salucci.ch-Domain
                "Set-Cookie": `auth_token=${token}; Path=/; Domain=.salucci.ch; HttpOnly; Secure; SameSite=None; Max-Age=1800`
            }
        });
    } else {
        return new Response(JSON.stringify({ success: false, message: "Access Denied" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }
}