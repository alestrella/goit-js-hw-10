import debounce from "lodash.debounce";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import { fetchCountries } from "./fetchCountries.js";

const DEBOUNCE_DELAY = 300;
const refs = {
    inputSearch: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

window.addEventListener('load', () =>
    refs.inputSearch.addEventListener('input', debounce(handleInputSearch, DEBOUNCE_DELAY))
);

function handleInputSearch(evt) {
    const searchValue = evt.target.value.toLowerCase().trim();

    fetchCountries(searchValue)
        .then(dislaySearchResult)
        .catch(error => Notify.failure('Oops, there is no country with that name'));
}

function dislaySearchResult(countriesArr) {
    console.log(countriesArr.length);
    
    clearContent();
    if (countriesArr.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
    }
    if (countriesArr.length === 1) {
        const foundCountry = countriesArr[0];
        generateCountryMarkup(foundCountry);
        return;
    }
    generateListMarkup(countriesArr);
}

function generateListMarkup(countriesArr) {
    const markupList = countriesArr.map(country => {
        const li = document.createElement('li');
        li.innerHTML = `<img src=${country.flags.svg} alt="flag of ${country.name.official}" width="20"></img> ${country.name.official}`;
        return li;
    });
    refs.countryList.append(...markupList);
}

function generateCountryMarkup(country) {
    refs.countryInfo.innerHTML =
        `<h2><img src=${country.flags.svg} alt="flag of ${country.name.official}" width="40"> ${country.name.official}</h2>
        <p><b>Capital:</b> ${country.capital}</p>
        <p><b>Population:</b> ${country.population}</p>
        <p><b>Languages:</b> ${Object.values(country.languages).join(', ')}</p>`
}

function clearContent() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
}