/**
 * Created by vitali on 19/02/17.
 */


const H = ReactHut.createHut(React, {

    /*  This is a simple example of a transform function.
     *  It will insert displayNames to all components with '#' in their name
     *  (for example [":div#MyApp"] will have the display name "MyApp")
     */
    transform([element, props = {}, ...children]) {
        if (typeof element !== "string")
            return; // returning undefined will do nothing

        let [name, inlineDisplayName = null] = element.split("#");

        if (inlineDisplayName === null)
            return;

        let proxy = () => H([name, props, ...children]);
        proxy.displayName = inlineDisplayName;

        // let's play nice with key names, and keep them at the upper level
        let {key = null} =(props || {});


        return (key === null) ? [proxy] : [proxy, {key : key}];
    }
});

let HutView = ReactHut.createHutView(H);



// UI
((H, HutView) => {



    /*
     * HutView() can be used to define function components,
     * the first (optional) param is the displayName.
     *
     * I personally don't use it, I just call H()
     * before returning, as you can see in the next 2 examples.
     *
     */
    let Header = HutView("Header",
        ({newItemTitle, onChange, onDone}) => {
            return (
                [":header.header",
                    [":h1", "todos"],
                    [":input.new-todo",
                        {
                            placeholder : "What needs to be done?",
                            autoFocus : true,
                            type : "text",
                            onChange : e => onChange(e.target.value),
                            onKeyPress : e => { if (e.key === "Enter") onDone() },
                            onBlur : onDone,
                            value : newItemTitle
                        }
                    ]]);
        });



    let TodoList = ({todos}) => {
        let completed = (todos.find(item => !item.completed) || false);

        return H(
            [":section.main",
                [":input.toggle-all",
                    {
                        type : "checkbox",
                        checked : false,
                        onChange : () => todos.forEach(item => item.setCompleted(completed))
                    }],

                [":ul.todo-list",
                    todos.map((item) =>
                        [":li#TodoItem", {key : item.id},
                            [":div.view",
                                [":input.toggle",
                                    {
                                        type : "checkbox",
                                        checked : item.completed,
                                        onChange : item.toggleCompleted }],
                                [":label", item.title],
                                [":button.destroy", {onClick : item.destroy}]]])]]
        );
    };


    let Footer = ({todos}) => {
        let unfinished = todos
            .reduce((sum, {completed}) => completed ? sum  : sum + 1  , 0);

        if (todos.length === 0)
            return H(":div");

        return H(
            [":footer.footer",

                [":span.todo-count",
                    [":strong", unfinished], " items", " left"],

                [":ul.filters"]]);
    };


    let App = HutView({

        displayName : "App",

        props : {store},
        state : {newTodoTitle : "" },

        lifecycle : {
            willMount() { this.props.store.listen(() => this.forceUpdate(() => null))},
            willUnmount() {this.props.store.listen(() => null) }
        },

        handleTodoAdd() {
            let title = this.state.newTodoTitle;

            if (title.trim().length > 0)
                this.props.store.createTodoItem(title);

            this.setState({newTodoTitle : ""});
        },

        render({store}, {newTodoTitle}) {

            return (
                [":section.todoapp",
                    [Header,
                        {
                            onDone : this.handleTodoAdd,
                            onChange : v => this.setState({newTodoTitle : v}),
                            newItemTitle : newTodoTitle }],

                    [TodoList, {todos : store.todos}],
                    [Footer, {todos : store.todos}]]);
        }

    });



    ReactDOM.render(H(App, {store}), document.querySelector("#root"));

})(H, HutView);



