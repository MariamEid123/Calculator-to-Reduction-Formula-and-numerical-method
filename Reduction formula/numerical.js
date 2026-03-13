// Tab Switching Logic
document.addEventListener("DOMContentLoaded", () => {
    const mainTabBtns = document.querySelectorAll('.main-tab-btn');
    const mainTabContents = document.querySelectorAll('.main-tab-content');

    mainTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            mainTabBtns.forEach(b => b.classList.remove('active'));
            mainTabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const target = btn.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
        });
    });
});

// Numerical Methods State
const numMethodCards = document.querySelectorAll('.num-method-card');
const numSelectedMethodTitle = document.getElementById('num-selected-method-title');
let currentNumMethod = 'rectangular'; // 'rectangular', 'trapezoidal', 'simpson'
let chartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
    numMethodCards.forEach(card => {
        card.addEventListener('click', () => {
            numMethodCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            currentNumMethod = card.getAttribute('data-method');
            if (numSelectedMethodTitle) {
                numSelectedMethodTitle.textContent = card.querySelector('h3').textContent;
            }
            resetNumUI();
        });
    });
});

function resetNumUI() {
    document.getElementById('num-error').style.display = 'none';
    document.getElementById('num-steps-container').style.display = 'none';
    const singleDisplay = document.getElementById('num-single-result-display');
    const allDisplay = document.getElementById('num-all-result-display');
    if (singleDisplay) singleDisplay.style.display = 'block';
    if (allDisplay) allDisplay.style.display = 'none';
    
    let resVal = document.getElementById('num-result-value');
    if (resVal) resVal.textContent = "0.00000";
    
    // Reset Error fields
    if (document.getElementById('num-exact-value')) document.getElementById('num-exact-value').textContent = "0.00000";
    if (document.getElementById('num-abs-error')) document.getElementById('num-abs-error').textContent = "0.00000";
    if (document.getElementById('num-exact-value-all')) document.getElementById('num-exact-value-all').textContent = "0.00000";
    if (document.getElementById('err-all-rect')) document.getElementById('err-all-rect').textContent = "0.00000";
    if (document.getElementById('err-all-trap')) document.getElementById('err-all-trap').textContent = "0.00000";
    if (document.getElementById('err-all-simp')) document.getElementById('err-all-simp').textContent = "0.00000";
    
    let t1 = document.getElementById('num-toggle-steps-btn');
    let t2 = document.getElementById('num-toggle-steps-all-btn');
    if (t1) t1.style.display = 'none';
    if (t2) t2.style.display = 'none';
}

window.setNumExample = function() {
    document.getElementById('num-func').value = "x^2 + sin(x)";
    document.getElementById('num-a').value = 0;
    document.getElementById('num-b').value = 5;
    document.getElementById('num-n').value = 10;
}

window.clearNumInputs = function() {
    document.getElementById('num-func').value = "";
    document.getElementById('num-a').value = "";
    document.getElementById('num-b').value = "";
    document.getElementById('num-n').value = "";
    resetNumUI();
}

function evaluateFunc(funcStr, xVal) {
    try {
        return math.evaluate(funcStr, { x: xVal });
    } catch (e) {
        throw new Error("Invalid function expression: " + e.message);
    }
}

function calculateExactValue(funcStr, a, b) {
    // Simpson's rule with n=10000 for a very close approximation (Exact Value)
    const n = 10000;
    const h = (b - a) / n;
    let sumOdd = 0;
    let sumEven = 0;
    
    const f0 = evaluateFunc(funcStr, a);
    const fn = evaluateFunc(funcStr, b);
    
    for (let i = 1; i < n; i++) {
        let x = a + i * h;
        let val = evaluateFunc(funcStr, x);
        if (i % 2 !== 0) sumOdd += val;
        else sumEven += val;
    }
    
    return (h / 3) * (f0 + fn + 4 * sumOdd + 2 * sumEven);
}

