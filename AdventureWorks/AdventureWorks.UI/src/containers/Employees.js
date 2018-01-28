import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import { TablePagination } from 'react-pagination-table';
import { List } from 'office-ui-fabric-react/lib/List';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { DatePicker, DayOfWeek } from 'office-ui-fabric-react/lib/DatePicker';

import Modal from 'react-modal';

const DayPickerStrings = {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],

  shortMonths: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],

  days: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ],

  shortDays: [
    'S',
    'M',
    'T',
    'W',
    'T',
    'F',
    'S'
  ],

  goToToday: 'Go to today',
  prevMonthAriaLabel: 'Go to previous month',
  nextMonthAriaLabel: 'Go to next month',
  prevYearAriaLabel: 'Go to previous year',
  nextYearAriaLabel: 'Go to next year'
};

const baseUrl = 'http://localhost:5696';
const headers= [
        "UserName",
        "Position",
        "Hired date",
        "Gender"
];
const Panel = styled.div`
    padding: 0 5%;
`;

const RemoveItem = styled.div`
    color: #e74856;
    cursor: pointer;
`;

const Header = styled.div`
    display: flex;

    button {
        margin: 22px 0 0 auto;
    }
`;

const EditItem = styled.div`
    color: #038387;
    cursor: pointer;
`;

const Toolbar = styled.div`
    display: flex;

    div, button {
        margin-right: 10px;
    }
`;

const Form = styled.div`
    display: block;

    div {
        margin-bottom: 15px;
    }
`;

export class Employees extends Component {

    constructor(props){
        super(props);
        this.state = {
            employees: [],
            deleteModal: false,
            editEmployee: 0,
            createModal: false
        };
    }
    componentDidMount() {
        this.getUsers();
    }

    getUsers(){
        var config = {
    headers: {'Access-Control-Allow-Origin': '*'}
};
        axios
            .get(`${baseUrl}/api/employee`, config)
            .then(response => {
                this.setState({
                    employees: response.data
                });
            });
    }

     _manageUser({data, method}) {
        axios({
            method,
            url: `${baseUrl}/api/employee`,
            data
        }).then(()=> this.getUsers());
    }

    _onRenderCell(item, index, isScrolling) {
        return (
        <div className='ms-ListGhostingExample-itemCell' data-is-focusable={ true }> 
            <div className='ms-ListGhostingExample-itemContent'>
                <div className='ms-ListGhostingExample-itemName'>{ `${item.LoginID} (${item.JobTitle})` }</div>
                <div className='ms-ListGhostingExample-itemIndex'>{ `Hired Date: ${item.HireDate}` }</div>
                <Toolbar>
                    <RemoveItem 
                        onClick={() => this._manageUser({data: item, method: 'delete'})}
                    >
                        Remove User
                    </RemoveItem>
                    <EditItem 
                        onClick={() => {
                            this.setState({
                                editEmployee: item
                            });
                            this.forceUpdate();
                        }
                    }
                    >
                        Edit User
                    </EditItem>
                </Toolbar>
            </div>
        </div>
        );
    }

