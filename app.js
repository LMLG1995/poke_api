const pokeInfo = document.querySelector('#pokeInfo');
const input = document.querySelector('#pokeName');
const text = document.querySelector('#pokeText');
const image = document.querySelector('#pokeImage');
const suggestionsDiv = document.querySelector('#suggestions');
const pokeUrl = 'https://pokeapi.co/api/v2/pokemon/';

let allPokemonNames = [];

async function getAllPokemonNames() {
    try {
        let response = await fetch(`${pokeUrl}?limit=1000`);
        if (!response.ok) {
            throw new Error('No se pudieron obtener los nombres de los Pokémon.');
        }
        let data = await response.json();
        allPokemonNames = data.results.map(pokemon => pokemon.name.toLowerCase());
    } catch (error) {
        console.error(error);
    }
}

async function getPokemonSuggestions(query) {
    const suggestions = allPokemonNames.filter(name => name.startsWith(query.toLowerCase()));
    return suggestions;
}

function displaySuggestions(suggestions) {
    suggestionsDiv.innerHTML = '';
    suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.textContent = suggestion;
        suggestionElement.classList.add('suggestion');
        suggestionsDiv.appendChild(suggestionElement);
    });
}

async function handleInputChange() {
    const query = input.value.trim();
    if (query === '') {
        suggestionsDiv.innerHTML = '';
        return;
    }
    const suggestions = await getPokemonSuggestions(query);
    displaySuggestions(suggestions);
}

suggestionsDiv.addEventListener('click', function(event) {
    if (event.target.classList.contains('suggestion')) {
        input.value = event.target.textContent;
        suggestionsDiv.innerHTML = '';
    }
});

input.addEventListener('keyup', handleInputChange);

const submit = document.querySelector("#pokeSubmit");
submit.addEventListener("click", function (e) {
    e.preventDefault();
    pokeGet(input.value);
});

async function pokeGet(name) {
    const errorMessageElement = document.getElementById('error-message');
    try {
        let response = await fetch(`${pokeUrl}${name.toLowerCase()}`);
        if (!response.ok) {
            throw new Error('No se encontró el Pokémon.');
        }
        let data = await response.json();
        console.log(data);
        text.innerHTML = data.name.toUpperCase();
        image.src = data.sprites.front_default;
        errorMessageElement.textContent = ''; 
    } catch (error) {
        console.error(error);
        errorMessageElement.textContent = error.message; 
    }
}

getAllPokemonNames();
