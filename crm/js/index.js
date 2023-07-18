import { sendClientData, getClients } from "./clientApi.js";
import { createClientItem } from "./createClientItem.js";
import { createPreloader } from "./preloader.js";
import { searchClients } from "./searchClients.js";
import { sortTable } from "./sortClients.js";
import { validateClientContact, validateClientForm } from "./validate.js";

// Создаём header
function createClientsHeader() {
  const container = document.createElement('div'),
    header = document.createElement('header'),
    logo = document.createElement('a'),
    logoImg = document.createElement('img'),
    form = document.createElement('form'),
    input = document.createElement('input'),
    wrapper = document.createElement('div'),
    inner = document.createElement('div'),
    findList = document.createElement('ul');

  container.classList.add('header__container');
  header.classList.add('header');
  logo.classList.add('logo', 'header__logo');
  logoImg.classList.add('logo__img');
  logoImg.src = 'img/logo.svg';
  logoImg.alt = 'Логотип';
  form.classList.add('header__form');
  input.classList.add('header__input');
  input.placeholder = 'Введите запрос';
  wrapper.classList.add('header__wrapper');
  inner.classList.add('header__inner');
  findList.classList.add('find-list', 'hide', 'list-reset');
  findList.setAttribute('id', 'search-list')

  logo.append(logoImg);
  inner.append(input, findList);
  form.append(inner);
  container.append(logo, form);
  header.append(container)
  document.body.append(header);

  return header;
};

// Создаём section  с клиентами
function createClientsSection() {
  const main = document.createElement('main'),
    section = document.createElement('section'),
    container = document.createElement('div'),
    h1 = document.createElement('h1'),
    tableWrapper = document.createElement('div'),
    table = document.createElement('table'),
    tbody = document.createElement('tbody'),
    thead = document.createElement('thead'),
    theadTr = document.createElement('tr'),
    theadId = document.createElement('th'),
    theadName = document.createElement('th'),
    theadDate = document.createElement('th'),
    theadChange = document.createElement('th'),
    theadContact = document.createElement('th'),
    theadActions = document.createElement('th'),
    sortSpan = document.createElement('span'),
    btnAddClient = document.createElement('button'),
    btnAddClientSvg = document.createElement('span');

  main.classList.add('main');
  section.classList.add('clients');
  container.classList.add('container');
  tableWrapper.classList.add('clients__wrapper');
  h1.classList.add('clients__title');
  table.classList.add('clients__table');
  tbody.classList.add('clients__tbody');
  thead.classList.add('clients__head', 'head-info');
  theadId.classList.add('head-info__item', 'head-info__item--id', 'sort-up', 'active');
  theadName.classList.add('head-info__item', 'head-info__item--name', 'sort-down');
  theadDate.classList.add('head-info__item', 'head-info__item--date', 'sort-down');
  theadChange.classList.add('head-info__item', 'head-info__item--change', 'sort-down');
  theadContact.classList.add('head-info__item', 'head-info__item--contact');
  theadActions.classList.add('head-info__item', 'head-info__item--actions');
  sortSpan.classList.add('head-info__sort');
  btnAddClient.classList.add('clients__btn', 'btn-reset');
  btnAddClientSvg.classList.add('clients__svg');

  h1.textContent = 'Клиенты';
  theadId.textContent = 'ID';
  theadId.setAttribute('data-type', 'id');
  theadName.setAttribute('data-type', 'text');
  theadDate.setAttribute('data-type', 'create');
  theadChange.setAttribute('data-type', 'update');
  theadName.textContent = 'Фамилия Имя Отчество';
  sortSpan.textContent = 'А-Я'
  theadDate.textContent = 'Дата и время создания';
  theadChange.textContent = 'Последние изменения';
  theadContact.textContent = 'Контакты';
  theadActions.textContent = 'Действия';
  btnAddClient.textContent = 'Добавить клиента';
  btnAddClientSvg.innerHTML = `<svg width="23" height="16" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5 8C16.71 8 18.5 6.21 18.5 4C18.5 1.79 16.71 0 14.5 0C12.29 0 10.5 1.79 10.5 4C10.5 6.21 12.29 8 14.5 8ZM5.5 6V3H3.5V6H0.5V8H3.5V11H5.5V8H8.5V6H5.5ZM14.5 10C11.83 10 6.5 11.34 6.5 14V16H22.5V14C22.5 11.34 17.17 10 14.5 10Z" fill="#9873FF"/>
    </svg>`;

  const sortItems = [theadId, theadName, theadDate, theadChange];

  for (const item of sortItems) {
    item.addEventListener('click', () => {
      if (item.classList.contains('sort-down')) {
        item.classList.remove('sort-down');
        item.classList.add('sort-up');

      } else {
        item.classList.remove('sort-up');
        item.classList.add('sort-down');
      }

      let sort = document.getElementsByClassName('head-info__item');
      for (let i = 0; i < sort.length; i++) {
        [].forEach.call(sort, ((elem) => {
          elem.classList.remove('active');
          item.classList.add('active');
        }));
      }
    });
  }

  btnAddClient.addEventListener('click', () => {
    document.body.append(addClientModal());
  });

  tableWrapper.append(table);
  table.append(thead, tbody);
  thead.append(theadTr)
  theadTr.append(theadId, theadName, theadDate, theadChange, theadContact, theadActions);
  theadName.append(sortSpan);
  tbody.append(createPreloader());
  btnAddClient.append(btnAddClientSvg);
  container.append(h1, tableWrapper, btnAddClient);
  section.append(container);
  main.append(section);
  document.body.append(main);

  return {
    main,
    table,
    tbody
  }
};

