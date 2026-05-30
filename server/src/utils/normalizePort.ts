export default function normalizePort(val: string | number | undefined) {
    const port = typeof val === "string" ? parseInt(val, 10) : val;

    if (!port || isNaN(port)) return 3000;
    return port;
}