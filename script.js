document.addEventListener('DOMContentLoaded', () => {

    const papersContainer = document.getElementById('papers-container');
    const origamiFilter = document.getElementById('origami-filter');
    const materialFilter = document.getElementById('material-filter');
    const manufacturingFilter = document.getElementById('manufacturing-filter');
    const inputFilter = document.getElementById('input-filter');
    const outputFilter = document.getElementById('output-filter');
    const functionFilter = document.getElementById('function-filter');
    const resetButton = document.getElementById('reset-button');

    let allPapers = []; 

    fetch('papers.json')
        .then(response => response.json())
        .then(data => {
            allPapers = data;
            populateFilters(allPapers);
            renderPapers(allPapers);
        })
        .catch(error => console.error('Error fetching paper data:', error));

    function populateFilters(papers) {
        const origamiTypes = [...new Set(papers.map(p => p['Origami or Kirigami']).filter(Boolean))].sort();
        const materials = [...new Set(papers.map(p => p.Material).filter(Boolean))].sort();
        const manufacturingTypes = [...new Set(papers.map(p => p.Manufacturing).filter(Boolean))].sort();
        const inputs = [...new Set(papers.map(p => p.Input).filter(Boolean))].sort();
        const outputs = [...new Set(papers.map(p => p.Output).filter(Boolean))].sort();
        const functions = [...new Set(papers.map(p => p.Function).filter(Boolean))].sort();

        const populateSelect = (selectElement, values) => {
            values.forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                selectElement.appendChild(option);
            });
        };

        populateSelect(origamiFilter, origamiTypes);
        populateSelect(materialFilter, materials);
        populateSelect(manufacturingFilter, manufacturingTypes);
        populateSelect(inputFilter, inputs);
        populateSelect(outputFilter, outputs);
        populateSelect(functionFilter, functions);
    }

    function renderPapers(papers) {
        papersContainer.innerHTML = ''; 

        if (papers.length === 0) {
            papersContainer.innerHTML = '<p class="no-results">No matching papers found.</p>';
            return;
        }

        papers.forEach(paper => {
            const card = document.createElement('div');
            card.className = 'paper-card';
            card.onclick = () => window.open(paper.DOI, '_blank');

            const cardImage = document.createElement('img');
            cardImage.src = paper.image || 'images/default.jpg'; 
            cardImage.alt = paper.Title;
            cardImage.onerror = () => { cardImage.src = 'images/default.jpg'; };

            const cardTitle = document.createElement('h3');
            cardTitle.textContent = paper.Title;

            const cardMeta = document.createElement('p');
            cardMeta.className = 'meta-info';
            const firstAuthor = paper.Author ? paper.Author.split(',')[0] : 'N/A';
            cardMeta.textContent = `${firstAuthor} et al. | ${paper.Year} | ${paper.Venue}`;
            
            // --- 核心变化：在这里为所有维度创建标签 ---
            const cardTags = document.createElement('div');
            cardTags.className = 'tags';

            if (paper['Origami or Kirigami']) {
                cardTags.innerHTML += `<span class="tag origami-type">${paper['Origami or Kirigami']}</span>`;
            }
            if (paper.Material) {
                cardTags.innerHTML += `<span class="tag material">${paper.Material}</span>`;
            }
            if (paper.Manufacturing) {
                cardTags.innerHTML += `<span class="tag manufacturing">${paper.Manufacturing}</span>`;
            }
            if (paper.Input) {
                cardTags.innerHTML += `<span class="tag input">${paper.Input}</span>`;
            }
            if (paper.Output) {
                cardTags.innerHTML += `<span class="tag output">${paper.Output}</span>`;
            }
            if (paper.Function) {
                cardTags.innerHTML += `<span class="tag function">${paper.Function}</span>`;
            }
            // --- 变化结束 ---

            card.appendChild(cardImage);
            card.appendChild(cardTitle);
            card.appendChild(cardMeta);
            card.appendChild(cardTags);
            
            papersContainer.appendChild(card);
        });
    }

    function applyFilters() {
        // ... (此函数无需改动) ...
        const selectedOrigami = origamiFilter.value;
        const selectedMaterial = materialFilter.value;
        const selectedManufacturing = manufacturingFilter.value;
        const selectedInput = inputFilter.value;
        const selectedOutput = outputFilter.value;
        const selectedFunction = functionFilter.value;

        const filteredPapers = allPapers.filter(paper => {
            const origamiMatch = selectedOrigami === 'all' || paper['Origami or Kirigami'] === selectedOrigami;
            const materialMatch = selectedMaterial === 'all' || paper.Material === selectedMaterial;
            const manufacturingMatch = selectedManufacturing === 'all' || paper.Manufacturing === selectedManufacturing;
            const inputMatch = selectedInput === 'all' || paper.Input === selectedInput;
            const outputMatch = selectedOutput === 'all' || paper.Output === selectedOutput;
            const functionMatch = selectedFunction === 'all' || paper.Function === selectedFunction;
            
            return origamiMatch && materialMatch && manufacturingMatch && inputMatch && outputMatch && functionMatch;
        });

        renderPapers(filteredPapers);
    }
    
    // ... (事件监听器和重置按钮逻辑无需改动) ...
    origamiFilter.addEventListener('change', applyFilters);
    materialFilter.addEventListener('change', applyFilters);
    manufacturingFilter.addEventListener('change', applyFilters);
    inputFilter.addEventListener('change', applyFilters);
    outputFilter.addEventListener('change', applyFilters);
    functionFilter.addEventListener('change', applyFilters);

    resetButton.addEventListener('click', () => {
        origamiFilter.value = 'all';
        materialFilter.value = 'all';
        manufacturingFilter.value = 'all';
        inputFilter.value = 'all';
        outputFilter.value = 'all';
        functionFilter.value = 'all';
        renderPapers(allPapers);
    });
});