    getEditEmployeeModal(){
        const { editEmployee } = this.state;
        if(editEmployee && editEmployee.BusinessEntityID) {
            return(
                <Modal
                    isOpen={editEmployee && editEmployee.BusinessEntityID}
                    onRequestClose={() => this.setState({
                        editEmployee: null
                    })}
                    contentLabel="Modal"
                >
                    <h1>Edit Employee</h1>
                    <div>
                        <Form>
                            <TextField
                                label='First Name'
                                placeholder='First Name'
                                value={editEmployee.Person.FirstName}
                                onChanged={( value ) => {
                                    this.state.editEmployee.Person.FirstName = value
                                    this.setState({ editEmployee })
                                } }
                                underlined
                            />
                            <TextField
                                label='Last Name'
                                placeholder='Last Name'
                                value={editEmployee.Person.LastName}
                                onChanged={( value ) => {
                                    this.state.editEmployee.Person.LastName = value
                                    this.setState({ editEmployee })
                                } }
                                underlined
                            />
                            <TextField
                                label='Username'
                                placeholder='@UserName'
                                value={editEmployee.LoginID}
                                onChanged={( value ) => {
                                    this.state.editEmployee.LoginID = value
                                    this.setState({ editEmployee })
                                } }
                                underlined
                            />
                            <TextField
                                label='Job Title'
                                placeholder='Job Title'
                                value={editEmployee.JobTitle}
                                onChanged={( value ) => {
                                    this.state.editEmployee.JobTitle = value
                                    this.setState({ editEmployee })
                                } }
                                underlined
                            />
                            <TextField
                                label='Marital Status'
                                placeholder='Marital Status'
                                onChanged={( value ) => {
                                    this.state.editEmployee.MaritalStatus = value
                                    this.setState({ editEmployee })
                                } }
                                value={editEmployee.MaritalStatus}
                                underlined
                            />
                            <TextField
                                label='National ID Number'
                                placeholder='ID'
                               onChanged={( value) => {
                                    this.state.editEmployee.NationalIDNumber = value
                                    this.setState({ editEmployee })
                                } }
                                value={editEmployee.NationalIDNumber}
                                underlined
                            />
                            <TextField
                                label='Hired Date'
                                placeholder='Date'
                                value={editEmployee.HireDate}
                                underlined
                               onChanged={( value ) => {
                                    this.state.editEmployee.HireDate = value
                                    this.setState({ editEmployee })
                                } }
                                iconProps={ { iconName: 'Calendar' } }
                            />
                        </Form>
                    </div>
                    <Toolbar>
                        <DefaultButton
                            primary={ true }
                            data-automation-id='save'
                            disabled={ false }
                            checked={ false }
                            text='Save'
                            onClick={() => {
                                this._manageUser({ data: editEmployee, method: 'post'})
                                this.setState({
                                    editEmployee: null
                                });
                            }}
                        />
                        <DefaultButton
                            data-automation-id='cancel'
                            disabled={ false }
                            checked={ false }
                            text='Cancel'
                            onClick={() => this.setState({
                                editEmployee: null
                            })}
                        />
                    </Toolbar>
                </Modal> 
                ); 
        }
        return null;
    }

