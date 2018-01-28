import React, { Component } from "react";
import styled from "styled-components";

const Header = styled.header`
    margin-top:0;
`;

const FirstNav = styled.div`
    background: white;
    height: 50px;
    padding: 0 5%;

    div {
        padding-top: 11px;

         a, a:hover {
             text-decoration: none;
             color: #2f2f2f;
             font-size: 18px;
        }
    }
   
`;

const SecondtNav = styled.div`
    background: #2f2f2f;
    height: 50px;
    padding: 0 5%;
    color: #fff;

    div {
        padding-top: 3px;

         div {
             color: #fff;
             font-size: 18px;
        }
    }
`;

export class Navigator extends Component {

    render () {
        return (
            <Header>
                <FirstNav>
                    <div>
                        <a href="/">Adventure Works</a>
                    </div>
                </FirstNav>
                <SecondtNav>
                    <div><div>Employees</div></div>
                </SecondtNav>
            </Header>
        );
    }
}

export default Navigator;
