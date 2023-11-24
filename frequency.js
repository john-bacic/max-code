<input type="number" id="numberInput" min="1" max="50" value="1">

    <div id="linkList">
      <a href="#" onclick="displayFrequency(5), populateLottoNumbersTable(5)">5d</a>
      <a href="#" onclick="displayFrequency(8), populateLottoNumbersTable(8)">8d</a>
      <a href="#" onclick="displayFrequency(13), populateLottoNumbersTable(13)">13d</a>
      <a href="#" onclick="displayFrequency(21), populateLottoNumbersTable(21)">21d</a>
      <a href="#" onclick="displayFrequency(34), populateLottoNumbersTable(34)">34d</a>
      <a href="#" onclick="displayFrequency(55), populateLottoNumbersTable(55)">55d</a>
    
      <a href="#" id="allLink" onclick="displayFrequency(lottoMaxWinningNumbers2023.length), populateLottoNumbersTable(lottoMaxWinningNumbers2023.length)">all</a>

    </div>


<script>

function updateAllLinkText() {
    const allLink = document.querySelector('#allLink');
    if (allLink && Array.isArray(lottoMaxWinningNumbers2023)) {
        allLink.textContent = lottoMaxWinningNumbers2023.length + 'd';
    }
}

updateAllLinkText();


///////////// Frequency NAV
let activeLinkIndex = null; // Track the index of the currently active link

/////////////////
function toggleOn(event) {
    event.preventDefault();
    const clickedLink = event.currentTarget;
    const links = document.querySelectorAll('#linkList a');
    const mostFrequentResults = document.getElementById('mostFrequentResults');

    // Determine the index of the clicked link
    const clickedLinkIndex = Array.from(links).indexOf(clickedLink);

    // Toggle the 'on' class and update activeLinkIndex
    if (clickedLink.classList.contains('on')) {
        clickedLink.classList.remove('on');
        mostFrequentResults.style.display = 'none';
        activeLinkIndex = null;
        console.log('Link toggled off:', clickedLink.textContent); // Console log when toggled off

        // Set lastUsedSpan to full length and update frequencies as if 'all' was clicked
        lastUsedSpan = lottoMaxWinningNumbers2023.length;
        populateLottoNumbersTable(rowCount = lottoMaxWinningNumbers2023.length);
        displayFrequency(lastUsedSpan); // Recalculate and display frequencies for 'all'
        

        // Additional code
        updateTextColorForRemainingButtons();
    } else {
        links.forEach(link => link.classList.remove('on'));
        clickedLink.classList.add('on');
        mostFrequentResults.style.display = 'block';
        activeLinkIndex = clickedLinkIndex;
        console.log('Link toggled on:', clickedLink.textContent); // Console log when toggled on

        const rowCount = parseInt(clickedLink.textContent);
        if (!isNaN(rowCount)) {
            displayFrequency(rowCount); // Call displayFrequency with the determined row count
            displayActiveFrequencies();
        }
    }
}

document.querySelectorAll('#linkList a').forEach(link => {
    link.addEventListener('click', toggleOn);
});


///////////////////////////////
function countNumberFrequency(number) {
    // Use lastUsedSpan instead of a passed argument
    return lottoMaxWinningNumbers2023.slice(0, lastUsedSpan).reduce((count, draw) => {
        return count + (draw.numbers.includes(number) ? 1 : 0);
    }, 0);
}

function getNumberFrequencies() {
    // Use lastUsedSpan instead of a passed argument
    const numberFrequencies = {};
    const recentDraws = lottoMaxWinningNumbers2023.slice(0, lastUsedSpan);
    recentDraws.forEach(draw => {
        draw.numbers.forEach(number => {
            numberFrequencies[number] = (numberFrequencies[number] || 0) + 1;
        });
    });
    return numberFrequencies;
   
}


