import { Store } from "@tauri-apps/plugin-store";

let store;

async function initStore() {
    if (!store) {
        store = new Store(".settings.dat");
        await store.save(); // Ensure the store is initialized
    }
}

// Save Token
export async function saveToken(token) {
    try {
        await initStore();
        await store.set("auth_token", token);
        await store.save();  
        console.log("Token saved successfully!");
    } catch (error) {
        console.error("Error saving token:", error);
    }
}

// Get Token
export async function getToken() {
    try {
        await initStore();
        return await store.get("auth_token");
    } catch (error) {
        console.error("Error retrieving token:", error);
        return null;
    }
}

// Remove Token
export async function removeToken() {
    try {
        await initStore();
        await store.delete("auth_token");
        await store.save();
        console.log("Token removed!");
    } catch (error) {
        console.error("Error removing token:", error);
    }
}
