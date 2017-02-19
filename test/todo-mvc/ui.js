/**
 * Created by vitali on 19/02/19.
 */

(function () {

    let H = ReactHut.createHut(React);


    let TodoItem = (item) => {
        return H(
            [":li", {key : item.id},
                [":div", {className : "view"},
                    [":input",
                        {
                            className : "toggle",
                            type : "checkbox",
                            checked : item.completed,
                            onChange : item.toggleCompleted
                        }
                    ],
                    [":label", item.title],
                    [":button", {className : "destroy", onClick : item.destroy}]
                ]
            ]);
    };


    let TodoList = ({todos}) => {
        let completed = (todos.find(item => !item.completed) || false);

        return H(
            [":section", {className : "main"},

                [":input",
                    {
                        className : "toggle-all",
                        type : "checkbox",
                        checked : false,
                        onChange : () => todos.forEach(item => item.setCompleted(completed))
                    }
                ],
                [":ul", {className : "todo-list"}, todos.map(TodoItem)]
            ]);
    };


    let Header = ({newItemTitle, onChange, onDone}) => {
       return H(
           [":header", {className : "header"},

               [":h1", "todos"],
               [":input",
                   {
                       className : "new-todo",
                       placeholder : "What needs to be done?",
                       autoFocus : true,
                       type : "text",
                       onChange : e => onChange(e.target.value),
                       onKeyPress : e => { if (e.key === "Enter") onDone() },
                       onBlur : onDone,
                       value : newItemTitle
                   }
               ]
           ]);
    };

    let Footer = ({todos}) => {
        let unfinished = todos.reduce((sum, {completed}) => completed ? sum  : sum + 1  , 0);

        if (todos.length === 0)
            return H(":div");

        return H(
            [":footer", {className : "footer"},

                [":span", {className : "todo-count"},
                    [":strong", unfinished], " items", " left"],

                [":ul", {className : "filters"}]

            ]);
    };




    let App = React.createClass({

        getDefaultProps() {
            return {store};
        },

        getInitialState() {
          return {newTodoTitle : "" }
        },

        componentWillMount() {
            this.props.store.listen(() => this.forceUpdate(() => null));
        },

        handleTodoAdd() {
            let title = this.state.newTodoTitle;

            if (title.trim().length > 0)
                this.props.store.createTodoItem(title);

            this.setState({newTodoTitle : ""});
        },

        render() {
            let {store} = this.props;

            return H(
                [":section", {className : "todoapp"},
                    [Header,
                        {
                            onDone : this.handleTodoAdd,
                            onChange : v => this.setState({newTodoTitle : v}),
                            newItemTitle : this.state.newTodoTitle
                        }
                    ],

                    [TodoList, {todos : store.todos}],
                    [Footer, {todos : store.todos}]
                ]);
        }

    });


    ReactDOM.render(H(App, {store}), document.querySelector("#root"));

}());



