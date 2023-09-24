const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const buttonDetail = document.getElementById('buttonDetail')

const maxRecords = 151;
const limit = 10;
let offset = 0;


function loadPokemonItens (offset,limit) {
    pokeApi.getPokemons(offset,limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => `
            <li class="pokemon ${pokemon.type}">

            <div class="buttonDetail">
                <button id="pokeballButton" class="pokeball-button">
                    <img src="pokeball.png" alt="Pokeball Icon">
                </button>
            </div>

     
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type)=> `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
        
                    <img src="${pokemon.photo}" 
                                alt="${pokemon.name}">
                </div>

            </li>
        `).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset,limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordWithNextPage = offset + limit

    if (qtdRecordWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset,newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset,limit)
    }
})

function pokemonDetailClick(pokemon) {
    console.log(loadPokemonDetails)
    console.log(pokemon)
}