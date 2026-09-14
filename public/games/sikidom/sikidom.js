const mainMenu = document.getElementById("main-menu");
const shapeMenu = document.getElementById("shape-menu");
const calculator = document.getElementById("calculator");

const categoryTitle = document.getElementById("category-title");
const shapeGrid = document.getElementById("shape-grid");

const backButton = document.getElementById("back-button");
const calculatorBack = document.getElementById("calculator-back");
const homeButton = document.getElementById("home-button");

const inputContainer = document.getElementById("input-container");

const selectedIcon = document.getElementById("selected-icon");
const selectedTitle = document.getElementById("selected-title");
const selectedDescription = document.getElementById("selected-description");

const hiddenShape = document.getElementById("sikidom");

const form = document.getElementById("calculator-form");

const result = document.getElementById("result");
const error = document.getElementById("error");


const categories = {

    triangles: {
        title: "Háromszögek",

        shapes: [
            [
                "szabalyos_haromszog",
                "△",
                "Szabályos háromszög",
                "Minden oldala egyenlő."
            ],
            [
                "egyenlo_szarus_haromszog",
                "△",
                "Egyenlő szárú háromszög",
                "Két oldala egyenlő."
            ],
            [
                "derekszogu_haromszog",
                "△",
                "Derékszögű háromszög",
                "Egy 90°-os szöggel rendelkezik."
            ],
            [
                "altalanos_haromszog",
                "△",
                "Általános háromszög",
                "Három tetszőleges oldal."
            ]
        ]
    },

    quadrilaterals: {
        title: "Négyszögek",

        shapes: [
            [
                "negyzet",
                "□",
                "Négyzet",
                "Négy egyenlő oldal és négy derékszög."
            ],
            [
                "teglalap",
                "▭",
                "Téglalap",
                "Szemközti oldalai egyenlőek."
            ],
            [
                "rombusz",
                "◇",
                "Rombusz",
                "Négy egyenlő oldal."
            ],
            [
                "paralelogramma",
                "▱",
                "Paralelogramma",
                "Szemközti oldalai párhuzamosak."
            ],
            [
                "deltoid",
                "◇",
                "Deltoid",
                "Két-két szomszédos oldala egyenlő."
            ],
            [
                "trapez",
                "▱",
                "Trapéz",
                "Legalább egy párhuzamos oldalpárral rendelkezik."
            ],
            [
                "altalanos_negyszog",
                "◇",
                "Általános négyszög",
                "Tetszőleges négyszög."
            ]
        ]
    },

    polygons: {
        title: "Szabályos sokszögek",

        shapes: [
            [
                "szabalyos_otszog",
                "⬠",
                "Szabályos ötszög",
                "5 egyenlő oldal."
            ],
            [
                "szabalyos_hatszog",
                "⬡",
                "Szabályos hatszög",
                "6 egyenlő oldal."
            ],
            [
                "szabalyos_nyolcszog",
                '<img src="icons/octagon-outline-shape.svg" alt="Nyolcszög">',
                "Szabályos nyolcszög",
                "8 egyenlő oldal."
            ],
            [
                "szabalyos_tizszog",
                "◇",
                "Szabályos tízszög",
                "10 egyenlő oldal."
            ],
            [
                "szabalyos_tizenketszog",
                "◇",
                "Szabályos tizenkétszög",
                "12 egyenlő oldal."
            ]
        ]
    },

    curved: {
        title: "Görbe vonallal határolt síkidomok",

        shapes: [
            [
                "kor",
                "○",
                "Kör",
                "Középponttól azonos távolságra lévő pontok halmaza."
            ],
            [
                "ellipszis",
                "⬭",
                "Ellipszis",
                "Megnyújtott kör, két féltengellyel."
            ],
            [
                "korcikk",
                "◔",
                "Körcikk",
                "A kör két sugár és egy körív által határolt része."
            ],
            [
                "korszelet",
                "◓",
                "Körszelet",
                "Egy húr és egy körív által határolt rész."
            ],
            [
                "koriv",
                "⌒",
                "Körív",
                "A kör kerületének egy része."
            ]
        ]
    }

};