// Создаём модальное окно с добавление нового клиента
function createModalForm() {
  const titleModal = document.createElement('h2'),
    closeModal = document.createElement('button'),
    formModul = document.createElement('form'),
    labelName = document.createElement('label'),
    inputName = document.createElement('input'),
    labelSurname = document.createElement('label'),
    inputSurname = document.createElement('input'),
    labelMiddleName = document.createElement('label'),
    inputMiddleName = document.createElement('input'),
    requaredName = document.createElement('span'),
    requaredSurname = document.createElement('span'),
    addContactBtn = document.createElement('button'),
    saveBtn = document.createElement('button'),
    cancelBtn = document.createElement('button'),
    contactsBlock = document.createElement('div'),
    formFloatingName = document.createElement('div'),
    formFloatingSurname = document.createElement('div'),
    formFloatingMiddleName = document.createElement('div'),
    errorBlock = document.createElement('p'),
    errorText = document.createElement('span'),
    errorSurname = document.createElement('span'),
    errorName = document.createElement('span'),
    errorContacts = document.createElement('span'),
    errorContactValue = document.createElement('span'),
    saveSpinner = document.createElement('span');

  titleModal.classList.add('modal__title');
  closeModal.classList.add('modal__close', 'btn-reset');
  formModul.classList.add('modal__form');
  labelName.classList.add('modal__label');
  inputName.classList.add('modal__input');
  labelSurname.classList.add('modal__label');
  inputSurname.classList.add('modal__input');
  labelMiddleName.classList.add('modal__label');
  inputMiddleName.classList.add('modal__input');
  requaredName.classList.add('modal__label');
  requaredSurname.classList.add('modal__label');
  addContactBtn.classList.add('modal__btn-contact', 'modal__btn-contact--active', 'btn-reset');
  saveBtn.classList.add('modal__btn-save', 'btn-reset', 'site-btn');
  cancelBtn.classList.add('modal__btn-cancel', 'btn-reset');
  contactsBlock.classList.add('modal__block');
  formFloatingName.classList.add('form-floating');
  formFloatingSurname.classList.add('form-floating');
  formFloatingMiddleName.classList.add('form-floating');
  errorBlock.classList.add('modal__error');
  saveSpinner.classList.add('modal__spinner');

  labelName.for = 'floatingName';
  labelSurname.for = 'floatingSurname';
  labelMiddleName.for = 'floatingMiddleName';
  inputName.id = 'floatingName';
  inputSurname.id = 'floatingSurname';
  inputMiddleName.id = 'floatingMiddleName';
  inputName.type = 'text';
  inputSurname.type = 'text';
  inputMiddleName.type = 'text';
  inputName.placeholder = 'Имя';
  inputSurname.placeholder = 'Фамилия';
  inputMiddleName.placeholder = 'Отчество';
  titleModal.textContent = 'Новый клиент';
  labelName.textContent = 'Имя';
  labelSurname.textContent = 'Фамилия';
  labelMiddleName.textContent = 'Отчество';
  addContactBtn.textContent = 'Добавить контакт';
  saveBtn.textContent = 'Сохранить';
  cancelBtn.textContent = 'Отмена';
  requaredName.textContent = '*';
  requaredSurname.textContent = '*';
  errorText.id = 'errorText';
  errorSurname.id = 'errorSurname';
  errorName.id = 'errorName';
  errorContacts.id = 'errorContacts';
  errorContactValue.id = 'errorContactValue';
  saveSpinner.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.00008 6.03996C1.00008 8.82344 3.2566 11.08 6.04008 11.08C8.82356 11.08 11.0801 8.82344 11.0801 6.03996C11.0801 3.25648 8.82356 0.999956 6.04008 0.999956C5.38922 0.999956 4.7672 1.1233 4.196 1.348" stroke="#B89EFF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
    </svg>`;

  labelSurname.append(requaredSurname);
  labelName.append(requaredName);
  formFloatingSurname.append(inputSurname, labelSurname);
  formFloatingName.append(inputName, labelName);
  formFloatingMiddleName.append(inputMiddleName, labelMiddleName);
  contactsBlock.append(addContactBtn);
  errorBlock.append(errorText, errorSurname, errorName, errorContacts, errorContactValue);
  saveBtn.append(saveSpinner);
  formModul.append(formFloatingSurname, formFloatingName, formFloatingMiddleName, contactsBlock, errorBlock, saveBtn, cancelBtn);

  addContactBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const contactsItems = document.getElementsByClassName('contact');

    if (contactsItems.length < 9) {
      const contactItem = createContact();
      addContactBtn.before(contactItem.contact);
      if (contactsItems.length >= 7) {
        document.querySelector('.site-modal__content').style.top = '75%';
      } else {
        document.querySelector('.site-modal__content').style.top = '53%';
      }
    } else {
      const contactItem = createContact();
      addContactBtn.before(contactItem.contact);
      addContactBtn.classList.remove('modal__btn-contact--active');
    };
  });

  return {
    formModul,
    closeModal,
    titleModal,
    cancelBtn,
    inputSurname,
    inputName,
    inputMiddleName,
    labelSurname,
    labelName,
    labelMiddleName,
    contactsBlock,
    addContactBtn
  };
};

export const createForm = createModalForm();

// Функция открытия модального окна
function addClientModal() {
  const modal = document.createElement('div'),
    modalContent = document.createElement('div');

  modal.classList.add('modal', 'modal--active', 'site-modal');
  modalContent.classList.add('modal__content', 'modal--active', 'site-modal__content');
  createForm.formModul.classList.add('add-client');

  modalContent.append(createForm.closeModal, createForm.titleModal, createForm.formModul);
  modal.append(modalContent);

  document.body.append(modal);

  createForm.formModul.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateClientForm()) {
      return;
    };

    const select = document.querySelectorAll('.contact__select'),
      contactValues = document.querySelectorAll('.contact__input');
    let contacts = [],
      clientObj = {};

    for (let i = 0; i < select.length; i++) {

      if (!validateClientContact(select[i].value, contactValues[i])) {
        return;
      };

      contacts.push({
        type: select[i].value,
        value: contactValues[i].value
      });
    };

    clientObj.surname = createForm.inputSurname.value;
    clientObj.name = createForm.inputName.value;
    clientObj.lastName = createForm.inputMiddleName.value;
    clientObj.contacts = contacts;
    console.log(clientObj);

    const spinner = document.querySelector('.modal__spinner');

    try {
      spinner.style.display = 'block';
      const data = await sendClientData(clientObj, 'POST');
      setTimeout(() => {
        document.querySelector('.clients__tbody').append(createClientItem(data));
        document.querySelector('.modal').remove();
      }, 1500);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => spinner.style.display = 'block', 1500);
    }
  });

  createForm.closeModal.addEventListener('click', () => {
    modal.remove();
  });

  createForm.cancelBtn.addEventListener('click', () => {
    modal.remove();
  });

  document.addEventListener('click', (e) => {
    if (e.target == modal) {
      modal.remove();
    };
  });

  return modal;
};

// Создание блока "добавить контакт"
function createContact() {
  const contact = document.createElement('div'),
    contactSelect = document.createElement('select'),
    contactOptionTel = document.createElement('option'),
    contactOptionOther = document.createElement('option'),
    contactOptionEmail = document.createElement('option'),
    contactOptionVk = document.createElement('option'),
    contactOptionFb = document.createElement('option'),
    contactInput = document.createElement('input'),
    contactBtnDelete = document.createElement('button'),
    contactDeleteTooltip = document.createElement('span');

  contact.classList.add('contact');
  contactSelect.classList.add('contact__select');
  contactOptionTel.classList.add('contact__option');
  contactOptionOther.classList.add('contact__option');
  contactOptionEmail.classList.add('contact__option');
  contactOptionVk.classList.add('contact__option');
  contactOptionFb.classList.add('contact__option');
  contactInput.classList.add('contact__input');
  contactBtnDelete.classList.add('btn-reset', 'contact__btn');
  contactDeleteTooltip.classList.add('contact__tooltip', 'site-tooltip');

  contactSelect.name = 'select';
  contactOptionTel.value = 'Телефон';
  contactOptionEmail.value = 'Email';
  contactOptionVk.value = 'Vk';
  contactOptionFb.value = 'Facebook';
  contactOptionOther.value = 'Другое';
  contactOptionTel.textContent = 'Телефон';
  contactOptionOther.textContent = 'Другое';
  contactOptionEmail.textContent = 'Email';
  contactOptionVk.textContent = 'Vk';
  contactOptionFb.textContent = 'Facebook';
  contactInput.placeholder = 'Введите данные контакта';
  contactBtnDelete.innerHTML = `<svg width="27" height="37" viewBox="0 0 27 37" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="26" height="36" fill="#E7E5EB" stroke="#C8C5D1"/>
    <g clip-path="url(#clip0_121_1081)">
    <path d="M14 13C10.682 13 8 15.682 8 19C8 22.318 10.682 25 14 25C17.318 25 20 22.318 20 19C20 15.682 17.318 13 14 13ZM14 23.8C11.354 23.8 9.2 21.646 9.2 19C9.2 16.354 11.354 14.2 14 14.2C16.646 14.2 18.8 16.354 18.8 19C18.8 21.646 16.646 23.8 14 23.8ZM16.154 16L14 18.154L11.846 16L11 16.846L13.154 19L11 21.154L11.846 22L14 19.846L16.154 22L17 21.154L14.846 19L17 16.846L16.154 16Z" fill="#B0B0B0"/>
    </g>
    <defs>
    <clipPath id="clip0_121_1081">
    <rect width="16" height="16" fill="white" transform="translate(6 11)"/>
    </clipPath>
    </defs>
    </svg>`;
  contactDeleteTooltip.textContent = 'Удалить контакт';

  contactBtnDelete.addEventListener('click', (e) => {
    e.preventDefault();
    contact.remove();
    document.querySelector('.modal__btn-contact').classList.add('modal__btn-contact--active')
  });

  contactSelect.append(contactOptionTel, contactOptionEmail, contactOptionVk, contactOptionFb, contactOptionOther);
  contactBtnDelete.append(contactDeleteTooltip)
  contact.append(contactSelect, contactInput, contactBtnDelete);

  return {
    contact,
    contactSelect,
    contactInput,
    contactBtnDelete,
  };
};

// Создаём модальное окно удалить клиента
export const deleteClientModal = () => {
  const deleteModalContent = document.createElement('div'),
    deleteModal = document.createElement('div'),
    modalClose = document.createElement('button'),
    deleteModalTitle = document.createElement('h2'),
    deleteModalText = document.createElement('p'),
    deleteModalDelete = document.createElement('button'),
    deleteModalBack = document.createElement('button'),
    deleteSpinner = document.createElement('span');

  deleteModal.classList.add('delete-modal', 'site-modal', 'modal--active');
  deleteModalContent.classList.add('delete-modal__content', 'site-modal__content', 'modal--active');
  deleteModalTitle.classList.add('delete-modal__title', 'modal__title');
  deleteModalText.classList.add('delete-modal__text');
  deleteModalDelete.classList.add('delete-modal__delete', 'site-btn', 'btn-reset');
  deleteModalBack.classList.add('delete-modal__back', 'btn-reset');
  modalClose.classList.add('modal__close', 'btn-reset');
  deleteSpinner.classList.add('modal__spinner');

  deleteModalTitle.textContent = 'Удалить клиента';
  deleteModalText.textContent = 'Вы действительно хотите удалить данного клиента?';
  deleteModalDelete.textContent = 'Удалить';
  deleteModalBack.textContent = 'Отмена';
  deleteSpinner.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.00008 6.03996C1.00008 8.82344 3.2566 11.08 6.04008 11.08C8.82356 11.08 11.0801 8.82344 11.0801 6.03996C11.0801 3.25648 8.82356 0.999956 6.04008 0.999956C5.38922 0.999956 4.7672 1.1233 4.196 1.348" stroke="#B89EFF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
    </svg`;

  deleteModalDelete.append(deleteSpinner);
  deleteModalContent.append(modalClose, deleteModalTitle, deleteModalText, deleteModalDelete, deleteModalBack);
  deleteModal.append(deleteModalContent);

  modalClose.addEventListener('click', () => deleteModal.remove());
  deleteModalBack.addEventListener('click', () => deleteModal.remove());

  window.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      deleteModal.remove();
    };
  });

  return {
    deleteModal,
    deleteModalContent,
    deleteModalDelete,
    deleteSpinner
  };
};

