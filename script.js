let pumpDatabase = [];

async function loadDatabase() {
    try {
        const response = await fetch('database.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        pumpDatabase = await response.json();
        initializeApp();
        document.body.classList.add('app-ready');
    } catch (error) {
        console.error("Não foi possível carregar a base de dados de bombas:", error);
    }
}

function initializeApp() {
    const formSection = document.getElementById('formSection');
    const resultsSection = document.getElementById('resultsSection');
    const reportSection = document.getElementById('reportSection');
    const databaseViewSection = document.getElementById('databaseViewSection');

    const pumpForm = document.getElementById('pumpSelectorForm');
    const variationRadios = document.querySelectorAll('input[name="variation"]');
    const controlTypeContainer = document.getElementById('controlTypeContainer');

    const resultsContainer = document.getElementById('resultsContainer');
    const reportContent = document.getElementById('reportContent');

    const backToFormBtn = document.getElementById('backToFormBtn');
    const backToResultsBtn = document.getElementById('backToResultsBtn');
    const printReportBtn = document.getElementById('printReportBtn');
    const viewDatabaseBtn = document.getElementById('viewDatabaseBtn');
    const backToFormFromDbBtn = document.getElementById('backToFormFromDbBtn');

    let lastUserInputs = {};
    let comparisonChart = null;
    let powerComparisonChart = null;
    let reportChart = null;

    variationRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            controlTypeContainer.style.display = e.target.value === 'sim' ? 'block' : 'none';
        });
    });

    pumpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(pumpForm);
        const userInputs = Object.fromEntries(formData.entries());
        userInputs.temperature = parseFloat(userInputs.temperature);
        userInputs.flow = parseFloat(userInputs.flow);
        userInputs.head = parseFloat(userInputs.head);
        userInputs.connectionDN = userInputs.connectionDN ? parseInt(userInputs.connectionDN, 10) : null;

        lastUserInputs = userInputs;

        // 1. Filtrar bombas
        const results = findPumps(userInputs);

        // 2. Calcular todos os parâmetros de desempenho (potência, rendimento, folga)
        const resultsWithFullData = results.map(pump => {
            const powerAtOp = getInterpolatedValue(userInputs.flow, pump.powerCurveData);
            const headAtOpFlow = getInterpolatedValue(userInputs.flow, pump.curveData);

            // Cálculo da folga
            const folga = headAtOpFlow > 0 ? ((headAtOpFlow - userInputs.head) / userInputs.head) * 100 : -100;

            // Cálculo do rendimento (η = P_hidráulica / P_elétrica)
            // P_hidráulica (W) = Q(m³/s) * H(m) * ρ(kg/m³) * g(m/s²)
            // P_elétrica (W) = powerAtOp (kW) * 1000
            const flowM3s = userInputs.flow / 3600;
            const hydraulicPowerW = flowM3s * userInputs.head * 1000 * 9.81;
            const hydraulicPowerkW = hydraulicPowerW / 1000;
            const electricPowerW = powerAtOp * 1000;
            const rendimento = electricPowerW > 0 ? (hydraulicPowerW / electricPowerW) * 100 : 0;

            return { ...pump, powerAtOp, folga, rendimento, hydraulicPowerkW };
        });

        // 3. Ordenar por potência
        const sortedByPower = resultsWithFullData.sort((a, b) => a.powerAtOp - b.powerAtOp);

        // 4. Selecionar as melhores 10
        const curatedResults = curatePumpSelection(sortedByPower);

        // 5. Exibir resultados
        displayResults(curatedResults, userInputs);

        // Anima a transição para a secção de resultados
        switchSection(resultsSection);
    });

    // Função para gerir a visibilidade das secções com animação
    function switchSection(targetSection) {
        [formSection, resultsSection, reportSection, databaseViewSection].forEach(section => {
            if (section === targetSection) {
                section.classList.remove('hidden');
                section.classList.add('visible');
            } else {
                section.classList.remove('visible');
                section.classList.add('hidden');
            }
        });
    }

    function displayDatabase(brandFilter = 'all') {
        const dbFiltersContainer = document.getElementById('dbFiltersContainer');
        const dbTableContainer = document.getElementById('dbTableContainer');

        const brands = ['all', ...new Set(pumpDatabase.map(p => p.brand))];
        let filterHTML = `
            <label for="brandFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por Marca:</label>
            <select id="brandFilter" name="brandFilter" class="mt-1 block w-full md:w-1/3 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
        `;
        brands.forEach(brand => {
            const selected = brand === brandFilter ? 'selected' : '';
            filterHTML += `<option value="${brand}" ${selected}>${brand === 'all' ? 'Todas as Marcas' : brand}</option>`;
        });
        filterHTML += `</select>`;
        dbFiltersContainer.innerHTML = filterHTML;

        document.getElementById('brandFilter').addEventListener('change', (e) => {
            displayDatabase(e.target.value);
        });

        const filteredPumps = brandFilter === 'all'
            ? pumpDatabase
            : pumpDatabase.filter(p => p.brand === brandFilter);

        let tableHTML = `
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Marca</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Modelo</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Classe Energ.</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ligação</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Variação Vel.</th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        `;

        filteredPumps.forEach(pump => {
            tableHTML += `
                <tr>
                    <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${pump.brand}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${pump.model}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-300">${pump.energyClass}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">${pump.connectionType} DN${pump.connectionDN}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-300">${pump.hasVariation ? 'Sim' : 'Não'}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;
        dbTableContainer.innerHTML = tableHTML;
    }

    function isPointOnOrBelowCurve(point, curve) {
        const { x: flow, y: head } = point;
        if (!curve || curve.length < 2) return false;
        if (flow < curve[0].x || flow > curve[curve.length - 1].x) return false;
        let p1 = null, p2 = null;
        for (let i = 0; i < curve.length - 1; i++) {
            if (curve[i].x <= flow && curve[i+1].x >= flow) {
                p1 = curve[i];
                p2 = curve[i+1];
                break;
            }
        }
        if (!p1 || !p2) return false;
        if (p2.x === p1.x) return head <= p1.y;
        const interpolatedHead = p1.y + ((flow - p1.x) * (p2.y - p1.y)) / (p2.x - p1.x);
        return head <= interpolatedHead;
    }

    function findPumps(inputs) {
        return pumpDatabase.filter(pump => {
            const systemMatch = pump.systemType.includes(inputs.systemType);
            const fluidMatch = pump.fluidCompatibility.includes(inputs.fluidType);
            const tempMatch = inputs.temperature >= pump.minTemp && inputs.temperature <= pump.maxTemp;
            const pointIsValid = isPointOnOrBelowCurve({x: inputs.flow, y: inputs.head}, pump.curveData);
            const variationMatch = (inputs.variation === 'sim') === pump.hasVariation;
            const controlMatch = inputs.variation === 'nao' || pump.controlType.includes(inputs.controlType);
            const materialMatch = inputs.material === 'any' || pump.material === inputs.material;
            const connectionTypeMatch = inputs.connectionType === 'any' || pump.connectionType === inputs.connectionType;
            const connectionDNMatch = !inputs.connectionDN || pump.connectionDN === inputs.connectionDN;

            return systemMatch && fluidMatch && tempMatch && pointIsValid && variationMatch && controlMatch && materialMatch && connectionTypeMatch && connectionDNMatch;
        });
    }

    function curatePumpSelection(pumps) {
        // A lista de bombas já está ordenada por potência.
        // Esta função simplesmente garante que não mostramos mais de 10 resultados.
        if (pumps.length > 10) {
            return pumps.slice(0, 10);
        }
        return pumps;
    }

    function getInterpolatedValue(targetX, curve) {
        if (!curve || curve.length === 0) return null;
        if (targetX < curve[0].x) return curve[0].y;
        if (targetX > curve[curve.length - 1].x) return curve[curve.length - 1].y;

        let p1 = null, p2 = null;
        for (let i = 0; i < curve.length - 1; i++) {
            if (curve[i].x <= targetX && curve[i+1].x >= targetX) {
                p1 = curve[i];
                p2 = curve[i+1];
                break;
            }
        }
        if (!p1 || !p2) return null;
        if (p2.x === p1.x) return p1.y;
        const interpolatedY = p1.y + ((targetX - p1.x) * (p2.y - p1.y)) / (p2.x - p1.x);
        return interpolatedY;
    }

    function generateComparisonTable(pumps) {
        const tableContainer = document.getElementById('comparisonTableContainer');
        if (!tableContainer) return;

        let tableHTML = `
            <h3 class="text-xl font-semibold mb-4 text-center">Tabela Comparativa de Soluções (Ordenado por Potência)</h3>
            <div class="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-600">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Modelo</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Potência (kW)*</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pot. Hidráulica (kW)*</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rendimento (%)*</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Folga H (%)*</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Classe Energ.</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ligação</th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Preço Est. (€)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        `;

        pumps.forEach(pump => {
            tableHTML += `
                <tr class="hover:bg-gray-100 dark:hover:bg-gray-600">
                    <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${pump.brand} ${pump.model}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-center font-bold text-indigo-600 dark:text-indigo-400">${pump.powerAtOp !== null ? pump.powerAtOp.toFixed(3) : 'N/A'}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-300">${pump.hydraulicPowerkW.toFixed(3)}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-300">${pump.rendimento.toFixed(1)}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-300">${pump.folga.toFixed(1)}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-300">${pump.energyClass}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">${pump.connectionType} DN${pump.connectionDN}</td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-700 dark:text-gray-200">${pump.estimatedPrice.toFixed(2)}</td>
                </tr>
            `;
        });

        tableHTML += `
                    </tbody>
                </table>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">* Valores calculados no ponto de operação.</p>
        `;

        tableContainer.innerHTML = tableHTML;
    }

    function displayResults(pumps, inputs) {
        resultsContainer.innerHTML = '';
        const comparisonChartsDiv = document.getElementById('comparisonChartsContainer');
        const comparisonTableDiv = document.getElementById('comparisonTableContainer');

        if (pumps.length === 0) {
            comparisonChartsDiv.style.display = 'none';
            if(comparisonTableDiv) comparisonTableDiv.innerHTML = '';
            resultsContainer.innerHTML = `<div class="p-6 text-center bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                <h3 class="font-semibold text-yellow-800 dark:text-yellow-200">Nenhuma bomba encontrada</h3>
                <p class="mt-1 text-yellow-700 dark:text-yellow-300">O ponto de operação está fora da curva das bombas disponíveis ou os critérios são demasiado restritos. Tente ajustar a sua seleção.</p>
            </div>`;
            return;
        }

        comparisonChartsDiv.style.display = 'grid';
        drawComparisonChart(pumps, inputs);
        drawPowerComparisonChart(pumps, inputs);
        generateComparisonTable(pumps);

        let individualCardsHTML = '<h3 class="text-xl font-semibold mb-4 text-center mt-8">Selecionar Bomba Individual para Relatório Detalhado</h3>';
        pumps.forEach(pump => {
            individualCardsHTML += `
            <div class="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h5 class="text-xl font-bold text-gray-900 dark:text-white">${pump.brand} ${pump.model}</h5>
                    <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <span><strong>Potência:</strong> <span class="font-bold text-indigo-600 dark:text-indigo-400">${pump.powerAtOp.toFixed(3)} kW</span></span>
                            <span><strong>Rendimento:</strong> ${pump.rendimento.toFixed(1)}%</span>
                        <span><strong>Folga H:</strong> ${pump.folga.toFixed(1)}%</span>
                    </div>
                </div>
                <button class="generate-report-btn mt-4 md:mt-0 py-2 px-5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap" data-model="${pump.model}">
                    Ver Relatório Detalhado
                </button>
            </div>`;
        });
        resultsContainer.innerHTML = individualCardsHTML;


        document.querySelectorAll('.generate-report-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const model = e.target.getAttribute('data-model');
                const selectedPump = pumpDatabase.find(p => p.model === model);
                generateReport(lastUserInputs, selectedPump);

                switchSection(reportSection);
            });
        });
    }

    function generateReport(inputs, pump) {
        const inputLabels = {
            systemType: 'Tipo de Sistema', fluidType: 'Tipo de Fluido', temperature: 'Temperatura (°C)',
            flow: 'Caudal Requerido (m³/h)', head: 'Altura Manométrica (mca)', material: 'Material da Bomba',
            connectionType: 'Tipo de Ligação', connectionDN: 'DN Ligação (mm)',
            variation: 'Variação de Velocidade', controlType: 'Tipo de Controlo'
        };

        const powerAtOp = getInterpolatedValue(inputs.flow, pump.powerCurveData);
        let amperage = 0;
        const powerInWatts = powerAtOp * 1000;

        if (pump.voltage === '230V' && powerInWatts > 0) {
            const voltageNum = 230;
            amperage = powerInWatts / (voltageNum * pump.powerFactor);
        } else if (pump.voltage === '400V' && powerInWatts > 0) {
            const voltageNum = 400;
            amperage = powerInWatts / (voltageNum * Math.sqrt(3) * pump.powerFactor);
        }

        let criteriaHTML = '';
        for (const key in inputs) {
            if (!inputLabels[key]) continue;
            if (key === 'controlType' && inputs['variation'] === 'nao') continue;
            if (!inputs[key] && key === 'connectionDN') continue;

            criteriaHTML += `
            <tr>
                <td class="py-2 pr-4 text-sm font-medium text-gray-500 dark:text-gray-400">${inputLabels[key]}</td>
                <td class="py-2 text-sm text-gray-900 dark:text-white font-semibold capitalize">${String(inputs[key]).replace(/_/g, ' ')}</td>
            </tr>`;
        }

        const reportHTML = `
            <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                        <h3 class="text-lg font-semibold border-b pb-2 mb-3 text-indigo-600 dark:text-indigo-400">Critérios de Seleção</h3>
                        <table class="w-full">${criteriaHTML}</table>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold border-b pb-2 mb-3 text-indigo-600 dark:text-indigo-400">Bomba Selecionada</h3>
                        <table class="w-full">
                            <tr><td class="py-1 pr-4 text-sm font-medium">Marca</td><td class="py-1 text-sm font-semibold">${pump.brand}</td></tr>
                            <tr><td class="py-1 pr-4 text-sm font-medium">Modelo</td><td class="py-1 text-sm font-semibold">${pump.model}</td></tr>
                            <tr><td class="py-1 pr-4 text-sm font-medium">Potência no Ponto Op.</td><td class="py-1 text-sm font-semibold">${powerAtOp.toFixed(3)} kW</td></tr>
                            <tr><td class="py-1 pr-4 text-sm font-medium">Consumo Elétrico (Est.)</td><td class="py-1 text-sm font-semibold">${amperage.toFixed(2)} A</td></tr>
                            <tr><td class="py-1 pr-4 text-sm font-medium">Tensão de Alimentação</td><td class="py-1 text-sm font-semibold">${pump.voltage}</td></tr>
                            <tr><td class="py-1 pr-4 text-sm font-medium">Classe Energ.</td><td class="py-1 text-sm font-semibold">${pump.energyClass}</td></tr>
                            <tr><td class="py-1 pr-4 text-sm font-medium">Ligação</td><td class="py-1 text-sm font-semibold capitalize">${pump.connectionType} DN${pump.connectionDN}</td></tr>
                            <tr><td class="py-1 pr-4 text-sm font-medium">Material</td><td class="py-1 text-sm font-semibold capitalize">${pump.material.replace(/_/g, ' ')}</td></tr>
                            <tr><td class="py-1 pr-4 text-sm font-medium">Preço Est.</td><td class="py-1 text-sm font-semibold">€${pump.estimatedPrice.toFixed(2)}</td></tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="mt-6 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Desempenho da Bomba e Curva de Potência</h3>
                <canvas id="pumpCurveChart" class="cursor-crosshair"></canvas>
                <div id="interactivePointInfo" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h4 class="font-semibold text-gray-800 dark:text-gray-200">Análise Interativa</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Clique no gráfico acima para selecionar um novo ponto de funcionamento e ver os detalhes abaixo.</p>
                    <div id="pointDetails" class="hidden mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <!-- Details will be injected here -->
                    </div>
                </div>
            </div>
        `;
        reportContent.innerHTML = reportHTML;

        setTimeout(() => drawReportChart(inputs, pump), 0);
    }

    function getChartColors() {
        const isPrinting = window.matchMedia('print').matches;
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches && !isPrinting;

        return {
            gridColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            fontColor: isDarkMode ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)',
            brandColors: {
                'Grundfos': 'rgb(220, 38, 38)',
                'Wilo': 'rgb(22, 163, 74)',
                'KSB': 'rgb(37, 99, 235)',
                'LOWARA': 'rgb(249, 115, 22)',
                'DAB': 'rgb(14, 165, 233)',
                'Speroni': 'rgb(245, 158, 11)'
            }
        };
    }

    function drawComparisonChart(pumps, inputs) {
        if (comparisonChart) comparisonChart.destroy();
        const ctx = document.getElementById('comparisonChart');
        if (!ctx) return;

        const { gridColor, fontColor, brandColors } = getChartColors();

        const datasets = pumps.map(pump => ({
            label: `${pump.brand} ${pump.model}`, data: pump.curveData, borderColor: brandColors[pump.brand] || 'gray',
            backgroundColor: brandColors[pump.brand] || 'gray', showLine: true, tension: 0.1, borderWidth: 2, pointRadius: 0
        }));

        datasets.push({
            label: 'Ponto de Operação', data: [{x: inputs.flow, y: inputs.head}],
            borderColor: 'rgb(255, 193, 7)', backgroundColor: 'rgb(255, 193, 7)', pointRadius: 8, pointHoverRadius: 10, pointStyle: 'star'
        });

         comparisonChart = new Chart(ctx, { type: 'scatter', data: { datasets },
            options: { responsive: true, maintainAspectRatio: true,
                animation: {
                    duration: 500,
                    easing: 'easeInOutQuart'
                },
                interaction: { mode: 'nearest', intersect: false },
                scales: {
                    x: { title: { display: true, text: 'Caudal (m³/h)', color: fontColor }, grid: { color: gridColor }, ticks: { color: fontColor } },
                    y: { title: { display: true, text: 'Altura Manométrica (mca)', color: fontColor }, grid: { color: gridColor }, ticks: { color: fontColor } }
                },
                plugins: {
                    legend: { labels: { color: fontColor } },
                    tooltip: { callbacks: { title: (tooltipItems) => tooltipItems[0].dataset.label } }
                }
            }
        });
    }

    function drawPowerComparisonChart(pumps, inputs) {
        if (powerComparisonChart) powerComparisonChart.destroy();
        const ctx = document.getElementById('powerComparisonChart');
        if (!ctx) return;

        const { gridColor, fontColor, brandColors } = getChartColors();

        const datasets = pumps.map(pump => ({
            label: `${pump.brand} ${pump.model}`, data: pump.powerCurveData, borderColor: brandColors[pump.brand] || 'gray',
            backgroundColor: brandColors[pump.brand] || 'gray', showLine: true, tension: 0.1, borderWidth: 2, pointRadius: 0
        }));

        const maxPower = Math.max(0.1, ...pumps.flatMap(p => p.powerCurveData.map(d => d.y))) * 1.1;
        datasets.push({
            label: 'Caudal de Operação', data: [{x: inputs.flow, y: 0}, {x: inputs.flow, y: maxPower}],
            borderColor: 'rgb(255, 193, 7)', backgroundColor: 'rgb(255, 193, 7)', showLine: true,
            borderDash: [5,5], borderWidth: 2, pointRadius: 0
        });

        powerComparisonChart = new Chart(ctx, { type: 'scatter', data: { datasets },
            options: { responsive: true, maintainAspectRatio: true,
                animation: {
                    duration: 500,
                    easing: 'easeInOutQuart'
                },
                interaction: { mode: 'nearest', intersect: false },
                scales: {
                    x: { title: { display: true, text: 'Caudal (m³/h)', color: fontColor }, grid: { color: gridColor }, ticks: { color: fontColor } },
                    y: { title: { display: true, text: 'Potência Elétrica (kW)', color: fontColor }, grid: { color: gridColor }, ticks: { color: fontColor }, min: 0 }
                },
                plugins: {
                    legend: { labels: { color: fontColor } },
                    tooltip: { callbacks: { title: (tooltipItems) => tooltipItems[0].dataset.label } }
                }
            }
        });
    }

    function drawReportChart(inputs, pump) {
        if (reportChart) {
            reportChart.destroy();
            reportChart = null;
        }
        let canvas = document.getElementById('pumpCurveChart');
        if (!canvas) return;

        const newCanvas = canvas.cloneNode(true);
        canvas.parentNode.replaceChild(newCanvas, canvas);
        canvas = newCanvas;

        const { gridColor, fontColor } = getChartColors();

        reportChart = new Chart(canvas, { type: 'scatter',
            data: {
                datasets: [{
                    label: `Curva H/Q - ${pump.model}`, data: pump.curveData, borderColor: 'rgb(79, 70, 229)',
                    backgroundColor: 'rgb(79, 70, 229)', showLine: true, tension: 0.1, yAxisID: 'y'
                }, {
                    label: 'Potência Elétrica (kW)', data: pump.powerCurveData, borderColor: 'rgb(22, 163, 74)',
                    backgroundColor: 'rgb(22, 163, 74)', showLine: true, tension: 0.1, borderDash: [5, 5], yAxisID: 'y1'
                }, {
                    label: 'Ponto de Operação', data: [{x: inputs.flow, y: inputs.head}],
                    borderColor: 'rgb(220, 38, 38)', backgroundColor: 'rgb(220, 38, 38)',
                    pointRadius: 6, pointHoverRadius: 8, yAxisID: 'y'
                }, {
                    label: 'Ponto Interativo', data: [],
                    borderColor: 'rgb(234, 88, 12)', backgroundColor: 'rgb(234, 88, 12)',
                    pointRadius: 7, pointHoverRadius: 9, pointStyle: 'crossRot', yAxisID: 'y'
                }]
            },
            options: {
                animation: { onComplete: () => { if (reportChart) reportChart.options.animation = false; } },
                responsive: true, maintainAspectRatio: true,
                scales: {
                    x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Caudal (m³/h)', color: fontColor }, grid: { color: gridColor }, ticks: { color: fontColor } },
                    y: { type: 'linear', position: 'left', title: { display: true, text: 'Altura Manométrica (mca)', color: 'rgb(79, 70, 229)' }, ticks: { color: 'rgb(79, 70, 229)' } },
                    y1: { type: 'linear', position: 'right', title: { display: true, text: 'Potência Elétrica (kW)', color: 'rgb(22, 163, 74)' }, grid: { drawOnChartArea: false }, ticks: { color: 'rgb(22, 163, 74)' } }
                },
                plugins: { legend: { labels: { color: fontColor } } }
            }
        });

        canvas.onclick = (event) => {
            const chart = reportChart;
            if (!chart) return;

            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const xValue = chart.scales.x.getValueForPixel(x);

            const minFlow = pump.curveData[0].x;
            const maxFlow = pump.curveData[pump.curveData.length - 1].x;

            if (xValue >= minFlow && xValue <= maxFlow) {
                const interpolatedHead = getInterpolatedValue(xValue, pump.curveData);
                const interpolatedPower = getInterpolatedValue(xValue, pump.powerCurveData);

                if (interpolatedHead !== null) {
                    const interactivePointDataset = chart.data.datasets.find(ds => ds.label === 'Ponto Interativo');
                    if (interactivePointDataset) {
                        interactivePointDataset.data = [{ x: xValue, y: interpolatedHead }];
                        chart.update('none');
                    }

                    const pointDetailsDiv = document.getElementById('pointDetails');
                    pointDetailsDiv.innerHTML = `
                        <div>
                            <span class="block text-sm text-gray-500 dark:text-gray-400">Caudal</span>
                            <span class="block text-lg font-bold text-indigo-600 dark:text-indigo-400">${xValue.toFixed(2)} m³/h</span>
                        </div>
                        <div>
                            <span class="block text-sm text-gray-500 dark:text-gray-400">Altura Manométrica</span>
                            <span class="block text-lg font-bold text-indigo-600 dark:text-indigo-400">${interpolatedHead.toFixed(2)} mca</span>
                        </div>
                        <div>
                            <span class="block text-sm text-gray-500 dark:text-gray-400">Potência Estimada</span>
                            <span class="block text-lg font-bold text-indigo-600 dark:text-indigo-400">${interpolatedPower ? interpolatedPower.toFixed(3) : 'N/A'} kW</span>
                        </div>
                    `;
                    pointDetailsDiv.classList.remove('hidden');
                }
            }
        };
    };

    // Botões de Navegação
    backToFormBtn.addEventListener('click', () => {
        switchSection(formSection);
    });

    backToResultsBtn.addEventListener('click', () => {
        switchSection(resultsSection);
        if (reportChart) {
            reportChart.destroy();
            reportChart = null;
        }
    });

    printReportBtn.addEventListener('click', () => {
        if (reportChart) {
            reportChart.update();
        }
        window.print();
    });

    viewDatabaseBtn.addEventListener('click', () => {
        displayDatabase();
        switchSection(databaseViewSection);
    });

    backToFormFromDbBtn.addEventListener('click', () => {
        switchSection(formSection);
    });

    // Estado inicial
    controlTypeContainer.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', loadDatabase);