import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import { Navigator } from "./src/controllers/Navigator"
import { Employees } from "./src/containers/Employees"

const baseUrl = 'http://localhost:50811';

const Body = styled.body`
    margin: 0;
    padding: 0;
`;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterText: '',
            items: props.items
        };
    }

    render() {
        return (
            <div>
                <Navigator/>
                <Employees/>
            </div>
        );
    }
}
App.displayName = "App";

ReactDOM.render(<App />, document.getElementById("app"));