window.calculateNumerical = function() {
    resetNumUI();
    const funcStr = document.getElementById('num-func').value;
    const a = parseFloat(document.getElementById('num-a').value);
    const b = parseFloat(document.getElementById('num-b').value);
    const n = parseInt(document.getElementById('num-n').value);
    const errorDiv = document.getElementById('num-error');

    try {
        if (!funcStr) throw new Error("Please enter a function.");
        if (isNaN(a) || isNaN(b) || isNaN(n)) throw new Error("Please fill all numeric fields.");
        if (n <= 0) throw new Error("Number of intervals must be positive.");
        
        // Validation for Simpson's Rule
        if (currentNumMethod === 'simpson' && n % 2 !== 0) {
            throw new Error("Simpson's rule requires an even number of intervals (n).");
        }

        // Calculate exact value (approximation)
        const exact = calculateExactValue(funcStr, a, b);

        // Calculate steps
        const result = runNumericalMethod(currentNumMethod, funcStr, a, b, n);
        
        // Calculate Absolute Error
        const absError = Math.abs(exact - result.finalResult);
        
        // Show result
        const resDisplay = document.getElementById('num-result-value');
        if (window.animateValue && typeof window.animateValue === 'function') {
            window.animateValue(resDisplay, 0, result.finalResult, 800);
        } else {
            resDisplay.textContent = result.finalResult.toFixed(5);
        }

        // Update Exact Value and Error
        document.getElementById('num-exact-value').textContent = exact.toFixed(6);
        document.getElementById('num-abs-error').textContent = absError.toFixed(6);

        // Render steps and graph
        renderNumSteps(result);
        renderNumGraph(funcStr, a, b, n, [currentNumMethod], [result]);

        document.getElementById('num-toggle-steps-btn').style.display = 'inline-block';
        
    } catch (e) {
        errorDiv.textContent = e.message;
        errorDiv.style.display = 'block';
    }
}

window.calculateAllMethods = function() {
    resetNumUI();
    
    document.getElementById('num-single-result-display').style.display = 'none';
    document.getElementById('num-all-result-display').style.display = 'block';
    
    const funcStr = document.getElementById('num-func').value;
    const a = parseFloat(document.getElementById('num-a').value);
    const b = parseFloat(document.getElementById('num-b').value);
    const n = parseInt(document.getElementById('num-n').value);
    const errorDiv = document.getElementById('num-error');

    try {
        if (!funcStr) throw new Error("Please enter a function.");
        if (isNaN(a) || isNaN(b) || isNaN(n)) throw new Error("Please fill all numeric fields.");
        if (n <= 0) throw new Error("Number of intervals must be positive.");
        if (n % 2 !== 0) throw new Error("Calculate All Methods requires 'n' to be even for Simpson's Rule to work properly.");

        // Calculate exact value (approximation)
        const exact = calculateExactValue(funcStr, a, b);

        const resRect = runNumericalMethod('rectangular', funcStr, a, b, n);
        const resTrap = runNumericalMethod('trapezoidal', funcStr, a, b, n);
        const resSimp = runNumericalMethod('simpson', funcStr, a, b, n);

        document.getElementById('res-all-rect').textContent = resRect.finalResult.toFixed(5);
        document.getElementById('res-all-trap').textContent = resTrap.finalResult.toFixed(5);
        document.getElementById('res-all-simp').textContent = resSimp.finalResult.toFixed(5);
        
        // Update Truth and Errors
        document.getElementById('num-exact-value-all').textContent = exact.toFixed(6);
        document.getElementById('err-all-rect').textContent = Math.abs(exact - resRect.finalResult).toFixed(6);
        document.getElementById('err-all-trap').textContent = Math.abs(exact - resTrap.finalResult).toFixed(6);
        document.getElementById('err-all-simp').textContent = Math.abs(exact - resSimp.finalResult).toFixed(6);

        renderNumStepsAll(resRect, resTrap, resSimp);
        renderNumGraph(funcStr, a, b, n, ['rectangular', 'trapezoidal', 'simpson'], [resRect, resTrap, resSimp]);
        
        document.getElementById('num-toggle-steps-all-btn').style.display = 'inline-block';
        
    } catch (e) {
         errorDiv.textContent = e.message;
         errorDiv.style.display = 'block';
         document.getElementById('num-all-result-display').style.display = 'none';
         document.getElementById('num-single-result-display').style.display = 'block';
    }
}

