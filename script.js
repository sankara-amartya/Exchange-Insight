const apiKey = ' c02561725ea09140c2707a58'; 
const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest`;
const newsApiKey = 'c3bc73bf8b16455b81ee69560b22caec';
const newsContainer = document.getElementById('news-container');
const amountInput = document.querySelector('.amount input');
const fromSelect = document.querySelector('.from select');
const toSelect = document.querySelector('.to select');
const convertButton = document.getElementById('convert-button');
const afterConversionDiv = document.querySelector('.after-conversion');
const conversionResultElement = document.getElementById('conversion-result');
const exchangeButton = document.querySelector('.picex img');


async function fetchCurrencies() {
    try {
        const response = await fetch(`${apiUrl}/USD`); 
        const data = await response.json();

        const currencies = Object.keys(data.conversion_rates);
        populateDropdown(fromSelect, currencies);
        populateDropdown(toSelect, currencies);

      
        fromSelect.value = 'USD';
        toSelect.value = 'EUR';
    } catch (error) {
        console.error('Error fetching currencies:', error);
    }
}


function populateDropdown(selectElement, currencies) {
    selectElement.innerHTML = currencies
        .map(currency => `<option value="${currency}">${currency}</option>`)
        .join('');
}


async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromSelect.value;
    const toCurrency = toSelect.value;

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${fromCurrency}`);
        const data = await response.json();

        const rate = data.conversion_rates[toCurrency];
        const convertedAmount = (amount * rate).toFixed(2);

        showConversionResult(amount, fromCurrency, convertedAmount, toCurrency);
    } catch (error) {
        console.error('Error converting currency:', error);
    }
}


function showConversionResult(amount, fromCurrency, convertedAmount, toCurrency) {
    conversionResultElement.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    afterConversionDiv.style.display = 'block'; 
}


function swapCurrencies() {
    const fromValue = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = fromValue;
}


fromSelect.addEventListener('change', () => (afterConversionDiv.style.display = 'none'));
toSelect.addEventListener('change', () => (afterConversionDiv.style.display = 'none'));
amountInput.addEventListener('input', () => (afterConversionDiv.style.display = 'none'));
exchangeButton.addEventListener('click', swapCurrencies);
convertButton.addEventListener('click', convertCurrency);


async function fetchCurrencyNews() {
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=currency&sortBy=publishedAt&apiKey=${newsApiKey}`);
        const data = await response.json();
        
        displayNews(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}


function displayNews(articles) {
    if (articles.length === 0) {
        newsContainer.innerHTML = '<p>No news available.</p>';
        return;
    }

    newsContainer.innerHTML = articles
        .slice(0, 3)
        .map(article => `
            <div class="news-article">
                <h4><a href="${article.url}" target="_blank">${article.title}</a></h4>
                <p>${article.description || 'No further details available.'}</p>
                <small>${new Date(article.publishedAt).toLocaleString()}</small>
            </div>
        `)
        .join('');
}


fetchCurrencies();
fetchCurrencyNews();
