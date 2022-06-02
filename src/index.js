import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './fetchCountries';

const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('input#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const countryName = e.target.value.trim();
  cleanMarkup();

  if (countryName === '') {
    return;
  }

  fetchCountries(countryName)
    .then(countries => {
      if (countries.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length === 1) {
        const country = countries[0];
        renderCountryCard(country);
      } else {
        renderCountriesList(countries);
      }
    })
    .catch(error => Notify.failure('Oops, there is no country with that name'));
}

function cleanMarkup() {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
}

function renderCountryCard({ name, capital, population, flag, languages }) {
  const markupCountryCard = `<div class="country-header">
          <img class="flag" src="${flag}" alt="${name} flag" width='60' height='30'></>
          <span><b>${name}</b></span>
      </div>
      <p><b>Capital:</b> ${capital}</p>
      <p><b>Population:</b> ${population}</p>
      <p><b>Languages:</b> ${languages.map(language => language.name)}</p>`;
  refs.info.innerHTML = markupCountryCard;
}

function renderCountriesList(countries) {
  const markupCountriesList = countries
    .map(
      country => `<li class="countries-item">
        <img class="flags-img" src="${country.flag}" alt="${country.name} flag" width="60" height="30"></>
        <span>${country.name}</span>
        </li>`
    )
    .join('');
  refs.list.innerHTML = markupCountriesList;
}
