var React = require("react");
var reactHut = require("../../bin/react-hut");


let H = reactHut.createHut(React);
var Store = function () {

    let seed = 0;
    let TodoEntity = function (store, title = "item", completed = false) {

        this.title = title;
        this.completed = completed;
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

        createTodoItem(title, completed = false) {
            this.todos.push(new TodoEntity(this, title, completed));
            this.notify();
        },

        // events
        notify() {},
        listen(cb) {this.notify = cb}
    };
};


let HutUI = {
    Header({newItemTitle}){
        return H(":header.header",

                [":h1", "todos"],
                [":input.new-todo",
                    {
                        placeholder : "What needs to be done?",
                        autoFocus : true,
                        type : "text",
                        value : newItemTitle
                    }
                ]);
    },

    TodoItem(item) {
        return H(":li", {key : item.id},
                [":div.view",
                    [":input.toggle",
                        {
                            type : "checkbox",
                            checked : item.completed,
                        }
                    ],
                    [":label", item.title],
                    [":button.destroy", {onClick : item.destroy}]
                ]
            );
    },

    TodoList({todos}) {
        let completed = (todos.find(item => !item.completed) || false);

        return H(":section.main",
                [":input.toggle-all",
                    {
                        type : "checkbox",
                        checked : false,
                        onChange : () => todos.forEach(item => item.setCompleted(completed))
                    }
                ],
                [":ul.todo-list", todos.map(HutUI.TodoItem)]);
    },

    Footer({todos}){
        let unfinished = todos.reduce((sum, {completed}) => completed ? sum  : sum + 1  , 0);

        if (todos.length === 0)
            return null;

        return H(":footer.footer",

                [":span.todo-count",
                    [":strong", unfinished], " items left"],

            [":ul.filters"]);
    },

    App({store}) {
        return H(":section.todoapp",
            [HutUI.Header, { newItemTitle : "crap..."}],
            [HutUI.TodoList, {todos : store.todos}],
            [HutUI.Footer, {todos : store.todos}]);
    }
};


let RawUI = {

    /*

     <header className="header">
     <h1>todos</h1>
     <input
       className="new-todo"
       placeholder="What needs to be done?"
       autoFocus={true}
       type="text"
       value={newItemTitle} />
     </header>

     */
    Header({newItemTitle}){
        return React.createElement(
            "header",
            { className: "header" },
            React.createElement(
                "h1",
                null,
                "todos"
            ),
            React.createElement("input", {
                className: "new-todo",
                placeholder: "What needs to be done?",
                autoFocus: true,
                type: "text",
                value: newItemTitle })
        );
    },

    /**

     <li key={item.id}>
       <div className="view">
         <input
            className="toggle"
            type="checkbox"
            checked={item.completed} />
         <label>{item.title}</label>
         <button className="destroy" onClick={item.destroy}></button>
       </div>
     </li>

     */
    TodoItem(item) {
        return React.createElement(
            "li",
            { key: item.id },
            React.createElement(
                "div",
                { className: "view" },
                React.createElement("input", {
                    className: "toggle",
                    type: "checkbox",
                    checked: item.completed }),
                React.createElement(
                    "label",
                    null,
                    item.title
                ),
                React.createElement("button", { className: "destroy", onClick: item.destroy })
            )
        );
    },

    /*

     <section className="main">
       <input
         type="checkbox"
         checked={false}
         onChange={() => todos.forEach(item => item.setCompleted(completed))}
       />

       <ul className="todo-list">{ todos.map(RawUI.TodoItem)}</ul>
     </section>

     */
    TodoList({todos}) {
        let completed = (todos.find(item => !item.completed) || false);

        return React.createElement(
            "section",
            { className: "main" },
            React.createElement("input", {
                type: "checkbox",
                checked: false,
                onChange: function onChange() {
                    return todos.forEach(function (item) {
                        return item.setCompleted(completed);
                    });
                }
            }),
            React.createElement(
                "ul",
                { className: "todo-list" },
                todos.map(RawUI.TodoItem)
            )
        );
    },

    /*

     <footer className="footer">
       <span className="todo-count">
         <strong>{unfinished}</strong> items left
       </span>
       <ul className="filters" />
     </footer>

     */
    Footer({todos}){
        let unfinished = todos.reduce((sum, {completed}) => completed ? sum  : sum + 1  , 0);

        if (todos.length === 0)
            return null;

        return React.createElement(
            "footer",
            { className: "footer" },
            React.createElement(
                "span",
                { className: "todo-count" },
                React.createElement(
                    "strong",
                    null,
                    unfinished
                ),
                " items left"
            ),
            React.createElement("ul", { className: "filters" })
        );
    },

    /*
     <section className="todoapp">
       <RawUI.Header newItemTitle="crap..." />
       <RawUI.TodoList todos={store.todos} />
       <RawUI.Footer  todos={store.todos} />
     </section>
     */
    App({store}) {
        return React.createElement(
            "section",
            {className: "todoapp"},
            React.createElement(RawUI.Header, {newItemTitle: "crap..."}),
            React.createElement(RawUI.TodoList, {todos: store.todos}),
            React.createElement(RawUI.Footer, {todos: store.todos})
        )
    }
};



suite("A todo-MVC app with 15 todo items", () => {


    let store = new Store();

    Array.from(new Array(15), (x,i) => i)
        .forEach((i) => store.createTodoItem("item" + i, i % 2 === 0));


    benchmark('H()', () => {
        return HutUI.App({store});
    });

    benchmark('raw .createElement()', () => {
        return RawUI.App({store});
    });
});


suite("A todo-MVC app with 100 todo items", () => {


    let store = new Store();

    Array.from(new Array(100), (x,i) => i)
        .forEach((i) => store.createTodoItem("item" + i, i % 2 === 0));


    benchmark('H()', () => {
        return HutUI.App({store});
    });

    benchmark('raw .createElement()', () => {
        return RawUI.App({store});
    });
});


