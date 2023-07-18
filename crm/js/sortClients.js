export function sortTable() {
  const table = document.querySelector('.clients__table'),
        headers = table.querySelectorAll('th'),
        tbody = table.querySelector('tbody');

  // Направление сортировки
  const directions = Array.from(headers).map(() => {
    return '';
  });

  // Преобразовать содержимое данной ячейки в заданном столбце
  const transform = (type, content) => {
    // Получаем тип данных столбца
    switch (type) {
      case 'id':
        return parseFloat(content);
      case 'create':
      case 'update':
        return content.split('.').reverse().join('-');
      case 'text':
      default:
        return content;
    }
  };

  const sortColumn = (index) => {
    // Получаем тип данных столбца
    const type = headers[index].getAttribute('data-type');

    // Получить текущее направление
    const direction = directions[index] || 'sortUp';

    // Фактор по направлению
    const multiplier = (direction === 'sortUp') ? 1 : -1;

    const rows = tbody.querySelectorAll('tr'),
          newRows = Array.from(rows);

    newRows.sort((rowA, rowB) => {
      const cellA = rowA.querySelectorAll('td')[index].textContent;
      const cellB = rowB.querySelectorAll('td')[index].textContent;

      const a = transform(type, cellA);
      const b = transform(type, cellB);

      switch (true) {
        case a > b:
          return 1 * multiplier;
        case a < b:
          return -1 * multiplier;
        default:
          break;
        case a === b:
        return 0;
      }
    });

    // Удалить старые строки
    [].forEach.call(rows, (row) => {
      tbody.removeChild(row);
    });

    // Поменять направление
    directions[index] = direction === 'sortUp' ? 'sortDown' : 'sortUp';

    // Добавить новую строку
    newRows.forEach((newRow) =>  {
      tbody.appendChild(newRow);
    });
  };

  [].forEach.call(headers, (header, index) => {
    header.addEventListener('click', function() {
        sortColumn(index);
    });
  });

}