function runNumericalMethod(method, funcStr, a, b, n) {
    const h = (b - a) / n;
    let table = [];
    let mathSteps = [];
    
    // Evaluate x_i and f(x_i)
    for (let i = 0; i <= n; i++) {
        let xi = a + i * h;
        let fxi = evaluateFunc(funcStr, xi);
        table.push({ i, xi, fxi });
    }

    let finalResult = 0;
    
    // Math logic
    if (method === 'rectangular') {
        let sumStr = [];
        let sum = 0;
         for (let i = 0; i < n; i++) {
            sum += table[i].fxi;
            if(i < 5 || i > n - 2) sumStr.push(table[i].fxi.toFixed(4));
            else if (i === 5) sumStr.push("...");
         }
         finalResult = h * sum;
         
         mathSteps.push(`h = \\frac{b-a}{n} = \\frac{${b}-${a}}{${n}} = ${h.toFixed(5)}`);
         mathSteps.push(`I \\approx h \\sum_{i=0}^{n-1} f(x_i)`);
         mathSteps.push(`I \\approx ${h.toFixed(5)} \\times (${sumStr.join(" + ")})`);
         mathSteps.push(`I \\approx ${finalResult.toFixed(5)}`);
         
    } else if (method === 'trapezoidal') {
         let sumInterior = 0;
         let sumStr = [];
         for (let i = 1; i < n; i++) {
            sumInterior += table[i].fxi;
            if(i < 5 || i > n - 2) sumStr.push(table[i].fxi.toFixed(4));
            else if (i === 5) sumStr.push("...");
         }
         finalResult = (h / 2) * (table[0].fxi + table[n].fxi + 2 * sumInterior);
         
         mathSteps.push(`h = \\frac{b-a}{n} = \\frac{${b}-${a}}{${n}} = ${h.toFixed(5)}`);
         mathSteps.push(`I \\approx \\frac{h}{2}\\left[f(x_0)+f(x_n)+2\\sum_{i=1}^{n-1}f(x_i)\\right]`);
         mathSteps.push(`I \\approx \\frac{${h.toFixed(5)}}{2} \\left[${table[0].fxi.toFixed(4)} + ${table[n].fxi.toFixed(4)} + 2(${sumStr.join(" + ")})\\right]`);
         mathSteps.push(`I \\approx ${finalResult.toFixed(5)}`);
         
    } else if (method === 'simpson') {
        let sumOdd = 0, sumEven = 0;
        let strOdd = [], strEven = [];
        for (let i = 1; i < n; i++) {
            if (i % 2 !== 0) {
                sumOdd += table[i].fxi;
                if(strOdd.length < 3) strOdd.push(table[i].fxi.toFixed(4));
            } else {
                sumEven += table[i].fxi;
                if(strEven.length < 3) strEven.push(table[i].fxi.toFixed(4));
            }
        }
        if(strOdd.length >= 3) strOdd.push("...");
        if(strEven.length >= 3) strEven.push("...");
        
        finalResult = (h / 3) * (table[0].fxi + table[n].fxi + 4 * sumOdd + 2 * sumEven);
        
         mathSteps.push(`h = \\frac{b-a}{n} = \\frac{${b}-${a}}{${n}} = ${h.toFixed(5)}`);
         mathSteps.push(`I \\approx \\frac{h}{3}\\left[f(x_0)+f(x_n)+4\\sum_{i \\text{ odd}}f(x_i)+2\\sum_{i \\text{ even}}f(x_i)\\right]`);
         mathSteps.push(`I \\approx \\frac{${h.toFixed(5)}}{3} \\left[${table[0].fxi.toFixed(4)} + ${table[n].fxi.toFixed(4)} + 4(${strOdd.join("+")}) + 2(${strEven.join("+")})\\right]`);
         mathSteps.push(`I \\approx ${finalResult.toFixed(5)}`);
    }

    return { method, table, mathSteps, finalResult, a, b, n, h, funcStr };
}

function renderTableHTML(table) {
    let html = `<table>
        <thead>
            <tr>
                <th>i</th>
                <th>x_i</th>
                <th>f(x_i)</th>
            </tr>
        </thead>
        <tbody>`;
    // limit table rows for performance if very large
    let showMax = Math.min(table.length, 100);
    for(let i=0; i<showMax; i++) {
         html += `<tr>
            <td>${table[i].i}</td>
            <td>${table[i].xi.toFixed(5)}</td>
            <td>${table[i].fxi.toFixed(5)}</td>
         </tr>`;
    }
    if (table.length > 100) {
        html += `<tr><td colspan="3">... ${table.length - 100} more rows ...</td></tr>`;
    }
    html += `</tbody></table>`;
    return html;
}

