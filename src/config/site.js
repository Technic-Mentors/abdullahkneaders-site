// Single source of truth for brand/backend wiring — vite.config.js and src/api/client.js
// both read from this file instead of duplicating these values.
//
// To point this codebase at a different brand/backend, comment out the active block
// below and uncomment the other one.

// --- MA Universal (active) ---
export const BRAND_NAME = 'Abdullah Kneaders';
export const DEV_BACKEND_PORT = 3006;
export const DEV_FRONTEND_PORT = 5174;
export const PROD_API_URL = 'https://backend.abdullahkneaders.com'; // placeholder until real domain is bought

// --- Libas-e-Haram (reference/rollback) ---
// export const BRAND_NAME = 'Libas-e-Haram';
// export const DEV_BACKEND_PORT = 4000;
// export const DEV_FRONTEND_PORT = 5173;
// export const PROD_API_URL = 'https://backend.libaseharam.com';
