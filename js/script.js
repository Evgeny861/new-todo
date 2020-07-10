'use strict';

alert('Пустые поля вводить нельзя');
class Todo {
    constructor(form, input, todoList, todoCompleted, todoContainer) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoContainer = document.querySelector(todoContainer);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    }

    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));

    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();

    }

    createItem(todo) {

        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;
        li.completed = todo.completed;
        li.insertAdjacentHTML('beforeend', `	
            <span class="text-todo">${todo.value}</span>
            <div class="todo-buttons">
                <button class="todo-remove"></button>
                <button class="todo-complete"></button>
            </div>
        `);

        if (todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    addTodo(e) {
        e.preventDefault();

        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
        }

    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    deleteItem(key) {
        // по ключу найти элемент  и удалить
        this.todoData.delete(key);
        this.render();

    }


    completedItem(completed, key) {
        // перебрать все элементы и поменять completed
        if (this.todoData.get(key).completed === false) {
            this.todoData.get(key).completed = true;
            this.todoCompleted.append(document.querySelector('li'));
            this.render();
        } else if (this.todoData.get(key).completed === true) {
            this.todoData.get(key).completed = false;
            this.render();
        }

    }
    handler() {
        // делегирование клика кнопки
        this.todoContainer.addEventListener('click', event => {
            const target = event.target;
            const remove = document.querySelectorAll('.todo-remove'),
                complete = document.querySelectorAll('.todo-complete');
            for (let i = 0; i < remove.length; i++) {
                if (target === remove[i]) {
                    this.deleteItem(target.parentElement.parentElement.key);
                    return;
                }
            }

            for (let i = 0; i < complete.length; i++) {
                if (target === complete[i]) {
                    this.completedItem(target.parentElement.parentElement.completed,
                        target.parentElement.parentElement.key);
                    return;
                }
            }

        }
        );
    }


    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');

todo.init();
todo.handler();

