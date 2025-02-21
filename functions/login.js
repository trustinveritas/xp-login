export async function onRequestPost(context) {
    const { request, env } = context;
    const credentials = await request.json();

    const validUsername = env.LOGIN_USER;
    const validPassword = env.LOGIN_PASS;

    if (credentials.username === validUsername && credentials.password === validPassword) {
        // 🔐 JWT-Token manuell generieren
        const token = await signJWT({ user: credentials.username }, env.JWT_SECRET, 1800);

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

// 🔑 JWT-Signatur mit Cloudflare Web Crypto API
async function signJWT(payload, secret, expiresInSeconds) {
    const header = { alg: "HS256", typ: "JWT" };
    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const data = { ...payload, exp };

    // Base64URL Encode Funktion
    const base64url = (input) =>
        btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");

    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const headerB64 = base64url(new TextEncoder().encode(JSON.stringify(header)));
    const payloadB64 = base64url(new TextEncoder().encode(JSON.stringify(data)));
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${headerB64}.${payloadB64}`));
    const signatureB64 = base64url(signature);

    return `${headerB64}.${payloadB64}.${signatureB64}`;
}