    getCreateEmployeeModal(){
        const { createEmployee } = this.state;
        if(createEmployee) {
            return(
                <Modal
                    isOpen={createEmployee}
                    onRequestClose={() => this.setState({
                        createEmployee: null
                    })}
                    contentLabel="Modal"
                >
                    <h1>Create Employee</h1>
                    <div>
                        <Form>
                            <TextField
                                label='First Name'
                                placeholder='First Name'
                                value={createEmployee.Person.FirstName}
                                onChanged={( value ) => {
                                    this.state.createEmployee.Person.FirstName = value
                                    this.setState({ createEmployee })
                                } }
                                underlined
                            />
                            <TextField
                                label='Last Name'
                                placeholder='Last Name'
                                value={createEmployee.Person.LastName}
                                onChanged={( value ) => {
                                    this.state.createEmployee.Person.LastName = value
                                    this.setState({ createEmployee })
                                } }
                                underlined
                            />
                                
                            <TextField
                                label='Username'
                                placeholder='@UserName'
                                value={createEmployee.LoginID}
                                onChanged={( value ) => {
                                    this.state.createEmployee.LoginID = value
                                    this.setState({ createEmployee })
                                } }
                                underlined
                            />
                            <TextField
                                label='Job Title'
                                placeholder='Job Title'
                                value={createEmployee.JobTitle}
                                onChanged={( value ) => {
                                    this.state.createEmployee.JobTitle = value
                                    this.setState({ createEmployee })
                                } }
                                underlined
                            />
                            <Dropdown
                                className='Dropdown-example'
                                placeHolder='Select an Option'
                                label='Marital Status'
                                id='MaritalStatus'
                                ariaLabel='Basic dropdown example'
                                options={
                                    [
                                    { key: 'M', text: 'Married' },
                                    { key: 'S', text: 'Single' }
                                    ]
                                }
                                selectedKey={createEmployee.MaritalStatus}
                                onChanged={( { key }) => {
                                    this.state.createEmployee.MaritalStatus = key
                                    this.setState({ createEmployee })
                                } }
                            />
                            <TextField
                                label='National ID Number'
                                placeholder='ID'
                               onChanged={( value) => {
                                    this.state.createEmployee.NationalIDNumber = value
                                    this.setState({ createEmployee })
                                } }
                                value={createEmployee.NationalIDNumber}
                                underlined
                            />
                            <Dropdown
                                className='Dropdown-example'
                                placeHolder='Select an Option'
                                label='Gender'
                                id='MaritalStatus'
                                ariaLabel='Basic dropdown example'
                                options={
                                    [
                                    { key: 'M', text: 'Male' },
                                    { key: 'F', text: 'Female' }
                                    ]
                                }
                                selectedKey={createEmployee.Gender}
                                onChanged={( { key } ) => {
                                    this.state.createEmployee.Gender = key
                                    this.setState({ createEmployee })
                                } }
                            />   
                            <DatePicker 
                                firstDayOfWeek={ DayOfWeek.Sunday } 
                                strings={ DayPickerStrings } 
                                placeholder='Hired date' 
                                value= { createEmployee.HireDate}
                                onSelectDate={(date)=>
                                    {
                                        this.state.createEmployee.HireDate = date;
                                        this.setState({ createEmployee })
                                    }
                                }
                            />
                            <DatePicker 
                                firstDayOfWeek={ DayOfWeek.Sunday } 
                                strings={ DayPickerStrings } 
                                value= { createEmployee.BirthDate}
                                placeholder='BirthDate' 
                                onSelectDate={(date)=>{
                                    this.state.createEmployee.BirthDate = date;
                                    this.setState({ createEmployee })
                                }   
                                }
                            />


                        </Form>
                    </div>
                    <Toolbar>
                        <DefaultButton
                            primary={ true }
                            data-automation-id='save'
                            disabled={ false }
                            checked={ false }
                            text='Save'
                            onClick={() => {
                                this._manageUser({ data: createEmployee, method: 'put'})
                                this.setState({
                                    createEmployee: null
                                });
                            }}
                        />
                        <DefaultButton
                            data-automation-id='cancel'
                            disabled={ false }
                            checked={ false }
                            text='Cancel'
                            onClick={() => this.setState({
                                createEmployee: null
                            })}
                        />
                    </Toolbar>
                </Modal> 
                ); 
        }
        return null;
    }


    getList({employees}){
         return (
            <div className='ms-ListGhostingExample-container' data-is-scrollable={ true }>
                <List
                    items={ employees }
                    onRenderCell={(item, index, isScrolling) => this._onRenderCell(item, index, isScrolling) }
                />
            </div>
        );
    }

    componentWillMount(){
        Modal.setAppElement('body');
    }

    render(){
        const { employees } = this.state;
        return(
            <Panel>
                <Header>
                    <h1>Employees</h1>
                    <DefaultButton
                        primary={ true }
                        data-automation-id='create'
                        disabled={ false }
                        checked={ false }
                        text='Create'
                        onClick={() => {
                            this.setState({
                                createEmployee: {
                                    CurrentFlag: true,
                                    ModifiedDate: new Date().toLocaleString(),
                                    Person: {
                                        PersonType: 'EM'
                                    }
                                }
                            });
                        }}
                    />
                </Header>
                {
                    employees.length> 0 && 
                    this.getList({ employees })
                }
                {this.getEditEmployeeModal()} 
                {this.getCreateEmployeeModal()}
            </Panel>
        )
    }
}

export default Employees;
