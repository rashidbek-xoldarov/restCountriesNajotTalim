const elTemplate = document.querySelector(".template-item").content;
const elList = document.querySelector(".country-list");
const elForm = document.querySelector(".country-form");
const elInput = document.querySelector(".form-input");
const elSelect = elForm.querySelector(".select-form");
const elModal = document.querySelector(".modal-wrapper");
const elModalCloseBtn = elModal.querySelector(".modal__close-btn");
const fragment = new DocumentFragment();
let fullArr = [];

elForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  if (elInput.value.trim()) {
    getCountry(`https://restcountries.com/v3.1/name/${elInput.value.trim()}`);
  } else {
    getCountry("https://restcountries.com/v3.1/all");
  }
});

elSelect.addEventListener("change", function (evt) {
  if (evt.target.value !== "selected") {
    getCountry(
      `https://restcountries.com/v3.1/region/${evt.target.value.trim()}`
    );
  } else {
    getCountry(`https://restcountries.com/v3.1/all`);
  }
});

getCountry("https://restcountries.com/v3.1/all");

async function getCountry(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    fullArr = await data.map((item) => {
      item.id = Math.random();
      return item;
    });
    console.log("work");
    renderCountry(fullArr);
  } catch (error) {
    alert("There is no this country");
  }
}

function renderCountry(arr) {
  elList.innerHTML = "";

  arr.forEach((item) => {
    const template = elTemplate.cloneNode(true);

    template.querySelector(".country-item__image").src = item.flags.svg;
    template.querySelector(".country-item__title").textContent =
      item.name.common;
    template.querySelector(
      ".country-item__about--population"
    ).innerHTML = `<strong>Population:</strong>:${item.population}`;
    template.querySelector(
      ".country-item__about--region"
    ).innerHTML = `<strong>Region:</strong>:${item.region}`;
    template.querySelector(
      ".country-item__about--capital"
    ).innerHTML = `<strong>Capital: </strong>: ${item.capital}`;
    template.querySelector(".country-item__btn").dataset.id = item.id;

    fragment.appendChild(template);
  });
  elList.appendChild(fragment);
}

elList.addEventListener("click", function (evt) {
  evt.preventDefault();
  if (evt.target.matches(".country-item__btn")) {
    const id = evt.target.dataset.id;
    const item = fullArr.find((item) => item.id == id);
    diplayModal(item);
  }
});

function diplayModal(item) {
  console.log(item.currencies);
  elModal.style.display = "flex";
  elModal.querySelector(".modal__img").src = item.flags.svg;
  elModal.querySelector(".modal__title").textContent = item.name.common;
  elModal.querySelector(
    ".modal__info-text--native-name"
  ).innerHTML = `<strong>Native Name:</strong>${
    Object.values(item.name.nativeName)[0].common
  }`;
  elModal.querySelector(
    ".modal__info-text--population"
  ).innerHTML = `<strong>Population:</strong>${item.population}`;
  elModal.querySelector(
    ".modal__info-text--region"
  ).innerHTML = `<strong>Region:</strong>${item.region}`;
  elModal.querySelector(
    ".modal__info-text--sub-region"
  ).innerHTML = `<strong>Sub Region:</strong>${item?.subregion}`;
  elModal.querySelector(
    ".modal__info-text--capital"
  ).innerHTML = `<strong>Capital:</strong>${item?.capital}`;
  elModal.querySelector(
    ".modal__info-text--currencies"
  ).innerHTML = `<strong>Top Level Domain:</strong>${
    Object.values(item?.currencies)[0]["name"]
  }`;
  Object.values(item.languages).forEach((element) => {
    elModal.querySelector(
      ".modal__info-text--language"
    ).innerHTML = `<strong>Language:</strong>${element}`;
  });
  if (item.borders) {
    elModal.querySelector(".modal__borders-list").innerHTML = "";
    item?.borders.forEach((element) => {
      const newLi = document.createElement("li");
      const newBtn = document.createElement("button");

      newBtn.textContent = element;
      newLi.setAttribute("class", "modal__borders-item");
      newBtn.setAttribute("class", "modal__borders-button");
      newLi.appendChild(newBtn);
      elModal.querySelector(".modal__borders-list").appendChild(newLi);
    });
  } else {
    elModal.querySelector(".modal__borders-list").textContent = "No borders";
  }
}

elModalCloseBtn.addEventListener("click", function (evt) {
  evt.preventDefault();
  elModal.style.display = "none";
});