const mezok = {

    szabalyos_haromszog: [
        ["a", "Oldal", "Pl. 10"]
    ],

    egyenlo_szarus_haromszog: [
        ["alap", "Alap", "Pl. 10"],
        ["szar", "Szár", "Pl. 7"]
    ],

    derekszogu_haromszog: [
        ["a", "Első befogó", "Pl. 3"],
        ["b", "Második befogó", "Pl. 4"]
    ],

    altalanos_haromszog: [
        ["a", "1. oldal", "Pl. 5"],
        ["b", "2. oldal", "Pl. 6"],
        ["c", "3. oldal", "Pl. 7"]
    ],

    negyzet: [
        ["a", "Oldal", "Pl. 10"]
    ],

    teglalap: [
        ["a", "1. oldal", "Pl. 10"],
        ["b", "2. oldal", "Pl. 5"]
    ],

    rombusz: [
        ["d1", "1. átló", "Pl. 8"],
        ["d2", "2. átló", "Pl. 6"]
    ],

    paralelogramma: [
        ["a", "Alap", "Pl. 10"],
        ["m", "Magasság", "Pl. 5"]
    ],

    deltoid: [
        ["d1", "1. átló", "Pl. 8"],
        ["d2", "2. átló", "Pl. 6"]
    ],

    trapez: [
        ["a", "1. alap", "Pl. 10"],
        ["b", "2. alap", "Pl. 6"],
        ["m", "Magasság", "Pl. 4"]
    ],

    altalanos_negyszog: [
        ["d1", "1. átló", "Pl. 8"],
        ["d2", "2. átló", "Pl. 6"],
        ["szog", "Átlók közötti szög (°)", "Pl. 90"]
    ],

    szabalyos_otszog: [
        ["a", "Oldal", "Pl. 10"]
    ],

    szabalyos_hatszog: [
        ["a", "Oldal", "Pl. 10"]
    ],

    szabalyos_nyolcszog: [
        ["a", "Oldal", "Pl. 10"]
    ],

    szabalyos_tizszog: [
        ["a", "Oldal", "Pl. 10"]
    ],

    szabalyos_tizenketszog: [
        ["a", "Oldal", "Pl. 10"]
    ],

    kor: [
        ["r", "Sugár", "Pl. 5"]
    ],

    ellipszis: [
        ["a", "Nagytengely fele", "Pl. 8"],
        ["b", "Kistengely fele", "Pl. 5"]
    ],

    korcikk: [
        ["r", "Sugár", "Pl. 5"],
        ["szog", "Középponti szög (°)", "Pl. 90"]
    ],

    korszelet: [
        ["r", "Sugár", "Pl. 5"],
        ["szog", "Középponti szög (°)", "Pl. 90"]
    ],

    koriv: [
        ["r", "Sugár", "Pl. 5"],
        ["szog", "Középponti szög (°)", "Pl. 90"]
    ]

};


