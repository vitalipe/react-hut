var React = require("react");
var reactHut = require("../../bin/react-hut");



suite("tree of 4>2>3>10 simple elements", () => {

    let H = reactHut.createHut(React);

    benchmark("raw React.createElement()" , () => {

        return  React.createElement(
            "ul",
            null,
            React.createElement(
                "li",
                null,
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    )
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    )
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    )
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    )
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    )
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    )
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    )
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null),
                        React.createElement("div", null)
                    )
                )
            )
        );
    });


    benchmark('1 top level  call to H()', () => {
        return H([":ul",
            [":li",
                [":div",
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ],
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ],
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ]
                ],

                [":div",
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ],
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ],
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ]
                ]],

            [":li",
                [":div",
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ],
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ],
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ]
                ],

                [":div",
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ],
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ],
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ]
                ]],

            [":li",
                [":div",
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ],
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ],
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ]
                ],

                [":div",
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ],
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ],
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ]
                ]],

            [":li",
                [":div",
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ],
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ],
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ]
                ],

                [":div",
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ],
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ],
                    [":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ]
                ]]
        ])
    });


    benchmark('nested H() calls', () => {
        return H([":ul",
            H(":li",
                H(":div",
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ),
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ),
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] )
                ),

                H(":div",
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ),
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ),
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] )
                )),

            H(":li",
                H(":div",
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ),
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ),
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] )
                ),

                H(":div",
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ),
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ),
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] )
                )),

            H(":li",
                H(":div",
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ),
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ),
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] )
                ),

                H(":div",
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ),
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ),
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] )
                )),

            H(":li",
                H(":div",
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ),
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ),
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] )
                ),

                H(":div",
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ),
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] ),
                    H(":div",
                        [":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"],[":div"] )
                ))
        ])
    });
});


suite("2 deeply nested lists (15 levels) of 1 simple child", () => {

    let H = reactHut.createHut(React);


    benchmark("1 top level  call to H()" , () => {
        return H(":main",
            [":ul",
                [":li",
                    [":ul",
                        [":li",
                            [":ul",
                                [":li",
                                    [":li",
                                        [":ul",
                                            [":li",
                                                [":ul",
                                                    [":li",
                                                        [":ul",
                                                            [":li",
                                                                [":li",
                                                                    [":ul",
                                                                        [":li"]]]]]]]]]]]]]]],
                [":li",
                    [":ul",
                        [":li",
                            [":ul",
                                [":li",
                                    [":li",
                                        [":ul",
                                            [":li",
                                                [":ul",
                                                    [":li",
                                                        [":ul",
                                                            [":li",
                                                                [":li",
                                                                    [":ul",
                                                                        [":li"]]]]]]]]]]]]]]]
                ])

    });

    benchmark("realistically nested calls to H()" , () => {
        return H(":main",
            [":ul",
                [":li",
                    [":ul",
                        [":li",
                            H(":ul",
                                [":li",
                                    [":li",
                                        [":ul",
                                            [":li",
                                                H(":ul",
                                                    [":li",
                                                        [":ul",
                                                            [":li",
                                                                [":li",
                                                                    [":ul",
                                                                        [":li"]]]]]])]]]])]]],
                [":li",
                    [":ul",
                        [":li",
                            H(":ul",
                                [":li",
                                    [":li",
                                        [":ul",
                                            [":li",
                                                H(":ul",
                                                    [":li",
                                                        [":ul",
                                                            [":li",
                                                                [":li",
                                                                    [":ul",
                                                                        [":li"]]]]]])]]]])]]]
            ])

    });


    benchmark("extremely nested H() calls" , () => {
        return H(":main",
            H(":ul",
                H(":li",
                    H(":ul",
                        H(":li",
                            H(":ul",
                                H(":li",
                                    H(":li",
                                        H(":ul",
                                            H(":li",
                                                H(":ul",
                                                    H(":li",
                                                        H(":ul",
                                                            H(":li",
                                                                H(":li",
                                                                    H(":ul",
                                                                        H(":li")))))))))))))))),
            H(":ul",
                H(":li",
                    H(":ul",
                        H(":li",
                            H(":ul",
                                H(":li",
                                    H(":li",
                                        H(":ul",
                                            H(":li",
                                                H(":ul",
                                                    H(":li",
                                                        H(":ul",
                                                            H(":li",
                                                                H(":li",
                                                                    H(":ul",
                                                                        H(":li"))))))))))))))))
            )
    });

    benchmark("raw React.createElement()" , () => {
        return React.createElement(
            "ul",
            null,
            React.createElement(
                "li",
                null,
                React.createElement(
                    "ul",
                    null,
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "ul",
                            null,
                            React.createElement(
                                "li",
                                null,
                                React.createElement(
                                    "ul",
                                    null,
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "ul",
                                            null,
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "ul",
                                                    null,
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        React.createElement(
                                                            "ul",
                                                            null,
                                                            React.createElement(
                                                                "ul",
                                                                null,
                                                                React.createElement(
                                                                    "li",
                                                                    null,
                                                                    React.createElement(
                                                                        "ul",
                                                                        null,
                                                                        React.createElement("li", null)
                                                                    )
                                                                )
                                                            ),
                                                            React.createElement("li", null)
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "ul",
                    null,
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "ul",
                            null,
                            React.createElement(
                                "li",
                                null,
                                React.createElement(
                                    "ul",
                                    null,
                                    React.createElement(
                                        "li",
                                        null,
                                        React.createElement(
                                            "ul",
                                            null,
                                            React.createElement(
                                                "li",
                                                null,
                                                React.createElement(
                                                    "ul",
                                                    null,
                                                    React.createElement(
                                                        "li",
                                                        null,
                                                        React.createElement(
                                                            "ul",
                                                            null,
                                                            React.createElement(
                                                                "ul",
                                                                null,
                                                                React.createElement(
                                                                    "li",
                                                                    null,
                                                                    React.createElement(
                                                                        "ul",
                                                                        null,
                                                                        React.createElement("li", null)
                                                                    )
                                                                )
                                                            ),
                                                            React.createElement("li", null)
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        );
    });
});