/////////// Display frequency numbers in a table
function displayMostFrequentNumbers(span) {
    // Use the default span (full length) if activeLinkIndex is 6
    if (activeLinkIndex === 6) {
        span = lottoMaxWinningNumbers2023.length;
    }

    const frequencies = getNumberFrequencies(span);
    const activeFrequencies = {};

    const frequencyGroups = Object.keys(frequencies)
        .filter(number => frequencies[number] >= 1)
        .reduce((acc, number) => {
            const freq = frequencies[number];
            if (!acc[freq]) acc[freq] = [];
            acc[freq].push(number);

            if (activeNumbers.has(parseInt(number))) {
                activeFrequencies[number] = freq;
            }

            return acc;
        }, {});

    const sortedGroups = Object.entries(frequencyGroups).sort((a, b) => b[0] - a[0]);

    const resultsContainer = document.getElementById('mostFrequentResults');
    resultsContainer.innerHTML = '<table></table>';
    const table = resultsContainer.querySelector('table');

    sortedGroups.forEach(([freq, numbers]) => {
        const row = table.insertRow();
        
        const frequencyCell = row.insertCell();
        frequencyCell.className = 'frequency-cell';
        frequencyCell.textContent = `${freq}x`;

        const numbersCell = row.insertCell();
        numbersCell.className = 'numbers-cell';

        numbers.forEach(number => {
        const numberSpan = document.createElement('span');
        numberSpan.textContent = number;

    // Check if the number is 'toggled-on' and activeNumbers is not empty
    if (activeNumbers.size > 0 && activeNumbers.has(parseInt(number))) {
        const color = getColor(number);
        numberSpan.style.color = '#000'; // Use a contrasting color for better readability
        numberSpan.style.backgroundColor = color;
        // Set padding based on the number value
        numberSpan.style.padding = number < 10 ? '0.0625rem 0.5rem' : '0.0625rem 0.215rem';
        numberSpan.style.margin = '0 0.125rem'; // Add some margin
        numberSpan.style.borderRadius = '25%'; // Round corners
    } 
    
        numbersCell.appendChild(numberSpan);
        numbersCell.appendChild(document.createTextNode(' ∘ '));
    
});

    // Remove the last separator
        if (numbersCell.lastChild) {
            numbersCell.removeChild(numbersCell.lastChild);
        }
    });
    // Call updateTextColorForRemainingButtons at the end
    updateTextColorForRemainingButtons();
   
   // Display frequencies of active numbers
    displayActiveFrequencies(activeFrequencies);
   
}

// Global variable to store the last used span
let lastUsedSpan;

function displayFrequency(span) {
    const number = parseInt(document.getElementById('numberInput').value, 10);
    if (isNaN(number) || number < 1 || number > 50) {
        alert('Please enter a valid number between 1 and 50.');
        return;
    }

    // Store the span in the global variable
    lastUsedSpan = span;
    console.log("Updated lastUsedSpan:", lastUsedSpan); // Log the updated value

    const frequency = countNumberFrequency(number, span);
    displayMostFrequentNumbers(span); // Call the function to display most frequent numbers
    updateTextColorForRemainingButtons();
       
}
/////////// Show most frequent numbers under active numbers
// Function to add a number to activeNumbers
function addActiveNumber(number, activeFrequencies) {
    activeNumbers.add(number);
    displayActiveFrequencies(activeFrequencies);
}

// Function to remove a number from activeNumbers
function removeActiveNumber(number, activeFrequencies) {
    activeNumbers.delete(number);
    displayActiveFrequencies(activeFrequencies);
}

function displayActiveFrequencies(activeFrequencies) {
    // Check if activeNumbers is empty
    if (activeNumbers.size === 0) {
        for (let i = 1; i <= 7; i++) {
            const resultElement = document.getElementById(`drawResults${i}`);
            if (resultElement) {
                resultElement.textContent = ' • '; // Display '•' when activeNumbers is empty
            }
        }
    } else {
        // Sort activeNumbers and display their frequencies in order
        Array.from(activeNumbers).sort((a, b) => a - b).forEach((number, index) => {
            const freq = activeFrequencies[number];
            const resultElement = document.getElementById(`drawResults${index + 1}`);
            if (resultElement) {
                resultElement.textContent = freq ? `${freq}x` : ' • ';
            }
        });
    }
}

// Call displayActiveFrequencies as needed, for instance, on page load or UI initialization


displayActiveFrequencies();
 


</script>