export const testServer = async () => {
    try {
        const res = await fetch("http://localhost:5000/");
        const data = await res.json();
        console.log("Server response:", data);
    } catch (err) {
        console.error("Error connecting to server:", err);
    }
};