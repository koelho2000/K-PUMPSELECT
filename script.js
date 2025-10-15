// --- BASE DE DADOS SIMULADA COM CURVAS DE DESEMPENHO, POTÊNCIA E CLASSE ENERGÉTICA ---
const pumpDatabase = [
    // Grundfos
    { brand: 'Grundfos', model: 'MAGNA3 32-120 F', energyClass: 'A', voltage: '400V', powerFactor: 0.9, systemType: ['aquecimento', 'arrefecimento'], fluidCompatibility: ['agua', 'agua_glicol'], maxTemp: 110, minTemp: -10, maxFlow: 10, maxHead: 12, hasVariation: true, controlType: ['pressao', 'temperatura'], material: 'ferro_fundido', dimensions: '220x210x190', weight: 12.5, connectionType: 'flangeada', connectionDN: 32, estimatedPrice: 1150, curveData: [{x:0,y:12},{x:2,y:11.5},{x:4,y:10},{x:6,y:8},{x:8,y:5},{x:10,y:2}], powerCurveData: [{x:0,y:0.05},{x:2,y:0.2},{x:4,y:0.35},{x:6,y:0.45},{x:8,y:0.5},{x:10,y:0.55}] },
    { brand: 'Grundfos', model: 'ALPHA2 25-60 180', energyClass: 'A', voltage: '230V', powerFactor: 0.9, systemType: ['aquecimento'], fluidCompatibility: ['agua'], maxTemp: 110, minTemp: 2, maxFlow: 3, maxHead: 6, hasVariation: true, controlType: ['pressao'], material: 'ferro_fundido', dimensions: '180x150x130', weight: 4.8, connectionType: 'roscada', connectionDN: 25, estimatedPrice: 480, curveData: [{x:0,y:6},{x:0.5,y:5.5},{x:1,y:5},{x:1.5,y:4.5},{x:2,y:3.5},{x:2.5,y:2},{x:3,y:1}], powerCurveData: [{x:0,y:0.01},{x:0.5,y:0.02},{x:1,y:0.03},{x:1.5,y:0.04},{x:2,y:0.045},{x:2.5,y:0.05},{x:3,y:0.05}] },
    { brand: 'Grundfos', model: 'UPS 25-80 N 180', energyClass: 'C', voltage: '230V', powerFactor: 0.85, systemType: ['aquecimento', 'arrefecimento'], fluidCompatibility: ['agua', 'agua_glicol'], maxTemp: 110, minTemp: -10, maxFlow: 7, maxHead: 8, hasVariation: false, controlType: ['none'], material: 'aco_inoxidavel', dimensions: '180x160x140', weight: 5.2, connectionType: 'roscada', connectionDN: 25, estimatedPrice: 620, curveData: [{x:0,y:8},{x:1,y:7.5},{x:2,y:7},{x:3,y:6},{x:4,y:5},{x:5,y:3.5},{x:6,y:2},{x:7,y:0.5}], powerCurveData: [{x:0,y:0.04},{x:1,y:0.09},{x:2,y:0.12},{x:3,y:0.15},{x:4,y:0.18},{x:5,y:0.2},{x:6,y:0.21},{x:7,y:0.22}] },
    { brand: 'Grundfos', model: 'ALPHA1 L 25-40 180', energyClass: 'B', voltage: '230V', powerFactor: 0.88, systemType: ['aquecimento'], fluidCompatibility: ['agua'], maxTemp: 95, minTemp: 2, maxFlow: 2.5, maxHead: 4, hasVariation: true, controlType: ['pressao'], material: 'ferro_fundido', dimensions: '180x130x120', weight: 4.0, connectionType: 'roscada', connectionDN: 25, estimatedPrice: 350, curveData: [{x:0,y:4},{x:0.5,y:3.8},{x:1,y:3.5},{x:1.5,y:3},{x:2,y:2},{x:2.5,y:1}], powerCurveData: [{x:0,y:0.01},{x:0.5,y:0.015},{x:1,y:0.02},{x:1.5,y:0.028},{x:2,y:0.035},{x:2.5,y:0.04}] },

    // Wilo
    { brand: 'Wilo', model: 'Stratos MAXO 32/0,5-12', energyClass: 'A', voltage: '400V', powerFactor: 0.9, systemType: ['aquecimento', 'arrefecimento', 'condensacao'], fluidCompatibility: ['agua', 'agua_glicol'], maxTemp: 110, minTemp: -10, maxFlow: 14, maxHead: 12, hasVariation: true, controlType: ['pressao', 'temperatura'], material: 'ferro_fundido', dimensions: '240x220x200', weight: 13.0, connectionType: 'flangeada', connectionDN: 32, estimatedPrice: 1250, curveData: [{x:0,y:12},{x:2,y:11.8},{x:4,y:11},{x:6,y:10},{x:8,y:8.5},{x:10,y:6.5},{x:12,y:4},{x:14,y:1.5}], powerCurveData: [{x:0,y:0.06},{x:2,y:0.25},{x:4,y:0.4},{x:6,y:0.55},{x:8,y:0.65},{x:10,y:0.7},{x:12,y:0.75},{x:14,y:0.8}] },
    { brand: 'Wilo', model: 'Yonos PICO plus 25/1-6', energyClass: 'A', voltage: '230V', powerFactor: 0.9, systemType: ['aquecimento', 'arrefecimento'], fluidCompatibility: ['agua'], maxTemp: 95, minTemp: -10, maxFlow: 3.5, maxHead: 6, hasVariation: true, controlType: ['pressao'], material: 'ferro_fundido', dimensions: '180x145x125', weight: 4.5, connectionType: 'roscada', connectionDN: 25, estimatedPrice: 450, curveData: [{x:0,y:6},{x:0.5,y:5.8},{x:1,y:5.5},{x:1.5,y:5},{x:2,y:4},{x:2.5,y:3},{x:3,y:2},{x:3.5,y:1}], powerCurveData: [{x:0,y:0.01},{x:0.5,y:0.02},{x:1,y:0.03},{x:1.5,y:0.04},{x:2,y:0.05},{x:2.5,y:0.055},{x:3,y:0.06},{x:3.5,y:0.06}] },
    { brand: 'Wilo', model: 'TOP-S 32/10 F', energyClass: 'B', voltage: '230V', powerFactor: 0.85, systemType: ['aquecimento', 'arrefecimento'], fluidCompatibility: ['agua', 'agua_glicol'], maxTemp: 130, minTemp: -20, maxFlow: 10, maxHead: 10, hasVariation: false, controlType: ['none'], material: 'ferro_fundido', dimensions: '220x180x160', weight: 7.5, connectionType: 'flangeada', connectionDN: 32, estimatedPrice: 750, curveData: [{x:0,y:10},{x:2,y:9.5},{x:4,y:8.5},{x:6,y:7},{x:8,y:5},{x:10,y:2}], powerCurveData: [{x:0,y:0.05},{x:2,y:0.18},{x:4,y:0.25},{x:6,y:0.3},{x:8,y:0.35},{x:10,y:0.4}] },
    { brand: 'Wilo', model: 'Varios PICO 25/1-7', energyClass: 'A', voltage: '230V', powerFactor: 0.9, systemType: ['aquecimento', 'arrefecimento'], fluidCompatibility: ['agua', 'agua_glicol'], maxTemp: 95, minTemp: -10, maxFlow: 4, maxHead: 7.5, hasVariation: true, controlType: ['pressao', 'temperatura'], material: 'ferro_fundido', dimensions: '180x160x140', weight: 4.8, connectionType: 'roscada', connectionDN: 25, estimatedPrice: 550, curveData: [{x:0,y:7.5},{x:0.5,y:7},{x:1,y:6.5},{x:2,y:5.5},{x:3,y:4},{x:4,y:2}], powerCurveData: [{x:0,y:0.01},{x:0.5,y:0.025},{x:1,y:0.04},{x:2,y:0.06},{x:3,y:0.07},{x:4,y:0.075}] },

    // KSB
    { brand: 'KSB', model: 'Calio 32-120', energyClass: 'A', voltage: '400V', powerFactor: 0.9, systemType: ['aquecimento', 'arrefecimento'], fluidCompatibility: ['agua', 'agua_glicol'], maxTemp: 110, minTemp: -10, maxFlow: 13, maxHead: 12.5, hasVariation: true, controlType: ['pressao', 'temperatura'], material: 'ferro_fundido', dimensions: '230x215x195', weight: 12.8, connectionType: 'flangeada', connectionDN: 32, estimatedPrice: 1180, curveData: [{x:0,y:12.5},{x:2,y:12},{x:4,y:11},{x:6,y:9.5},{x:8,y:7.5},{x:10,y:5},{x:12,y:2.5},{x:13,y:1}], powerCurveData: [{x:0,y:0.06},{x:2,y:0.22},{x:4,y:0.38},{x:6,y:0.5},{x:8,y:0.6},{x:10,y:0.68},{x:12,y:0.72},{x:13,y:0.75}] },
    { brand: 'KSB', model: 'Rio-Eco N 25/1-6', energyClass: 'B', voltage: '230V', powerFactor: 0.9, systemType: ['aquecimento'], fluidCompatibility: ['agua'], maxTemp: 95, minTemp: 5, maxFlow: 3.2, maxHead: 6, hasVariation: true, controlType: ['pressao'], material: 'bronze', dimensions: '180x155x135', weight: 5.5, connectionType: 'roscada', connectionDN: 25, estimatedPrice: 580, curveData: [{x:0,y:6},{x:0.5,y:5.6},{x:1,y:5.1},{x:1.5,y:4.6},{x:2,y:3.8},{x:2.5,y:2.8},{x:3,y:1.5},{x:3.2,y:1}], powerCurveData: [{x:0,y:0.01},{x:0.5,y:0.02},{x:1,y:0.03},{x:1.5,y:0.04},{x:2,y:0.048},{x:2.5,y:0.05},{x:3,y:0.055},{x:3.2,y:0.055}] },
    { brand: 'KSB', model: 'PH-100C', energyClass: 'C', voltage: '230V', powerFactor: 0.85, systemType: ['aquecimento', 'arrefecimento'], fluidCompatibility: ['agua'], maxTemp: 90, minTemp: 0, maxFlow: 4, maxHead: 8.5, hasVariation: false, controlType: ['none'], material: 'ferro_fundido', dimensions: '180x150x130', weight: 5.0, connectionType: 'roscada', connectionDN: 25, estimatedPrice: 400, curveData: [{x:0,y:8.5},{x:1,y:8},{x:2,y:7},{x:3,y:5},{x:4,y:2.5}], powerCurveData: [{x:0,y:0.03},{x:1,y:0.08},{x:2,y:0.11},{x:3,y:0.14},{x:4,y:0.16}] },
    { brand: 'KSB', model: 'Calio S 25-60', energyClass: 'A', voltage: '230V', powerFactor: 0.9, systemType: ['aquecimento'], fluidCompatibility: ['agua', 'agua_glicol'], maxTemp: 95, minTemp: 2, maxFlow: 3.5, maxHead: 6, hasVariation: true, controlType: ['pressao'], material: 'ferro_fundido', dimensions: '180x150x130', weight: 4.7, connectionType: 'roscada', connectionDN: 25, estimatedPrice: 490, curveData: [{x:0,y:6},{x:0.5,y:5.7},{x:1,y:5.3},{x:1.5,y:4.8},{x:2,y:4},{x:2.5,y:3},{x:3,y:1.8},{x:3.5,y:0.8}], powerCurveData: [{x:0,y:0.01},{x:0.5,y:0.02},{x:1,y:0.03},{x:1.5,y:0.04},{x:2,y:0.048},{x:2.5,y:0.052},{x:3,y:0.055},{x:3.5,y:0.058}] },

    // LOWARA
    { brand: 'LOWARA', model: 'ecocirc XL 32-120', energyClass: 'A', voltage: '400V', powerFactor: 0.9, systemType: ['aquecimento', 'arrefecimento'], fluidCompatibility: ['agua', 'agua_glicol'], maxTemp: 110, minTemp: -10, maxFlow: 11, maxHead: 12, hasVariation: true, controlType: ['pressao', 'temperatura'], material: 'ferro_fundido', dimensions: '225x210x190', weight: 12.2, connectionType: 'flangeada', connectionDN: 32, estimatedPrice: 1100, curveData: [{x:0,y:12},{x:2,y:11.6},{x:4,y:10.5},{x:6,y:8.5},{x:8,y:6},{x:10,y:3},{x:11,y:1}], powerCurveData: [{x:0,y:0.05},{x:2,y:0.21},{x:4,y:0.36},{x:6,y:0.48},{x:8,y:0.55},{x:10,y:0.6},{x:11,y:0.62}] },
    { brand: 'LOWARA', model: 'ecocirc M 25-6/180', energyClass: 'B', voltage: '230V', powerFactor: 0.9, systemType: ['aquecimento'], fluidCompatibility: ['agua'], maxTemp: 95, minTemp: 2, maxFlow: 3.3, maxHead: 6, hasVariation: true, controlType: ['pressao'], material: 'ferro_fundido', dimensions: '180x148x128', weight: 4.6, connectionType: 'roscada', connectionDN: 25, estimatedPrice: 465, curveData: [{x:0,y:6},{x:0.5,y:5.7},{x:1,y:5.2},{x:1.5,y:4.7},{x:2,y:3.8},{x:2.5,y:2.5},{x:3.3,y:1.2}], powerCurveData: [{x:0,y:0.01},{x:0.5,y:0.02},{x:1,y:0.03},{x:1.5,y:0.04},{x:2,y:0.05},{x:2.5,y:0.055},{x:3.3,y:0.06}] },
    { brand: 'LOWARA', model: 'e-LNE 32-160/150', energyClass: 'C', voltage: '400V', powerFactor: 0.85, systemType: ['aquecimento', 'arrefecimento'], fluidCompatibility: ['agua', 'agua_glicol'], maxTemp: 120, minTemp: -20, maxFlow: 20, maxHead: 15, hasVariation: false, controlType: ['none'], material: 'aco_inoxidavel', dimensions: '300x250x220', weight: 25.0, connectionType: 'flangeada', connectionDN: 32, estimatedPrice: 1500, curveData: [{x:0,y:15},{x:4,y:14.5},{x:8,y:13},{x:12,y:11},{x:16,y:8},{x:20,y:4}], powerCurveData: [{x:0,y:0.1},{x:4,y:0.4},{x:8,y:0.7},{x:12,y:1.0},{x:16,y:1.3},{x:20,y:1.5}] },

    // DAB PUMPS
    { brand: 'DAB', model: 'EVOSTA 2 25/60', energyClass: 'A', voltage: '230V', powerFactor: 0.9, systemType: ['aquecimento', 'arrefecimento'], fluidCompatibility: ['agua', 'agua_glicol'], maxTemp: 110, minTemp: -10, maxFlow: 3.6, maxHead: 6.9, hasVariation: true, controlType: ['pressao'], material: 'ferro_fundido', dimensions: '180x140x130', weight: 4.2, connectionType: 'roscada', connectionDN: 25, estimatedPrice: 420, curveData: [{x:0,y:6.9},{x:0.5,y:6.5},{x:1,y:6},{x:1.5,y:5.2},{x:2,y:4.5},{x:2.5,y:3.5},{x:3,y:2.5},{x:3.6,y:1}], powerCurveData: [{x:0,y:0.01},{x:0.5,y:0.02},{x:1,y:0.03},{x:1.5,y:0.04},{x:2,y:0.05},{x:2.5,y:0.058},{x:3,y:0.065},{x:3.6,y:0.07}] },

    // SPERONI
    { brand: 'Speroni', model: 'SCR 25/60-180', energyClass: 'B', voltage: '230V', powerFactor: 0.88, systemType: ['aquecimento'], fluidCompatibility: ['agua'], maxTemp: 110, minTemp: 5, maxFlow: 3.4, maxHead: 6, hasVariation: false, controlType: ['none'], material: 'ferro_fundido', dimensions: '180x155x135', weight: 4.9, connectionType: 'roscada', connectionDN: 25, estimatedPrice: 380, curveData: [{x:0,y:6},{x:0.5,y:5.6},{x:1,y:5.1},{x:1.5,y:4.5},{x:2,y:3.7},{x:2.5,y:2.8},{x:3,y:1.7},{x:3.4,y:0.9}], powerCurveData: [{x:0,y:0.015},{x:0.5,y:0.025},{x:1,y:0.035},{x:1.5,y:0.045},{x:2,y:0.055},{x:2.5,y:0.06},{x:3,y:0.065},{x:3.4,y:0.07}] }
];