const formulas = {

    szabalyos_haromszog(data) {
        const a = positive(data.a, "oldal");

        return Math.sqrt(3) / 4 * a ** 2;
    },

    egyenlo_szarus_haromszog(data) {
        const alap = positive(data.alap, "alap");
        const szar = positive(data.szar, "szár");

        const h2 = szar ** 2 - (alap / 2) ** 2;

        if (h2 <= 0) {
            throw new Error(
                "A megadott adatokból nem szerkeszthető egyenlő szárú háromszög."
            );
        }

        return alap * Math.sqrt(h2) / 2;
    },

    derekszogu_haromszog(data) {
        const a = positive(data.a, "első befogó");
        const b = positive(data.b, "második befogó");

        return a * b / 2;
    },

    altalanos_haromszog(data) {
        const a = positive(data.a, "első oldal");
        const b = positive(data.b, "második oldal");
        const c = positive(data.c, "harmadik oldal");

        if (
            a + b <= c ||
            a + c <= b ||
            b + c <= a
        ) {
            throw new Error(
                "A három oldalból nem szerkeszthető háromszög."
            );
        }

        const s = (a + b + c) / 2;

        return Math.sqrt(
            s *
            (s - a) *
            (s - b) *
            (s - c)
        );
    },

    negyzet(data) {
        const a = positive(data.a, "oldal");

        return a ** 2;
    },

    teglalap(data) {
        const a = positive(data.a, "első oldal");
        const b = positive(data.b, "második oldal");

        return a * b;
    },

    rombusz(data) {
        const d1 = positive(data.d1, "első átló");
        const d2 = positive(data.d2, "második átló");

        return d1 * d2 / 2;
    },

    paralelogramma(data) {
        const a = positive(data.a, "alap");
        const m = positive(data.m, "magasság");

        return a * m;
    },

    deltoid(data) {
        const d1 = positive(data.d1, "első átló");
        const d2 = positive(data.d2, "második átló");

        return d1 * d2 / 2;
    },

    trapez(data) {
        const a = positive(data.a, "első alap");
        const b = positive(data.b, "második alap");
        const m = positive(data.m, "magasság");

        return (a + b) * m / 2;
    },

    altalanos_negyszog(data) {
        const d1 = positive(data.d1, "első átló");
        const d2 = positive(data.d2, "második átló");
        const szog = positive(data.szog, "átlók közötti szög");

        if (szog >= 180) {
            throw new Error(
                "Az átlók közötti szögnek 0° és 180° között kell lennie."
            );
        }

        return d1 * d2 * Math.sin(
            szog * Math.PI / 180
        ) / 2;
    },

    szabalyos_otszog(data) {
        return regularPolygonArea(
            5,
            positive(data.a, "oldal")
        );
    },

    szabalyos_hatszog(data) {
        return regularPolygonArea(
            6,
            positive(data.a, "oldal")
        );
    },

    szabalyos_nyolcszog(data) {
        return regularPolygonArea(
            8,
            positive(data.a, "oldal")
        );
    },

    szabalyos_tizszog(data) {
        return regularPolygonArea(
            10,
            positive(data.a, "oldal")
        );
    },

    szabalyos_tizenketszog(data) {
        return regularPolygonArea(
            12,
            positive(data.a, "oldal")
        );
    },

    kor(data) {
        const r = positive(data.r, "sugár");

        return Math.PI * r ** 2;
    },

    ellipszis(data) {
        const a = positive(data.a, "nagytengely fele");
        const b = positive(data.b, "kistengely fele");

        return Math.PI * a * b;
    },

    korcikk(data) {
        const r = positive(data.r, "sugár");
        const szog = positive(data.szog, "középponti szög");

        if (szog > 360) {
            throw new Error(
                "A középponti szög legfeljebb 360° lehet."
            );
        }

        return Math.PI * r ** 2 * szog / 360;
    },

    korszelet(data) {
        const r = positive(data.r, "sugár");
        const szog = positive(data.szog, "középponti szög");

        if (szog >= 360) {
            throw new Error(
                "A körszelet középponti szögének 360° alatt kell lennie."
            );
        }

        const theta = szog * Math.PI / 180;

        return (
            r ** 2 / 2
        ) * (
                theta - Math.sin(theta)
            );
    },

    koriv(data) {
        const r = positive(data.r, "sugár");
        const szog = positive(data.szog, "középponti szög");

        if (szog > 360) {
            throw new Error(
                "A középponti szög legfeljebb 360° lehet."
            );
        }

        return 2 * Math.PI * r * szog / 360;
    }

};


function positive(value, name) {

    if (
        value === "" ||
        value === null ||
        value === undefined
    ) {
        throw new Error(
            `A(z) ${name} megadása kötelező.`
        );
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        throw new Error(
            `A(z) ${name} értékének számnak kell lennie.`
        );
    }

    if (number <= 0) {
        throw new Error(
            `A(z) ${name} nem lehet 0 vagy negatív.`
        );
    }

    return number;
}