function renderNumSteps(result) {
    const container = document.getElementById('num-steps-content');
    container.innerHTML = '';
    
    let html = `<h4>1. Calculate Interval Width (h) and Setup</h4>`;
    html += `<div class="katex-container" id="num-math-1"></div>`;
    
    html += `<h4>2. Function Value Table</h4>`;
    html += renderTableHTML(result.table);
    
    html += `<h4>3. Apply Formula</h4>`;
    html += `<div class="katex-container" id="num-math-2"></div>`;
    html += `<div class="katex-container" id="num-math-3"></div>`;
    html += `<div class="katex-container" style="color:var(--secondary); margin-top:1rem; font-weight:bold; font-size:1.2rem;" id="num-math-4"></div>`;
    
    container.innerHTML = html;
    
    // Render katex if available
    try {
       if (window.katex) {
           katex.render(result.mathSteps[0], document.getElementById('num-math-1'), { displayMode: true, throwOnError: false });
           katex.render(result.mathSteps[1], document.getElementById('num-math-2'), { displayMode: true, throwOnError: false });
           katex.render(result.mathSteps[2], document.getElementById('num-math-3'), { displayMode: true, throwOnError: false });
           katex.render(result.mathSteps[3], document.getElementById('num-math-4'), { displayMode: true, throwOnError: false });
       }
    } catch (e) { 
        console.error("KaTeX Error", e); 
    }
}

function renderNumStepsAll(resRect, resTrap, resSimp) {
    const container = document.getElementById('num-steps-content');
    container.innerHTML = '';
    
    let html = `<h4>1. Calculate Interval Width (h) and Setup</h4>`;
    html += `<div class="katex-container" id="num-math-all-h"></div>`;
    
    html += `<h4>2. Function Value Shared Table</h4>`;
    html += renderTableHTML(resRect.table);
    
    html += `<h4>3. Rectangular Rule</h4>`;
    html += `<div class="katex-container" id="num-math-all-rect"></div>`;
    
    html += `<h4>4. Trapezoidal Rule</h4>`;
    html += `<div class="katex-container" id="num-math-all-trap"></div>`;
    
    html += `<h4>5. Simpson's Rule</h4>`;
    html += `<div class="katex-container" id="num-math-all-simp"></div>`;
    
    container.innerHTML = html;
    
    try {
       if (window.katex) {
           katex.render(`h = \\frac{${resRect.b}-${resRect.a}}{${resRect.n}} = ${resRect.h.toFixed(5)}`, document.getElementById('num-math-all-h'), { displayMode: true });
           katex.render(`I_{rect} \\approx ${resRect.finalResult.toFixed(5)}`, document.getElementById('num-math-all-rect'), { displayMode: true });
           katex.render(`I_{trap} \\approx ${resTrap.finalResult.toFixed(5)}`, document.getElementById('num-math-all-trap'), { displayMode: true });
           katex.render(`I_{simp} \\approx ${resSimp.finalResult.toFixed(5)}`, document.getElementById('num-math-all-simp'), { displayMode: true });
       }
    } catch (e) {
        console.error("KaTeX Error", e); 
    }
}

// Charting
function generatePlotData(funcStr, a, b) {
    let padding = (b - a) * 0.1;
    let minX = a - padding;
    let maxX = b + padding;
    let points = 200;
    
    let labels = [];
    let data = [];
    let step = (maxX - minX) / points;
    for (let i = 0; i <= points; i++) {
        let x = minX + i * step;
        labels.push(x.toFixed(4));
        data.push(evaluateFunc(funcStr, x));
    }
    return { labels, data, minX, maxX };
}

