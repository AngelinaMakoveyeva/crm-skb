export function validateClientForm() {
  const userSurname = document.getElementById('floatingSurname'),
    userName = document.getElementById('floatingName'),
    errorText = document.getElementById('errorText'),
    errorSurname = document.getElementById('errorSurname'),
    errorName = document.getElementById('errorName'),
    errorContacts = document.getElementById('errorContacts'),
    errorContactValue = document.getElementById('errorContactValue'),
    validateArr = [errorText, errorSurname, errorName, errorContacts, errorContactValue],
    regx = /^[а-яА-ЯёЁ]+$/g;

  const onInputValue = input => {
    input.addEventListener('input', () => {
      input.style.borderColor = 'var(--color-grey)';
      for (const item of validateArr) {
        item.textContent = '';
      };
    });

    input.oncut = input.oncopy = input.onpaste = () => {
      input.style.borderColor = 'var(--color-grey)';

      for (const item of validateArr) {
        item.textContent = '';
      };
    };

    input.onchange = () => {
      input.style.borderColor = 'var(--color-grey)';

      if (userSurname.value && userName.value) {
        for (const item of validateArr) {
          item.textContent = '';
        };
      };
    };
  };
  onInputValue(userSurname);
  onInputValue(userName);

  const checkRequiredName = (input, message, name) => {
    if (!input.value) {
      input.style.borderColor = 'var(--color-red)';
      message.textContent = `Введите ${name} клиента!`;
      return false;
    } else {
      message.textContent = '';
    }
    return true;
  };

  const checkByRegexp = (input, regx) => {

    if (/^[а-яА-ЯёЁ]+$/g.test(input.value)) {
      return true;
    } else {
      input.style.borderColor = 'var(--color-red)';
      errorText.textContent = 'Недопустимые символы!';
      return false;
    }
  };

  if (!checkRequiredName(userSurname, errorSurname, 'Фамилию')) { return false };
  if (!checkRequiredName(userName, errorName, 'Имя')) { return false };
  if (!checkByRegexp(userSurname, regx)) { return false };
  if (!checkByRegexp(userName, regx)) { return false };

  return true;

};

export const validateClientContact = (contactType, contactInput) => {
  const writeValue = document.getElementById('errorName');
  const onlyNumbers = /^[0-9]+$/g;
  const onlyEmail = /^[a-zA-Z|@|.]+$/g;


  // if (contactType == 'Телефон') {
  //   contactInput.placeholder = '+7(000) 000-00-00';
  //   console.log(contactInput.placeholder);
  // let maskOptions = {
  //   mask: '+{7}(000)000-00-00',
  //   // lazy: false
  // }

  // let mask = new IMask(contactInput, maskOptions);
  // }
  const onInputValue = input => {
    input.addEventListener('input', () => {
      input.style.borderColor = 'var(--color-grey)';
      writeValue.textContent = '';
    });

    input.oncut = input.oncopy = input.onpaste = () => {
      input.style.borderColor = 'var(--color-grey)';
      writeValue.textContent = '';
    };
  };

  const showErrorMessage = (message, block, input) => {
    block.textContent = message;
    input.style.borderColor = 'var(--color-red)';
  };

  onInputValue(contactInput);

  if (!contactInput.value) {
    showErrorMessage('Заполните все поля контактов!', writeValue, contactInput);
    return false;
  }

  switch (contactType) {
    case 'Email':
      if (!(/^[a-zA-Z|@|.]+$/g.test(contactInput.value))) {
        showErrorMessage('Неправильный Email!', writeValue, contactInput);
        return false;
      } return true;
    case 'Телефон':
      if (!(/^[0-9]/ + /$/g.test(contactInput.value))) {
        showErrorMessage('Допустимы только цифры!', writeValue, contactInput);
        return false;
      } else if (contactInput.value.length !== 11) {
        showErrorMessage('Номер должен состоять из 11 цифр!', writeValue, contactInput);
        return false;
      }
      return true;

    default:
      return true;
  };

};
