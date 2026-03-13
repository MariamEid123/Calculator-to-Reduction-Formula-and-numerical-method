// UI Elements
const formulaCards = document.querySelectorAll('.formula-card');
const inputsContainer = document.getElementById('inputs-container');
const selectedFormulaTitle = document.getElementById('selected-formula-title');
const resultValue = document.getElementById('result-value');
let currentChoice = 1;

// Configuration for each formula's inputs
const formulaConfigs = {
    1: {
        title: "Wallis Formula",
        inputs: [{ id: "n", label: "Enter Power (n):", type: "number", min: 0, required: true }]
    },
    2: {
        title: "Integral of tanⁿ(x)",
        inputs: [
            { id: "n", label: "Enter Power (n):", type: "number", min: 0, required: true },
            { id: "a", label: "Lower limit (a) in degrees:", type: "number", step: "any", required: true },
            { id: "b", label: "Upper limit (b) in degrees:", type: "number", step: "any", required: true }
        ]
    },
    3: {
        title: "Integral of secⁿ(x)",
        inputs: [
            { id: "n", label: "Enter Power (n):", type: "number", min: 0, required: true },
            { id: "a", label: "Lower limit (a) in degrees:", type: "number", step: "any", required: true },
            { id: "b", label: "Upper limit (b) in degrees:", type: "number", step: "any", required: true }
        ]
    },
    4: {
        title: "Integral of xⁿ · sin(x)",
        inputs: [
            { id: "n", label: "Enter Power (n):", type: "number", min: 0, required: true },
            { id: "a", label: "Lower limit (a) in degrees:", type: "number", step: "any", required: true },
            { id: "b", label: "Upper limit (b) in degrees:", type: "number", step: "any", required: true }
        ]
    },
    5: {
        title: "Integral of xⁿ · cos(x)",
        inputs: [
            { id: "n", label: "Enter Power (n):", type: "number", min: 0, required: true },
            { id: "a", label: "Lower limit (a) in degrees:", type: "number", step: "any", required: true },
            { id: "b", label: "Upper limit (b) in degrees:", type: "number", step: "any", required: true }
        ]
    },
    6: {
        title: "Integral of xᵐ · cos(nx)",
        inputs: [
            { id: "n", label: "Power of x (m):", type: "number", min: 0, required: true },
            { id: "innerN", label: "Coefficient inside cos (n):", type: "number", required: true },
            { id: "a", label: "Lower limit (a) in degrees:", type: "number", step: "any", required: true },
            { id: "b", label: "Upper limit (b) in degrees:", type: "number", step: "any", required: true }
        ]
    },
    7: {
        title: "Integral of sinⁿ(x) · cosᵐ(x)",
        inputs: [
            { id: "n", label: "Power for sin (n):", type: "number", min: 0, required: true },
            { id: "mPower", label: "Power for cos (m):", type: "number", min: 0, required: true },
            { id: "a", label: "Lower limit (a) in degrees:", type: "number", step: "any", required: true },
            { id: "b", label: "Upper limit (b) in degrees:", type: "number", step: "any", required: true }
        ]
    },
    8: {
        title: "Integral of xⁿ · e^(mx)",
        inputs: [
            { id: "n", label: "Enter Power (n):", type: "number", min: 0, required: true },
            { id: "mVal", label: "Coefficient of x (m):", type: "number", step: "any", required: true },
            { id: "a", label: "Lower limit (a):", type: "number", step: "any", required: true },
            { id: "b", label: "Upper limit (b):", type: "number", step: "any", required: true }
        ]
    }
};