// --- MANIPULAÇÃO DO DOM E LÓGICA DA APLICAÇÃO ---

document.addEventListener('DOMContentLoaded', () => {
    const formSection = document.getElementById('formSection');
    const resultsSection = document.getElementById('resultsSection');
    const reportSection = document.getElementById('reportSection');

    const pumpForm = document.getElementById('pumpSelectorForm');
    const variationRadios = document.querySelectorAll('input[name="variation"]');
    const controlTypeContainer = document.getElementById('controlTypeContainer');

    const resultsContainer = document.getElementById('resultsContainer');
    const reportContent = document.getElementById('reportContent');

    const backToFormBtn = document.getElementById('backToFormBtn');
    const backToResultsBtn = document.getElementById('backToResultsBtn');
    const printReportBtn = document.getElementById('printReportBtn');

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
            const folga = ((headAtOpFlow - userInputs.head) / userInputs.head) * 100;

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
        [formSection, resultsSection, reportSection].forEach(section => {
            if (section === targetSection) {
                // Usa um pequeno delay para garantir que a classe 'hidden' é removida antes de 'visible' ser adicionada
                setTimeout(() => {
                    section.classList.remove('hidden');
                    section.classList.add('visible');
                }, 50);
            } else {
                section.classList.remove('visible');
                section.classList.add('hidden');
            }
        });
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
        // Evitar divisão por zero se os pontos x forem iguais
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
        // A ordenação principal por potência já foi feita. Esta função apenas seleciona.
        if (pumps.length <= 10) return pumps;

        const finalSelection = [];
        const brandsRepresented = new Set();

        // Garantir pelo menos uma bomba de cada marca (a mais eficiente)
        for (const pump of pumps) {
            if (!brandsRepresented.has(pump.brand)) {
                finalSelection.push(pump);
                brandsRepresented.add(pump.brand);
            }
        }

        // Preencher com as melhores bombas restantes até ao limite de 10
        for (const pump of pumps) {
            if (finalSelection.length >= 10) break;
            if (!finalSelection.some(p => p.model === pump.model)) {
                finalSelection.push(pump);
            }
        }

        // Re-ordena o resultado final por potência para consistência
        return finalSelection.sort((a,b) => a.powerAtOp - b.powerAtOp);
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
            // Cálculo para monofásico
            const voltageNum = 230;
            amperage = powerInWatts / (voltageNum * pump.powerFactor);
        } else if (pump.voltage === '400V' && powerInWatts > 0) {
            // Cálculo para trifásico
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
        // A deteção de dark mode pode não funcionar corretamente no contexto de impressão.
        // Forçamos um fundo branco para a impressão, então usamos cores de gráfico para modo claro.
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
                    duration: 500, // Duração da animação em ms
                    easing: 'easeInOutQuart' // Efeito de suavização
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

        // Recriar o canvas para evitar problemas de reutilização com Chart.js
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
        // Redesenha o gráfico com cores claras para impressão antes de imprimir
        // A lógica em getChartColors() já trata disto através de `window.matchMedia('print')`
        // Mas podemos forçar uma redesenhagem para garantir que está atualizado
        if (reportChart) {
            reportChart.update();
        }
        window.print();
    });


    // Estado inicial
    controlTypeContainer.style.display = 'block';
});