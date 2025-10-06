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
            renderTable(allPapers);
        })
        .catch(error => console.error('Error reading paper data:', error));

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

    function renderTable(papers) {
        papersContainer.innerHTML = ''; 

        // Change 1: Update the colspan to 12 for the "no results" message
        if (papers.length === 0) {
            papersContainer.innerHTML = '<tr><td colspan="12">No matching papers found.</td></tr>';
            return;
        }

        papers.forEach((paper, index) => {
            // Change 2: Add the <td> element for Venue data here
            const row = `
                <tr onclick="window.open('${paper.DOI}', '_blank')">
                    <td>${index + 1}</td>
                    <td>${paper.Title || ''}</td>
                    <td>${paper.Author || ''}</td>
                    <td>${paper.Year || ''}</td>
                    <td>${paper.Venue || ''}</td>
                    <td>${paper['Origami or Kirigami'] || ''}</td>
                    <td>${paper.Material || ''}</td>
                    <td>${paper.Manufacturing || ''}</td>
                    <td>${paper.Input || ''}</td>
                    <td>${paper.Output || ''}</td>
                    <td>${paper.Function || ''}</td>
                    <td><a href="${paper.DOI}" target="_blank">Link</a></td>
                </tr>
            `;
            papersContainer.innerHTML += row;
        });
    }

    function applyFilters() {
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

        renderTable(filteredPapers);
    }
    
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
        renderTable(allPapers); // Switched to renderTable to avoid re-filtering an empty set
    });
});