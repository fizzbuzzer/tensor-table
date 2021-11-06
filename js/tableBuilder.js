class TableBuilder {
    #data;

    #rootId;

    #tableNode;

    #CONTROLS_CONFIG = [
      {
        tag: 'button',
        listenerType: 'click',
        listenerCallback: (e) => this.#sortBy(e, 'asc'),
        classList: ['btn', 'btn--asc'],
      },
      {
        tag: 'button',
        listenerType: 'click',
        listenerCallback: (e) => this.#sortBy(e, 'desc'),
        classList: ['btn', 'btn--desc'],
      },
      {
        tag: 'input',
        listenerType: 'input',
        listenerCallback: (e) => this.#search(e),
        classList: ['input'],
      },
    ];

    constructor(data, rootId) {
      this.#data = data;
      this.#rootId = rootId;
    }

    build() {
      this.#initTable();
      this.#populateTable();
      document.getElementById(this.#rootId).appendChild(this.#tableNode);
    }

    /* Инициализация обертки */
    #initTable() {
      this.#tableNode = document.createElement('table');
      this.#tableNode.innerHTML = '<thead></thead><tbody></tbody>';
    }

    /* Заполнение head и body */
    #populateTable() {
      Object.keys(this.#data.table).forEach((section) => {
        this.#populateRows(section);
      });
    }

    /* Заполнение ячеек */
    #populateRows(section) {
      const isHead = section === 'head';
      let rowNode;
      let cellNode;

      this.#data.table[section].forEach((row) => {
        rowNode = document.createElement('tr');

        this.#data.cols.forEach((col) => {
          cellNode = document.createElement(isHead ? 'th' : 'td');
          cellNode.innerHTML = row[col];
          cellNode.dataset.col = col;
          if (isHead) {
            cellNode.appendChild(this.#buildControls());
          }
          rowNode.appendChild(cellNode);
        });

        this.#tableNode.querySelector(isHead ? 'thead' : 'tbody').appendChild(rowNode);
      });
    }

    /* Генерация кнопок и поиска на базе конфига */
    #buildControls() {
      const controlsNode = document.createElement('div');
      controlsNode.classList.add('controls');

      let node;
      this.#CONTROLS_CONFIG.forEach((control) => {
        node = document.createElement(control.tag);
        if (Object.prototype.hasOwnProperty.call(control, 'innerHTML')) {
          node.innerHTML = control.innerHTML;
        }
        node.addEventListener(control.listenerType, control.listenerCallback);
        if (Object.prototype.hasOwnProperty.call(control, 'classList') && control.classList.length !== 0) {
          node.classList.add(...control.classList);
        }

        controlsNode.appendChild(node);
      });

      return controlsNode;
    }

    #sortBy(e, sortType) {
      function sortRows(a, b) {
        const { col } = e.target.closest('th').dataset;
        function getTextContent(row) {
          return row.querySelector(`[data-col=${col}]`).textContent;
        }
        const aText = getTextContent(a);
        const bText = getTextContent(b);
        if (aText > bText) {
          return sortType === 'asc' ? 1 : -1;
        }
        if (aText < bText) {
          return sortType === 'asc' ? -1 : 1;
        }
        return 0;
      }

      Array.from(this.#tableNode.querySelectorAll('tbody tr'))
        .sort(sortRows)
        .forEach((row) => this.#tableNode.querySelector('tbody').appendChild(row));
    }

    #search(e) {
      const { value } = e.target;
      const { col } = e.target.closest('th').dataset;

      const nodes = this.#tableNode.querySelectorAll(`tbody td[data-col='${col}']`);
      const re = new RegExp(`(${value})`, 'gi');

      nodes.forEach((cell, index) => {
        if (cell.textContent.toLowerCase().includes(value.toLowerCase())) {
          nodes[index].innerHTML = cell.textContent.replace(re, '<mark>$1</mark>');
        } else if (cell.textContent !== cell.innerHTML) {
          /* Очищаем разметку, если она есть */
          nodes[index].innerHTML = cell.textContent;
        }
      });
    }
}

export default TableBuilder;