// Создание модального окна "изменить данные"
export const changeClientModal = (data) => {
  const changeModal = document.createElement('div'),
    changeModalContent = document.createElement('div'),
    createForm = createModalForm(),
    titleId = document.createElement('span');

  changeModal.classList.add('change-modal', 'site-modal', 'modal--active');
  changeModalContent.classList.add('change-modal__content', 'site-modal__content', 'modal--active');
  titleId.classList.add('modal__id');

  createForm.titleModal.textContent = 'Изменить данные';
  createForm.cancelBtn.textContent = 'Удалить клиента';
  titleId.textContent = 'ID: ' + data.id.substr(0, 6);

  createForm.cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const deleteModal = deleteClientModal();
    document.body.append(deleteModal.deleteModal);

    import('./clientApi.js').then(({ deleteClientItem }) => {
      deleteModal.deleteModalDelete.addEventListener('click', () => {
        try {
          deleteModal.deleteSpinner.style.display = 'block';

          setTimeout(() => {
            deleteClientItem(data.id);
            document.getElementById(data.id).remove();
            deleteModal.deleteModal.remove();
            document.querySelector('.change-modal').remove();
          }, 1500);
        } catch (error) {
          console.log(error);
        } finally {
          setTimeout(() => deleteModal.deleteSpinner.style.display = 'none', 1500);
        }
      });
    });
  });

  createForm.closeModal.addEventListener('click', () => {
    changeModal.remove();
  });

  createForm.inputSurname.value = data.surname;
  createForm.inputName.value = data.name;
  createForm.inputMiddleName.value = data.lastName;

  for (const contact of data.contacts) {
    const changeContact = createContact();

    changeContact.contactSelect.value = contact.type;
    changeContact.contactInput.value = contact.value;

    createForm.addContactBtn.before(changeContact.contact);
  };

  if (data.contacts.length == 10) {
    createForm.addContactBtn.classList.remove('modal__btn-contact--active');
  };

  createForm.formModul.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateClientForm()) {
      return;
    };

    const contactTypes = document.querySelectorAll('.contact__select'),
      contactValues = document.querySelectorAll('.contact__input');
    let contacts = [];
    let client = {};

    for (let i = 0; i < contactTypes.length; i++) {
      if (!validateClientContact(contactTypes[i].value, contactValues[i])) {
        return;
      };

      contacts.push({
        type: contactTypes[i].value,
        value: contactValues[i].value
      });
    };

    client.surname = createForm.inputSurname.value;
    client.name = createForm.inputName.value;
    client.lastName = createForm.inputMiddleName.value;
    client.contacts = contacts;

    const spinner = document.querySelector('.modal__spinner');

    try {
      spinner.style.display = 'block';
      const changeData = await sendClientData(client, 'PATCH', data.id);
      setTimeout(() => {
        document.getElementById(changeData.id).rыemove();
        document.querySelector('.clients__tbody').append(createClientItem(changeData));
        document.querySelector('.modal').remove();
      }, 1500);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => spinner.style.display = 'block', 1500);
    }
  });


  createForm.titleModal.append(titleId);
  changeModalContent.append(createForm.closeModal, createForm.titleModal, createForm.formModul);
  changeModal.append(changeModalContent);

  document.addEventListener('click', (e) => {
    if (e.target == changeModal) {
      changeModal.remove();
    };
  });

  return {
    changeModal,
    changeModalContent,
    titleId

  };
};

const createApp = async () => {
  createClientsHeader();
  createClientsSection();
  const preloader = document.querySelector('.preloader');

  try {
    const clients = await getClients();
    searchClients(clients);

    for (const client of clients) {
      document.querySelector('.clients__tbody').append(createClientItem(client));
    };
  } catch (error) {
    console.log(error);
  } finally {
    setTimeout(() => preloader.remove(), 1500);
  }

};

createApp();
document.addEventListener('DOMContentLoaded', sortTable());

