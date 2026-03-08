// ─── Central API Service ─────────────────────────────────────────────────────
// Use relative path — Vite dev proxy routes /api/* to http://localhost:8000
// This avoids CORS issues during local development.
const BASE_URL = "/api/v1";

// ─── Token Management ─────────────────────────────────────────────────────────
export const getTokens = () => {
    try {
        return JSON.parse(localStorage.getItem("tokens")) || null;
    } catch {
        return null;
    }
};

export const setTokens = (tokens) => {
    localStorage.setItem("tokens", JSON.stringify(tokens));
};

export const clearTokens = () => {
    localStorage.removeItem("tokens");
};

// ─── HTTP client with auto token refresh ─────────────────────────────────────
let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (cb) => {
    refreshSubscribers.push(cb);
};

async function refreshAccessToken() {
    const tokens = getTokens();
    if (!tokens?.refresh) throw new Error("No refresh token");

    const res = await fetch(`${BASE_URL}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: tokens.refresh }),
    });

    if (!res.ok) {
        clearTokens();
        throw new Error("Session expired. Please log in again.");
    }

    const data = await res.json();
    const newTokens = { ...tokens, access: data.access };
    setTokens(newTokens);
    return data.access;
}

export async function apiFetch(endpoint, options = {}) {
    const tokens = getTokens();
    const headers = {
        "Content-Type": "application/json",
        ...(tokens?.access ? { Authorization: `Bearer ${tokens.access}` } : {}),
        ...options.headers,
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

    // Handle 401 - try refreshing token
    if (res.status === 401 && tokens?.refresh) {
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const newAccess = await refreshAccessToken();
                isRefreshing = false;
                onRefreshed(newAccess);

                // Retry original request
                const retryHeaders = {
                    ...headers,
                    Authorization: `Bearer ${newAccess}`,
                };
                const retryRes = await fetch(`${BASE_URL}${endpoint}`, {
                    ...options,
                    headers: retryHeaders,
                });
                return retryRes;
            } catch (err) {
                isRefreshing = false;
                clearTokens();
                window.location.href = "/login";
                throw err;
            }
        } else {
            // Queue while refresh is in progress
            return new Promise((resolve, reject) => {
                addRefreshSubscriber(async (newToken) => {
                    const retryHeaders = {
                        ...headers,
                        Authorization: `Bearer ${newToken}`,
                    };
                    try {
                        const retryRes = await fetch(`${BASE_URL}${endpoint}`, {
                            ...options,
                            headers: retryHeaders,
                        });
                        resolve(retryRes);
                    } catch (err) {
                        reject(err);
                    }
                });
            });
        }
    }

    return res;
}

// ─── Convenience methods ──────────────────────────────────────────────────────
export const api = {
    get: (endpoint) => apiFetch(endpoint, { method: "GET" }),

    post: (endpoint, body) =>
        apiFetch(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
        }),

    patch: (endpoint, body) =>
        apiFetch(endpoint, {
            method: "PATCH",
            body: JSON.stringify(body),
        }),

    delete: (endpoint) => apiFetch(endpoint, { method: "DELETE" }),
};

// ─── Auth APIs ────────────────────────────────────────────────────────────────
export const authAPI = {
    register: async ({ email, username, password, password_confirm }) => {
        const res = await fetch(`${BASE_URL}/auth/register/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, password, password_confirm }),
        });
        return res.json();
    },

    login: async ({ email, password }) => {
        const res = await fetch(`${BASE_URL}/auth/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        return res.json();
    },

    logout: async () => {
        const tokens = getTokens();
        if (!tokens?.refresh) return;
        await api.post("/auth/logout/", { refresh: tokens.refresh });
        clearTokens();
    },

    me: async () => {
        const res = await api.get("/auth/me/");
        return res.json();
    },
};

// ─── Profile APIs ─────────────────────────────────────────────────────────────
export const profileAPI = {
    get: async () => {
        const res = await api.get("/profile/");
        return res.json();
    },

    create: async (data) => {
        const res = await api.post("/profile/", data);
        return res.json();
    },

    update: async (data) => {
        const res = await api.patch("/profile/", data);
        return res.json();
    },
};

// ─── Learning APIs ────────────────────────────────────────────────────────────
export const learningAPI = {
    generate: async () => {
        const res = await api.post("/learning/generate/", {});
        return res.json();
    },

    getPaths: async () => {
        const res = await api.get("/learning/paths/");
        return res.json();
    },

    getPathDetail: async (id) => {
        const res = await api.get(`/learning/paths/${id}/`);
        return res.json();
    },

    completeLecture: async (lectureId) => {
        const res = await api.post(`/learning/lectures/${lectureId}/complete/`, {});
        return res.json();
    },
};

// ─── Assignment APIs ──────────────────────────────────────────────────────────
export const assignmentAPI = {
    getList: async () => {
        const res = await api.get("/assignments/");
        return res.json();
    },

    getDetail: async (id) => {
        const res = await api.get(`/assignments/${id}/`);
        return res.json();
    },

    submit: async (id, { solution_code, language }) => {
        const res = await api.post(`/assignments/${id}/submit/`, {
            solution_code,
            language,
        });
        return res.json();
    },
};

// ─── Badge APIs ───────────────────────────────────────────────────────────────
export const badgeAPI = {
    getAll: async () => {
        const res = await api.get("/badges/");
        return res.json();
    },

    getMine: async () => {
        const res = await api.get("/badges/mine/");
        return res.json();
    },
};

// ─── Streak APIs ──────────────────────────────────────────────────────────────
export const streakAPI = {
    getToday: async () => {
        const res = await api.get("/streak/today/");
        return res.json();
    },

    markSolved: async () => {
        const res = await api.post("/streak/solve/", {});
        return res.json();
    },

    getStatus: async () => {
        const res = await api.get("/streak/status/");
        return res.json();
    },
};

// ─── Performance & Profile Analytics ──────────────────────────────────────────
export const performanceAPI = {
    getStats: async () => {
        const res = await api.get("/performance/stats/");
        return res.json();
    },
};

// ─── Internship APIs ──────────────────────────────────────────────────────────
export const internshipAPI = {
    getAll: async () => {
        const res = await api.get("/internships/");
        return res.json();
    },

    getRecommended: async () => {
        const res = await api.get("/internships/recommended/");
        return res.json();
    },
};