function renderNumGraph(funcStr, a, b, n, methods, results) {
   const canvas = document.getElementById('num-chart');
   if(!canvas) return;
   const ctx = canvas.getContext('2d');
   
   if (chartInstance) {
       chartInstance.destroy();
   }
   
   const plot = generatePlotData(funcStr, a, b);
   
   // Base dataset for the exact curve
   let datasets = [{
       label: 'f(x) Actual Curve',
       data: plot.data.map((y, i) => ({x: parseFloat(plot.labels[i]), y: y})),
       borderColor: '#8b5cf6',
       borderWidth: 2,
       fill: false,
       pointRadius: 0,
       tension: 0.4
   }];
   
   const drawRectangular = methods.includes('rectangular') || methods.length > 1; // Default visualization for multiple
   const drawSimpson = methods.includes('simpson') && methods.length === 1;
   const drawTrapezoidal = methods.includes('trapezoidal') && methods.length === 1;

   // Visualize the areas
   if (drawRectangular && (!drawSimpson && !drawTrapezoidal)) {
       const res = methods.length === 1 ? results[0] : results[methods.indexOf('rectangular')];
       let rectData = [];
       for (let i = 0; i < n; i++) {
           rectData.push({x: res.table[i].xi, y: res.table[i].fxi});
           rectData.push({x: res.table[i+1].xi, y: res.table[i].fxi}); // extend horizontally to next point
       }
       // Drop to 0 at the end
       rectData.push({x: res.table[n].xi, y: 0});
       rectData.unshift({x: res.table[0].xi, y: 0}); // start from 0

       datasets.push({
           label: 'Rectangular Area',
           data: rectData,
           borderColor: 'rgba(56, 189, 248, 0.8)',
           backgroundColor: 'rgba(56, 189, 248, 0.4)',
           borderWidth: 1.5,
           fill: true,
           stepped: false, // pre-computed steps
           pointRadius: 3,
           pointBackgroundColor: '#fff'
       });
   } 
   else if (drawSimpson) {
      const res = results[0];
      let areaData = [];
      areaData.push({x: res.table[0].xi, y: 0});
      for(let i=0; i<=n; i++) areaData.push({x: res.table[i].xi, y: res.table[i].fxi});
      areaData.push({x: res.table[n].xi, y: 0});
      
      datasets.push({
           label: 'Simpson Area',
           data: areaData,
           borderColor: 'rgba(217, 70, 239, 0.8)',
           backgroundColor: 'rgba(217, 70, 239, 0.4)',
           borderWidth: 1.5,
           fill: true,
           tension: 0.4, // curves
           pointRadius: 3
       });
   }
   else if (drawTrapezoidal) {
       const res = results[0];
       let trapData = [];
       trapData.push({x: res.table[0].xi, y: 0});
       for(let i=0; i<=n; i++) trapData.push({x: res.table[i].xi, y: res.table[i].fxi});
       trapData.push({x: res.table[n].xi, y: 0});
       
       datasets.push({
           label: 'Trapezoidal Area',
           data: trapData,
           borderColor: 'rgba(16, 185, 129, 0.8)',
           backgroundColor: 'rgba(16, 185, 129, 0.4)',
           borderWidth: 1.5,
           fill: true,
           tension: 0, // straight lines connects points to form trapezoids
           pointRadius: 3
       });
   }
   
   chartInstance = new Chart(ctx, {
       type: 'line',
       data: {
           datasets: datasets
       },
       options: {
           responsive: true,
           scales: {
               x: {
                   type: 'linear',
                   position: 'bottom',
               }
           },
           plugins: {
               tooltip: { enabled: true }
           }
       }
   });
}

// Toggle steps buttons
document.addEventListener("DOMContentLoaded", () => {
   const toggle1 = document.getElementById('num-toggle-steps-btn');
   const toggle2 = document.getElementById('num-toggle-steps-all-btn');
   const stepsCont = document.getElementById('num-steps-container');
   
   const handleToggle = (btn) => {
       if (stepsCont.style.display === 'none' || stepsCont.style.display === '') {
           stepsCont.style.display = 'block';
           btn.textContent = 'Hide Visualizations';
           setTimeout(() => {
               stepsCont.scrollIntoView({ behavior: 'smooth', block: 'start' });
           }, 100);
       } else {
           stepsCont.style.display = 'none';
           btn.textContent = 'View Steps & Graph';
       }
   };
   
   if(toggle1) toggle1.addEventListener('click', () => handleToggle(toggle1));
   if(toggle2) toggle2.addEventListener('click', () => handleToggle(toggle2));
});
