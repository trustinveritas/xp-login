import jwt from "@tsndr/cloudflare-worker-jwt";

export async function onRequestPost(context) {
    const { request, env } = context;
    const credentials = await request.json();

    const validUsername = env.LOGIN_USER;
    const validPassword = env.LOGIN_PASS;

    if (credentials.username === validUsername && credentials.password === validPassword) {
        // ✅ JWT-Token generieren
        const token = await jwt.sign({ user: credentials.username }, env.JWT_SECRET, { expiresIn: "30m" });

        return new Response(JSON.stringify({ token }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Set-Cookie": `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=1800`
            }
        });
    } else {
        return new Response("Access Denied", { status: 401 });
    }
}