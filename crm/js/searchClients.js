import { getClients } from "./clientApi.js";

export const searchClients = () => {
  const findList = document.querySelector('.find-list'),
    input = document.querySelector('.header__input'),
    findItem = document.createElement('li'),
    findLink = document.createElement('a');

  findItem.classList.add('find-list__item');
  findLink.classList.add('find-list__link');

  findItem.append(findLink);
  findList.append(findItem);

  findList.style.display = 'none';

  let timeout;
  let currentFocus;

  input.addEventListener('input', () => {
    clearInterval(timeout);
    timeout = setTimeout(workSearch, 300);

    async function workSearch() {
      const response = await getClients();
      currentFocus = -1;
      findList.style.display = 'block';
      findList.textContent = '';
      let searchClients = response.filter(client => client.name.includes(input.value) || client.surname.includes(input.value) || client.lastName.includes(input.value));
      if (searchClients.length === 0) {
        findItem.classList.add('no-found');
        findItem.textContent = 'По Вашему запросу клиент не найден';
        findList.append(findItem);
      } else {
        for (let i = 0; i < searchClients.length; i++) {
          let findItem = document.createElement('li');
          let findLink = document.createElement('a');

          findItem.classList.add('find-list__item');
          findLink.classList.add('find-list__link');

          findLink.setAttribute('href', `#${searchClients[i].id}`);

          findLink.textContent = searchClients[i].surname + ' ' + searchClients[i].name + ' ' + searchClients[i].lastName;

          findLink.addEventListener('click', () => {
            input.value = '';
            findList.style.display = 'none';
            let client = document.getElementById(`${searchClients[i].id}`);
            client.classList.add('find-list__client');
            setTimeout(() => {
              client.classList.remove('find-list__client');
            }, 2000);
          });

          findItem.append(findLink)
          findList.append(findItem);
        }
      }
      if (input.value.length === 0) {
        findList.style.display = 'none';
        findList.textContent = '';
      }
    }
  });

  input.addEventListener('keydown', (e) => {
    var x = document.getElementById('search-list');
    if (x) x = x.getElementsByTagName('a');
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].parentNode.classList.add('autocomplete-active');

  }

  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].parentNode.classList.remove('autocomplete-active');
    }
  }
}