// Render inputs dynamically based on selected formula
function renderInputs(choice) {
    const config = formulaConfigs[choice];
    selectedFormulaTitle.textContent = config.title;

    // Clear current inputs
    inputsContainer.innerHTML = '';

    // Inject new inputs
    config.inputs.forEach(input => {
        const group = document.createElement('div');
        group.className = 'input-group';

        const label = document.createElement('label');
        label.setAttribute('for', input.id);
        label.textContent = input.label;

        const inputField = document.createElement('input');
        inputField.type = input.type;
        inputField.id = input.id;
        if (input.min !== undefined) inputField.min = input.min;
        if (input.step) inputField.step = input.step;
        if (input.required) inputField.required = true;

        group.appendChild(label);
        group.appendChild(inputField);
        inputsContainer.appendChild(group);
    });
}

// Event Listeners for Formula Selection
formulaCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove active class from all
        formulaCards.forEach(c => c.classList.remove('active'));
        // Add active class to clicked
        card.classList.add('active');
        // Update choice and render
        currentChoice = parseInt(card.getAttribute('data-formula'));
        renderInputs(currentChoice);
        // Reset result display
        resultValue.textContent = "0.00000";
    });
});

// Initial Render
renderInputs(currentChoice);

// Format output gracefully
function animateValue(obj, start, end, duration) {
    // If output is NaN or Infinite, just show it
    if (isNaN(end) || !isFinite(end)) {
        obj.innerHTML = end;
        return;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = (progress * (end - start) + start).toFixed(5);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

let steps = [];
let currentLimitName = "";

// Main Calculate Function
window.calculate = function () {
    let result = 0;

    // Reset steps
    steps = [];
    currentLimitName = "";
    document.getElementById('steps-container').style.display = 'none';
    const toggleBtn = document.getElementById('toggle-steps-btn');
    if (toggleBtn) {
        toggleBtn.style.display = 'none';
        toggleBtn.textContent = 'View Step-by-Step Details';
    }

    try {
        const getValue = (id) => parseFloat(document.getElementById(id).value);

        switch (currentChoice) {
            case 1: {
                let n = parseInt(document.getElementById('n').value);
                currentLimitName = "Calculation";
                result = wallisFormula(n);
                break;
            }
            case 2:
            case 3:
            case 4:
            case 5: {
                let n = parseInt(document.getElementById('n').value);
                let a = (getValue('a') * Math.PI) / 180; // toRadians
                let b = (getValue('b') * Math.PI) / 180; // toRadians

                let resB = 0, resA = 0;

                currentLimitName = "Upper Limit (b)";
                if (currentChoice === 2) resB = tanReduction(n, b);
                else if (currentChoice === 3) resB = secReduction(n, b);
                else if (currentChoice === 4) resB = xnSinX(n, b);
                else if (currentChoice === 5) resB = xnCosX(n, b);

                currentLimitName = "Lower Limit (a)";
                if (currentChoice === 2) resA = tanReduction(n, a);
                else if (currentChoice === 3) resA = secReduction(n, a);
                else if (currentChoice === 4) resA = xnSinX(n, a);
                else if (currentChoice === 5) resA = xnCosX(n, a);

                result = resB - resA;
                break;
            }
            case 6: {
                let n = parseInt(document.getElementById('n').value); // m in Java
                let innerN = parseInt(document.getElementById('innerN').value); // n in Java
                let a = (getValue('a') * Math.PI) / 180;
                let b = (getValue('b') * Math.PI) / 180;

                currentLimitName = "Upper Limit (b)";
                let resB = xmCosNX(n, innerN, b);

                currentLimitName = "Lower Limit (a)";
                let resA = xmCosNX(n, innerN, a);

                result = resB - resA;
                break;
            }
            case 7: {
                let n = parseInt(document.getElementById('n').value); // sin power
                let mPower = parseInt(document.getElementById('mPower').value); // cos power
                let a = (getValue('a') * Math.PI) / 180;
                let b = (getValue('b') * Math.PI) / 180;

                currentLimitName = "Upper Limit (b)";
                let resB = sinNCosM(n, mPower, b);

                currentLimitName = "Lower Limit (a)";
                let resA = sinNCosM(n, mPower, a);

                result = resB - resA;
                break;
            }
            case 8: {
                let n = parseInt(document.getElementById('n').value);
                let mVal = getValue('mVal');
                let a = getValue('a');
                let b = getValue('b');

                currentLimitName = "Upper Limit (b)";
                let resB = xnExpMX(n, mVal, b);

                currentLimitName = "Lower Limit (a)";
                let resA = xnExpMX(n, mVal, a);

                result = resB - resA;
                break;
            }
        }

        animateValue(resultValue, 0, result, 800);

        if (steps.length > 0 && toggleBtn) {
            toggleBtn.style.display = 'inline-block';
            renderSteps();
        }

    } catch (e) {
        console.error("Calculation Error:", e);
        resultValue.textContent = "Error";
    }
};

// Render collected steps using KaTeX
function renderSteps() {
    const timeline = document.getElementById('steps-timeline');
    if (!timeline) return;
    timeline.innerHTML = '';

    // Group steps by limitName
    let grouped = {};
    steps.forEach(s => {
        if (!grouped[s.limitName]) grouped[s.limitName] = [];
        grouped[s.limitName].push(s);
    });

    for (const [limit, limitSteps] of Object.entries(grouped)) {
        if (limit && limit !== "Calculation") {
            const limitHeader = document.createElement('h4');
            limitHeader.textContent = `Evaluating: ${limit}`;
            limitHeader.className = 'limit-header';
            timeline.appendChild(limitHeader);
        }

        limitSteps.forEach((step, index) => {
            const stepEl = document.createElement('div');
            stepEl.className = 'step-item';

            let resStr = typeof step.result === 'number' ? step.result.toFixed(6) : "Error";

            stepEl.innerHTML = `
                <div class="step-indicator">${index + 1}</div>
                <div class="step-content">
                    <div class="step-n">For <strong>${step.nLabel || 'n'} = ${step.n}</strong>:</div>
                    <div class="step-formula"></div>
                    <div class="step-result">↳ Result ≈ <span>${resStr}</span></div>
                </div>
            `;
            timeline.appendChild(stepEl);

            try {
                if (window.katex) {
                    katex.render(step.formula, stepEl.querySelector('.step-formula'), { displayMode: true, throwOnError: false });
                } else {
                    stepEl.querySelector('.step-formula').textContent = step.formula;
                }
            } catch (e) {
                stepEl.querySelector('.step-formula').textContent = step.formula;
            }
        });
    }
}

// Ensure toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-steps-btn');
    const stepsContainer = document.getElementById('steps-container');

    if (toggleBtn && stepsContainer) {
        toggleBtn.addEventListener('click', () => {
            if (stepsContainer.style.display === 'none') {
                stepsContainer.style.display = 'block';
                toggleBtn.textContent = 'Hide Step-by-Step Details';
                // Scroll to steps smoothly
                stepsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                stepsContainer.style.display = 'none';
                toggleBtn.textContent = 'View Step-by-Step Details';
            }
        });
    }
});

