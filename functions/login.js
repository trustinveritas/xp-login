export async function onRequestPost(context) {
    const { request, env } = context;
    const credentials = await request.json();
    
    const validUsername = env.LOGIN_USER;  // Username aus Umgebungsvariablen
    const validPassword = env.LOGIN_PASS;  // Passwort aus Umgebungsvariablen

    if (credentials.username === validUsername && credentials.password === validPassword) {
        // Erfolgreiche Authentifizierung: Setze ein sicheres Cookie mit Max-Age 1800 Sekunden (30 Min.)
        return new Response("OK", {
            status: 200,
            headers: {
                "Set-Cookie": "auth=true; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=1800",
                "Content-Type": "text/plain"
            }
        });
    } else {
        return new Response("Access Denied", { status: 401 });
    }
}