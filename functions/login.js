import { SignJWT } from "jose";

export async function onRequestPost(context) {
    const { request, env } = context;
    const credentials = await request.json();

    const validUsername = env.LOGIN_USER; 
    const validPassword = env.LOGIN_PASS; 

    if (credentials.username === validUsername && credentials.password === validPassword) {
        // JWT-Token generieren
        const secretKey = new TextEncoder().encode(env.JWT_SECRET);
        const token = await new SignJWT({ username: "Recruiter" })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("30m")
            .sign(secretKey);

        return new Response("OK", {
            status: 200,
            headers: {
                "Set-Cookie": `auth=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=1800`
            }
        });
    } else {
        return new Response("Access Denied", { status: 401 });
    }
}