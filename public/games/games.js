const state = {
    csrfToken: null,
    user: null,
    statistics: null,
    gameTheme: localStorage.getItem("gameModeTheme") || "dark",
    gameLanguage: localStorage.getItem("gameModeLanguage") || "hu",
    gameSound: localStorage.getItem("gameModeSound") !== "off",
    siteTheme: localStorage.getItem("siteTheme") || "pink-brown",
    siteLanguage: localStorage.getItem("siteLanguage") || "hu"
};

const loadingScreen = document.getElementById("loading-screen");
const authScreen = document.getElementById("auth-screen");
const portalScreen = document.getElementById("portal-screen");
const gameModeScreen = document.getElementById("game-mode-screen");

const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const loginError = document.getElementById("login-error");
const registerError = document.getElementById("register-error");

const gameMenu = document.getElementById("game-menu");
const gamesPanel = document.getElementById("games-panel");
const profilePanel = document.getElementById("profile-panel");
const settingsPanel = document.getElementById("settings-panel");

function showOnly(element) {
    [loadingScreen, authScreen, portalScreen, gameModeScreen].forEach(screen => {
        screen.classList.add("hidden");
    });

    element.classList.remove("hidden");
}

function showAuthMode(mode) {
    const login = mode === "login";

    loginTab.classList.toggle("active", login);
    registerTab.classList.toggle("active", !login);
    loginForm.classList.toggle("hidden", !login);
    registerForm.classList.toggle("hidden", login);
    loginError.textContent = "";
    registerError.textContent = "";
}

async function loadCsrfToken() {
    const response = await fetch("/api/csrf", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
        headers: {
            Accept: "application/json"
        }
    });

    const data = await response.json();

    if (!response.ok || typeof data.csrfToken !== "string") {
        throw new Error(data.error || "CSRF token betöltése sikertelen.");
    }

    state.csrfToken = data.csrfToken;
}

async function apiRequest(url, options = {}) {
    const method = String(options.method || "GET").toUpperCase();
    const headers = new Headers(options.headers || {});

    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
        if (!state.csrfToken) {
            await loadCsrfToken();
        }

        headers.set("X-CSRF-Token", state.csrfToken);
    }

    return fetch(url, {
        ...options,
        method,
        credentials: "same-origin",
        cache: "no-store",
        headers
    });
}

async function readResponse(response) {
    const type = response.headers.get("content-type") || "";

    if (type.includes("application/json")) {
        return response.json();
    }

    return {};
}

async function loadSession() {
    const response = await fetch("/api/me", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
        headers: {
            Accept: "application/json"
        }
    });

    if (response.status === 403) {
        throw new Error("A Game Mode elérése jelenleg nem engedélyezett.");
    }

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.loggedIn) {
        state.user = null;
        state.statistics = null;
        await loadCsrfToken();
        showOnly(authScreen);
        return false;
    }

    state.user = data.user;
    state.statistics = data.statistics || null;
    state.csrfToken = data.csrfToken || state.csrfToken;

    showOnly(portalScreen);
    return true;
}

async function login(username, password) {
    loginError.textContent = "";

    if (!username.trim() || !password) {
        loginError.textContent = "Add meg a felhasználónevet és a jelszót!";
        return false;
    }

    try {
        const response = await apiRequest("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await readResponse(response);

        if (!response.ok) {
            loginError.textContent = data.error || "Hibás felhasználónév vagy jelszó!";
            return false;
        }

        state.user = data.user;
        state.csrfToken = data.csrfToken || state.csrfToken;

        await refreshProfileData();
        showOnly(portalScreen);
        return true;
    } catch (error) {
        console.error(error);
        loginError.textContent = "Nem sikerült kapcsolódni a szerverhez.";
        return false;
    }
}

async function register(
    username,
    password,
    passwordConfirm,
    privacyAccepted,
    gender
) {
    registerError.textContent = "";

    if (!username.trim() || !password || !passwordConfirm) {
        registerError.textContent = "Minden kötelező mezőt tölts ki!";
        return false;
    }

    if (password !== passwordConfirm) {
        registerError.textContent = "A két jelszó nem egyezik.";
        return false;
    }

    if (password.length < 8) {
        registerError.textContent = "A jelszónak legalább 8 karakteresnek kell lennie.";
        return false;
    }

    if (!privacyAccepted) {
        registerError.textContent = "Az adatvédelmi tájékoztató elfogadása kötelező.";
        return false;
    }

    try {
        const response = await apiRequest("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                username,
                password,
                passwordConfirm,
                gender,
                privacyAccepted
            })
        });

        const data = await readResponse(response);

        if (!response.ok) {
            registerError.textContent = data.error || "A regisztráció sikertelen.";
            return false;
        }

        state.user = data.user;
        state.csrfToken = data.csrfToken || state.csrfToken;

        await refreshProfileData();
        showOnly(portalScreen);
        return true;
    } catch (error) {
        console.error(error);
        registerError.textContent = "Nem sikerült kapcsolódni a szerverhez.";
        return false;
    }
}