// --- Implementation of Formulas (Antiderivatives recursively converted from Java & Tracked) ---

function wallisFormula(n) {
    let res;
    if (n <= 0) {
        res = Math.PI / 2;
        steps.push({ limitName: currentLimitName, n: n, formula: `I_0 = \\frac{\\pi}{2}`, result: res });
        return res;
    }
    if (n === 1) {
        res = 1.0;
        steps.push({ limitName: currentLimitName, n: n, formula: `I_1 = 1`, result: res });
        return res;
    }
    let stepObj = { limitName: currentLimitName, n: n, formula: `I_{${n}} = \\frac{${n - 1}}{${n}} I_{${n - 2}}`, result: "..." };
    steps.push(stepObj);

    res = ((n - 1) / n) * wallisFormula(n - 2);
    stepObj.result = res;
    return res;
}

function tanReduction(n, x) {
    let res;
    if (n <= 0) {
        res = x;
        steps.push({ limitName: currentLimitName, n: n, formula: `I_0 = x`, result: res });
        return res;
    }
    if (n === 1) {
        res = Math.log(Math.abs(1 / Math.cos(x)));
        steps.push({ limitName: currentLimitName, n: n, formula: `I_1 = \\ln|\\sec(x)|`, result: res });
        return res;
    }
    let stepObj = { limitName: currentLimitName, n: n, formula: `I_{${n}} = \\frac{\\tan^{${n - 1}}(x)}{${n - 1}} - I_{${n - 2}}`, result: "..." };
    steps.push(stepObj);

    res = (Math.pow(Math.tan(x), n - 1) / (n - 1)) - tanReduction(n - 2, x);
    stepObj.result = res;
    return res;
}

