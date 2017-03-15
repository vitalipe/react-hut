var React = require("react");
var reactHut = require("../../bin/react-hut");


suite("flat list of 10 simple elements (no props)", () => {
    let H = reactHut.createHut(React);

    benchmark("raw React.createElement()", () => {
        return React.createElement(
            "ul",
            null,
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null)
        );
    });


    benchmark('H()', () => {
        return H([":ul", [":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"]])
    });
});



suite("flat list of 50 simple elements (no props)", () => {

    let H = reactHut.createHut(React);

    benchmark("raw React.createElement()", () => {
        return React.createElement(
            "ul",
            null,
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null)
        );
    });


    benchmark('H()', () => {
        return H([":ul",
            [":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],
            [":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],
            [":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],
            [":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],
            [":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"]
        ])
    });
});



suite("flat list of 100 elements (no props)", () => {

    let H = reactHut.createHut(React);

    benchmark("raw React.createElement()", () => {
        return React.createElement(
            "ul",
            null,
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null),
            React.createElement("li", null)
        );
    });

    benchmark('H()', () => {
        return H([":ul",
            [":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],
            [":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],
            [":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],
            [":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],
            [":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],
            [":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],
            [":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],
            [":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],
            [":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],
            [":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],[":li"],
        ])
    });
});