async function refreshProfileData() {
    const response = await fetch("/api/me", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
        headers: {
            Accept: "application/json"
        }
    });

    if (!response.ok) {
        return;
    }

    const data = await response.json();

    if (data.loggedIn) {
        state.user = data.user;
        state.statistics = data.statistics || null;
        state.csrfToken = data.csrfToken || state.csrfToken;
    }
}

function setupHamburger(buttonId, menuId) {
    const button = document.getElementById(buttonId);
    const menu = document.getElementById(menuId);

    if (!button || !menu) {
        return;
    }

    const setOpen = open => {
        button.setAttribute("aria-expanded", String(open));
        menu.setAttribute("aria-hidden", String(!open));
        menu.classList.toggle("active", open);
    };

    button.addEventListener("click", event => {
        event.stopPropagation();
        setOpen(!menu.classList.contains("active"));
    });

    menu.querySelectorAll("a, button").forEach(item => {
        item.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("click", event => {
        if (!menu.classList.contains("active")) {
            return;
        }

        if (!menu.contains(event.target) && !button.contains(event.target)) {
            setOpen(false);
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            setOpen(false);
        }
    });
}

function openGameMode() {
    applyGameModeSettings();
    showOnly(gameModeScreen);
    showGamePanel("menu");
}

function showGamePanel(panel) {
    [gameMenu, gamesPanel, profilePanel, settingsPanel].forEach(element => {
        element.classList.add("hidden");
    });

    if (panel === "menu") {
        gameMenu.classList.remove("hidden");
    }

    if (panel === "games") {
        gamesPanel.classList.remove("hidden");
    }

    if (panel === "profile") {
        profilePanel.classList.remove("hidden");
        renderProfile();
    }

    if (panel === "settings") {
        settingsPanel.classList.remove("hidden");
        renderGameSettings();
    }
}

function renderProfile() {
    const user = state.user || {};
    const statistics = state.statistics || {};

    document.getElementById("profile-username").textContent =
        user.username || "-";

    document.getElementById("profile-joined").textContent =
        `Csatlakozott: ${formatJoined(user.joined)}`;

    document.getElementById("profile-gender").textContent =
        user.gender === "girl"
            ? "Lány"
            : user.gender === "boy"
                ? "Fiú"
                : "Nem adta meg";

    document.getElementById("rps-matches").textContent =
        statistics.gamesPlayed ?? 0;

    document.getElementById("rps-wins").textContent =
        statistics.wins ?? 0;

    document.getElementById("rps-losses").textContent =
        statistics.losses ?? 0;

    document.getElementById("rps-draws").textContent =
        statistics.draws ?? 0;

    document.getElementById("2048-matches").textContent =
        statistics.matches2048 ?? 0;

    document.getElementById("2048-score").textContent =
        statistics.maxScore2048 ?? 0;

    document.getElementById("2048-undos").textContent =
        statistics.undosUsed2048 ?? 0;
}

function formatJoined(value) {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return new Intl.DateTimeFormat(
        state.gameLanguage === "hu" ? "hu-HU" : "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    ).format(date);
}

function renderGameSettings() {
    document.querySelectorAll("[data-game-theme]").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.gameTheme === state.gameTheme
        );
    });

    document.querySelectorAll("[data-game-language]").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.gameLanguage === state.gameLanguage
        );
    });

    document.querySelectorAll("[data-game-sound]").forEach(button => {
        button.classList.toggle(
            "active",
            (button.dataset.gameSound === "on") === state.gameSound
        );
    });
}

function applyGameModeSettings() {
    gameModeScreen.classList.toggle(
        "light-mode",
        state.gameTheme === "light"
    );

    renderGameSettings();
}

function openModal(id) {
    document.getElementById(id)?.classList.remove("hidden");
}

function closeModal(id) {
    document.getElementById(id)?.classList.add("hidden");
}

function applySiteSettings() {
    document.body.dataset.siteTheme = state.siteTheme;

    document.documentElement.style.setProperty(
        "--pink-light",
        state.siteTheme === "cream-teal" ? "#fff5d5" : "#fff1f6"
    );

    document.documentElement.style.setProperty(
        "--pink-soft",
        state.siteTheme === "cream-teal" ? "#f7e8ae" : "#fce4ec"
    );

    document.documentElement.style.setProperty(
        "--pink",
        state.siteTheme === "cream-teal" ? "#c7ae66" : "#e9a9bd"
    );

    document.documentElement.style.setProperty(
        "--pink-dark",
        state.siteTheme === "cream-teal" ? "#a68d43" : "#c9859d"
    );

    document.querySelectorAll("[data-site-theme]").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.siteTheme === state.siteTheme
        );
    });

    document.querySelectorAll("[data-site-language]").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.siteLanguage === state.siteLanguage
        );
    });
}

