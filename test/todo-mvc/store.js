/**
 * Created by vitali on 19/02/17.
 */

var store = (function () {

    let seed = 0;
    let TodoEntity = function (store, title) {

        this.title = title;
        this.completed = false;
        this.id = ++seed;

        // actions
        this.destroy = () => {
            store.todos = store.todos.filter(todo => todo !== this);
            store.notify();
        };

        this.toggleCompleted = () => {
            this.completed = !this.completed;
            store.notify();
        };

        this.setCompleted = (val) => {
            this.completed = val;
            store.notify();
        };
    };

    return {

        // data
        todos : [],

        createTodoItem(title) {
            this.todos.push(new TodoEntity(this, title));
            this.notify();
        },

        // events
        notify() {},
        listen(cb) {this.notify = cb}
    };

}());