function secReduction(n, x) {
    let res;
    if (n <= 0) {
        res = x;
        steps.push({ limitName: currentLimitName, n: n, formula: `I_0 = x`, result: res });
        return res;
    }
    if (n === 1) {
        res = Math.log(Math.abs((1 / Math.cos(x)) + Math.tan(x)));
        steps.push({ limitName: currentLimitName, n: n, formula: `I_1 = \\ln|\\sec(x) + \\tan(x)|`, result: res });
        return res;
    }
    let stepObj = { limitName: currentLimitName, n: n, formula: `I_{${n}} = \\frac{\\sec^{${n - 2}}(x) \\tan(x)}{${n - 1}} + \\frac{${n - 2}}{${n - 1}} I_{${n - 2}}`, result: "..." };
    steps.push(stepObj);

    let secX = 1.0 / Math.cos(x);
    let term1 = (Math.pow(secX, n - 2) * Math.tan(x)) / (n - 1);
    res = term1 + ((n - 2) / (n - 1)) * secReduction(n - 2, x);

    stepObj.result = res;
    return res;
}

function xnSinX(n, x) {
    let res;
    if (n <= 0) {
        res = -Math.cos(x);
        steps.push({ limitName: currentLimitName, n: n, formula: `I_0 = -\\cos(x)`, result: res });
        return res;
    }
    if (n === 1) {
        res = Math.sin(x) - x * Math.cos(x);
        steps.push({ limitName: currentLimitName, n: n, formula: `I_1 = \\sin(x) - x\\cos(x)`, result: res });
        return res;
    }
    let stepObj = { limitName: currentLimitName, n: n, formula: `I_{${n}} = -x^{${n}}\\cos(x) + ${n}x^{${n - 1}}\\sin(x) - ${n}(${n - 1}) I_{${n - 2}}`, result: "..." };
    steps.push(stepObj);

    res = -Math.pow(x, n) * Math.cos(x) + n * Math.pow(x, n - 1) * Math.sin(x) - (n * (n - 1) * xnSinX(n - 2, x));
    stepObj.result = res;
    return res;
}

function xnCosX(n, x) {
    let res;
    if (n <= 0) {
        res = Math.sin(x);
        steps.push({ limitName: currentLimitName, n: n, formula: `I_0 = \\sin(x)`, result: res });
        return res;
    }
    if (n === 1) {
        res = Math.cos(x) + x * Math.sin(x);
        steps.push({ limitName: currentLimitName, n: n, formula: `I_1 = \\cos(x) + x\\sin(x)`, result: res });
        return res;
    }
    let stepObj = { limitName: currentLimitName, n: n, formula: `I_{${n}} = x^{${n}}\\sin(x) + ${n}x^{${n - 1}}\\cos(x) - ${n}(${n - 1}) I_{${n - 2}}`, result: "..." };
    steps.push(stepObj);

    res = Math.pow(x, n) * Math.sin(x) + n * Math.pow(x, n - 1) * Math.cos(x) - (n * (n - 1) * xnCosX(n - 2, x));
    stepObj.result = res;
    return res;
}

