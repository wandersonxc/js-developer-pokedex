const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const pokeballButtons = document.querySelectorAll('.pokeball-button');
const pokemonDetails = document.getElementById('pokemonDetails');
const closeButton = document.getElementById('closeButton');
const pokemonImage = document.getElementById('pokemonImage');
const pokemonName = document.getElementById('pokemonName');
const pokemonNumber = document.getElementById('pokemonNumber');
const pokemonTypes = document.getElementById('pokemonTypes');
const pokemonAbilities = document.getElementById('pokemonAbilities');
const pokemonStats = document.getElementById('pokemonStats');

const maxRecords = 151;
const limit = 8;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-pokemon-details='${JSON.stringify(pokemon)}'>
            <div class="buttonDetail">
                <button class="pokeball-button">
                    <img src="pokeball.png" alt="Pokeball Icon">
                </button>                
            </div>     
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItems(offset, limit) {
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
        .then((response) => response.json())
        .then((data) => {
            const promises = data.results.map((pokemon) => {
                return fetch(pokemon.url)
                    .then((response) => response.json())
                    .then((pokemonData) => {
                        const convertedPokemon = {
                            number: pokemonData.id,
                            name: pokemonData.name,
                            type: pokemonData.types[0].type.name,
                            types: pokemonData.types.map((typeData) => typeData.type.name),
                            photo: pokemonData.sprites.front_default,
                            abilities: pokemonData.abilities.map((abilityData) => abilityData.ability.name),
                            stats: {}
                        };

                        for (const statData of pokemonData.stats) {
                            convertedPokemon.stats[statData.stat.name] = statData.base_stat;
                        }

                        return convertedPokemon;
                    });
            });

            Promise.all(promises)
                .then((pokemons) => {
                    const newHtml = pokemons.map(convertPokemonToLi).join('');
                    pokemonList.innerHTML += newHtml;
                    if (offset + limit >= maxRecords) {
                        loadMoreButton.disabled = true;
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        })
        .catch((error) => {
            console.error(error);
        });
}

function showPokemonDetails(pokemon) {
    pokemonImage.src = pokemon.photo;
    pokemonName.textContent = pokemon.name;
    pokemonNumber.textContent = `#${pokemon.number}`;
    pokemonTypes.textContent = pokemon.types.join(', ');

    pokemonAbilities.innerHTML = '';
    pokemon.abilities.forEach((ability) => {
        const li = document.createElement('li');
        li.textContent = ability;
        pokemonAbilities.appendChild(li);
    });

    pokemonStats.innerHTML = '';
    for (const stat in pokemon.stats) {
        const li = document.createElement('li');
        li.textContent = `${stat}: ${pokemon.stats[stat]}`;
        pokemonStats.appendChild(li);
    }

    pokemonDetails.style.display = 'block';
}

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordWithNextPage = offset + limit;

    if (qtdRecordWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItems(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItems(offset, limit);
    }
});

closeButton.addEventListener('click', () => {
    pokemonDetails.style.display = 'none';
});

pokemonList.addEventListener('click', (event) => {
    const pokeballButton = event.target.closest('.pokeball-button');
    if (pokeballButton) {
        const listItem = pokeballButton.closest('.pokemon');
        const pokemon = JSON.parse(listItem.getAttribute('data-pokemon-details'));
        if (pokemon) {
            showPokemonDetails(pokemon);
        }
    }
});