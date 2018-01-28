using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AdventureWorks.API.Models
{
    public class PersonEmployee
    {
        public PersonEmployee(Person person, Employee employee)
        {
            Employee = employee;
            Person = person;
        }
        public Employee Employee { get; set; }
        public Person Person { get; set; }
    }
}