function xmCosNX(m, n, x) {
    let res;
    if (m <= 0) {
        res = Math.sin(n * x) / n;
        steps.push({ limitName: currentLimitName, n: m, nLabel: 'm', formula: `I_{0} = \\frac{\\sin(${n}x)}{${n}}`, result: res });
        return res;
    }
    let stepObj = { limitName: currentLimitName, n: m, nLabel: 'm', formula: `I_{${m}} = \\frac{x^{${m}}\\sin(${n}x)}{${n}} + \\frac{${m}x^{${m - 1}}\\cos(${n}x)}{${n}^2} - \\frac{${m}(${m - 1})}{${n}^2} I_{${m - 2}}`, result: "..." };
    steps.push(stepObj);

    let term1 = (Math.pow(x, m) * Math.sin(n * x)) / n;
    let term2 = (m * Math.pow(x, m - 1) * Math.cos(n * x)) / (n * n);
    res = term1 + term2 - ((m * (m - 1)) / (n * n)) * xmCosNX(m - 2, n, x);

    stepObj.result = res;
    return res;
}

function sinNCosM(n, m, x) {
    let res;
    if (n <= 0) {
        let oldName = currentLimitName;
        currentLimitName = currentLimitName ? currentLimitName + " → Base Wallis" : "Base Wallis";
        res = wallisFormula(m);
        currentLimitName = oldName;
        // The Wallis base case steps are unshifted internally by wallisFormula
        steps.push({ limitName: currentLimitName, n: n, nLabel: 'n,m', formula: `I_{0,${m}} = \\text{Wallis}(${m})`, result: res });
        return res;
    }
    if (n === 1) {
        res = -Math.pow(Math.cos(x), m + 1) / (m + 1);
        steps.push({ limitName: currentLimitName, n: n, nLabel: 'n,m', formula: `I_{1,${m}} = -\\frac{\\cos^{${m + 1}}(x)}{${m + 1}}`, result: res });
        return res;
    }
    let stepObj = { limitName: currentLimitName, n: n, nLabel: 'n,m', formula: `I_{${n},${m}} = \\frac{\\sin^{${n - 1}}(x)\\cos^{${m + 1}}(x)}{${n}+${m}} + \\frac{${n}-1}{${n}+${m}} I_{${n - 2},${m}}`, result: "..." };
    steps.push(stepObj);

    let term1 = (Math.pow(Math.sin(x), n - 1) * Math.pow(Math.cos(x), m + 1)) / (n + m);
    res = term1 + ((n - 1) / (n + m)) * sinNCosM(n - 2, m, x);

    stepObj.result = res;
    return res;
}

function xnExpMX(n, m, x) {
    let res;
    if (n === 0) {
        res = Math.exp(m * x) / m;
        steps.push({ limitName: currentLimitName, n: n, formula: `I_0 = \\frac{e^{${m}x}}{${m}}`, result: res });
        return res;
    }
    let stepObj = { limitName: currentLimitName, n: n, formula: `I_{${n}} = \\frac{x^{${n}} e^{${m}x}}{${m}} - \\frac{${n}}{${m}} I_{${n - 1}}`, result: "..." };
    steps.push(stepObj);

    let term1 = (Math.pow(x, n) * Math.exp(m * x)) / m;
    res = term1 - (n / m) * xnExpMX(n - 1, m, x);

    stepObj.result = res;
    return res;
}

function xnExpNegX2(n, x) {
    let res;
    if (n === 1) {
        res = Math.exp(-Math.pow(x, 2)) / -2.0;
        steps.push({ limitName: currentLimitName, n: n, formula: `I_1 = \\frac{e^{-x^2}}{-2}`, result: res });
        return res;
    }
    let stepObj = { limitName: currentLimitName, n: n, formula: `I_{${n}} = \\frac{x^{${n - 1}} e^{-x^2}}{-2} + \\frac{${n - 1}}{2} I_{${n - 2}}`, result: "..." };
    steps.push(stepObj);

    let term1 = (Math.pow(x, n - 1) * Math.exp(-Math.pow(x, 2))) / -2.0;
    let factor = (n - 1) / 2.0;

    res = term1 + (factor * xnExpNegX2(n - 2, x));
    stepObj.result = res;
    return res;
}