function regularPolygonArea(n, a) {

    return (
        n * a ** 2
    ) / (
            4 * Math.tan(Math.PI / n)
        );

}


function showCategory(categoryKey) {

    const category = categories[categoryKey];

    if (!category) {
        return;
    }

    categoryTitle.textContent = category.title;

    shapeGrid.innerHTML = "";

    category.shapes.forEach(shape => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "shape-card";

        button.innerHTML = `
            <div class="shape-icon">
                ${shape[1]}
            </div>

            <div class="shape-name">
                ${shape[2]}
            </div>

            <div class="shape-description">
                ${shape[3]}
            </div>
        `;

        button.addEventListener("click", () => {
            showCalculator(shape);
        });

        shapeGrid.appendChild(button);

    });

    mainMenu.classList.add("hidden");
    calculator.classList.add("hidden");
    shapeMenu.classList.remove("hidden");

    clearMessages();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function showCalculator(shape) {

    const id = shape[0];

    selectedIcon.innerHTML = shape[1];

    selectedTitle.textContent = shape[2];

    selectedDescription.textContent = shape[3];

    hiddenShape.value = id;

    inputContainer.innerHTML = "";

    const fields = mezok[id];

    if (!fields) {
        return;
    }

    fields.forEach(field => {

        const [name, labelText, placeholder] = field;

        const group = document.createElement("div");

        group.className = "form-group";

        const label = document.createElement("label");

        label.htmlFor = name;
        label.textContent = labelText;

        const input = document.createElement("input");

        input.type = "number";
        input.id = name;
        input.name = name;
        input.step = "any";
        input.min = "0";
        input.placeholder = placeholder;
        input.required = true;

        group.appendChild(label);
        group.appendChild(input);

        inputContainer.appendChild(group);

    });

    shapeMenu.classList.add("hidden");
    mainMenu.classList.add("hidden");
    calculator.classList.remove("hidden");

    clearMessages();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function clearMessages() {

    result.classList.add("hidden");
    error.classList.add("hidden");

    result.innerHTML = "";
    error.textContent = "";

}


document.querySelectorAll(".category-card").forEach(button => {

    button.addEventListener("click", () => {

        showCategory(
            button.dataset.category
        );

    });

});


backButton.addEventListener("click", () => {

    shapeMenu.classList.add("hidden");
    calculator.classList.add("hidden");

    mainMenu.classList.remove("hidden");

    clearMessages();

});


calculatorBack.addEventListener("click", () => {

    calculator.classList.add("hidden");

    shapeMenu.classList.remove("hidden");

    clearMessages();

});


homeButton.addEventListener("click", () => {

    window.location.href = "../../index.html";

});


form.addEventListener("submit", event => {

    event.preventDefault();

    clearMessages();

    const shape = hiddenShape.value;

    if (!shape || !formulas[shape]) {

        error.textContent =
            "Válassz ki egy érvényes síkidomot.";

        error.classList.remove("hidden");

        return;
    }

    const formData = new FormData(form);

    const data = Object.fromEntries(
        formData.entries()
    );

    try {

        const value = formulas[shape](data);

        const unit =
            document.getElementById("mertekegyseg").value;

        if (shape === "koriv") {

            result.innerHTML = `
                ${formatNumber(value)} mm

                <small>
                    A körív hossza lineáris mértékegységben értendő.
                </small>
            `;

        } else {

            result.innerHTML = `
                ${formatNumber(value)} ${unit}
            `;

        }

        result.classList.remove("hidden");

        result.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    } catch (err) {

        error.textContent =
            err instanceof Error
                ? err.message
                : "Hiba történt a számítás során.";

        error.classList.remove("hidden");

    }

});


function formatNumber(number) {

    if (!Number.isFinite(number)) {
        return "Hiba";
    }

    return Number(
        number.toPrecision(12)
    ).toLocaleString("hu-HU");

}