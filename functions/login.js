export async function onRequestPost(context) {
    const formData = await context.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    // Sichere Environment Variables aus Cloudflare
    const CORRECT_USERNAME = context.env.LOGIN_USER;
    const CORRECT_PASSWORD = context.env.LOGIN_PASS;

    if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
        return new Response(JSON.stringify({ success: false }), { status: 401 });
    }
}