function handleExit() {
    openModal("exit-modal");
}

function confirmExit() {
    closeModal("exit-modal");
    showOnly(portalScreen);
}

loginTab.addEventListener("click", () => showAuthMode("login"));
registerTab.addEventListener("click", () => showAuthMode("register"));

loginForm.addEventListener("submit", async event => {
    event.preventDefault();

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    await login(username, password);
});

registerForm.addEventListener("submit", async event => {
    event.preventDefault();

    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const passwordConfirm = document.getElementById("register-password-confirm").value;
    const privacyAccepted = document.getElementById("register-privacy").checked;
    const genderElement = document.querySelector('input[name="register-gender"]:checked');
    const gender = genderElement ? genderElement.value : "";

    await register(
        username,
        password,
        passwordConfirm,
        privacyAccepted,
        gender
    );
});

document.getElementById("game-mode-button").addEventListener("click", openGameMode);

document.querySelectorAll("[data-game-action]").forEach(button => {
    button.addEventListener("click", () => {
        showGamePanel(button.dataset.gameAction);
    });
});

document.querySelectorAll("[data-back]").forEach(button => {
    button.addEventListener("click", () => {
        showGamePanel(button.dataset.back);
    });
});

document.getElementById("portal-profile-button").addEventListener("click", () => {
    openGameMode();
    showGamePanel("profile");
});

document.getElementById("mobile-portal-profile").addEventListener("click", () => {
    openGameMode();
    showGamePanel("profile");
});

document.getElementById("site-settings-button").addEventListener("click", () => {
    openModal("site-settings-modal");
});

document.getElementById("mobile-site-settings").addEventListener("click", () => {
    openModal("site-settings-modal");
});

document.querySelectorAll("[data-close-modal]").forEach(button => {
    button.addEventListener("click", () => {
        closeModal(button.dataset.closeModal);
    });
});

document.getElementById("exit-game-mode").addEventListener("click", handleExit);
document.getElementById("exit-modal-close").addEventListener("click", () => closeModal("exit-modal"));
document.getElementById("exit-cancel").addEventListener("click", () => closeModal("exit-modal"));
document.getElementById("exit-confirm").addEventListener("click", confirmExit);

document.getElementById("exit-modal").addEventListener("click", event => {
    if (event.target.id === "exit-modal") {
        closeModal("exit-modal");
    }
});

document.getElementById("site-settings-modal").addEventListener("click", event => {
    if (event.target.id === "site-settings-modal") {
        closeModal("site-settings-modal");
    }
});

document.querySelectorAll("[data-game-theme]").forEach(button => {
    button.addEventListener("click", () => {
        state.gameTheme = button.dataset.gameTheme;
        localStorage.setItem("gameModeTheme", state.gameTheme);
        applyGameModeSettings();
    });
});

document.querySelectorAll("[data-game-language]").forEach(button => {
    button.addEventListener("click", () => {
        state.gameLanguage = button.dataset.gameLanguage;
        localStorage.setItem("gameModeLanguage", state.gameLanguage);
        renderGameSettings();
        renderProfile();
    });
});

document.querySelectorAll("[data-game-sound]").forEach(button => {
    button.addEventListener("click", () => {
        state.gameSound = button.dataset.gameSound === "on";
        localStorage.setItem(
            "gameModeSound",
            state.gameSound ? "on" : "off"
        );
        renderGameSettings();
    });
});

document.querySelectorAll("[data-site-theme]").forEach(button => {
    button.addEventListener("click", () => {
        state.siteTheme = button.dataset.siteTheme;
        localStorage.setItem("siteTheme", state.siteTheme);
        applySiteSettings();
    });
});

document.querySelectorAll("[data-site-language]").forEach(button => {
    button.addEventListener("click", () => {
        state.siteLanguage = button.dataset.siteLanguage;
        localStorage.setItem("siteLanguage", state.siteLanguage);
        applySiteSettings();
    });
});

setupHamburger("hamburger-btn", "mobile-menu");
setupHamburger("portal-hamburger", "portal-mobile-menu");

applySiteSettings();
applyGameModeSettings();

(async function init() {
    try {
        await loadSession();
    } catch (error) {
        console.error(error);
        showOnly(authScreen);
        await loadCsrfToken().catch(() => {});
    }
})();
