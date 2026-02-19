async function test() {
    const url = 'https://images.unsplash.com/photo-1560743641-3914f6050b18?auto=format&fit=crop&q=80&w=1600&h=900';
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        console.log(`Status: ${res.status}`);
        const text = await res.text();
        console.log(`Content length: ${text.length}`);
    } catch (e) {
        console.error(e);
    }
}
test();
