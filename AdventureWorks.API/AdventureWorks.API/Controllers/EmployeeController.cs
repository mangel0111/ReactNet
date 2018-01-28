using AdventureWorks.API.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace AdventureWorks.API.Controllers
{
    [EnableCors("*", "*", "*")]
    public class EmployeeController : ApiController
    {
        private List<Employee> getEmployees() {
            List<Employee> employees = new List<Employee>();
            using (var db = new AdventureWorks2012Entities())
            {
               var query = db.Employee.Include("Person").Where(e => e.CurrentFlag == true);
                employees.AddRange(query);
            }
            return employees;
        }

        [HttpGet]
        [EnableCors("*", "*","*")]
        public HttpResponseMessage Get()
        {
            try
            {
                List<Employee> employees = getEmployees();
                return Request.CreateResponse(
                        HttpStatusCode.OK,
                        employees,
                        "application/json");
            }
            catch (Exception e) {
                return Request.CreateResponse(HttpStatusCode.Conflict);
            }
        }

        [HttpPut]
        public HttpResponseMessage Put(Employee employee)
        {
            try
            {
                BusinessEntity businessEntity = new BusinessEntity();
                Person person = employee.Person;
                using (var db = new AdventureWorks2012Entities())
                {

                    businessEntity.rowguid = Guid.NewGuid();
                    businessEntity.ModifiedDate = DateTime.Now;

                    db.BusinessEntity.Add(businessEntity);
                    person.rowguid = Guid.NewGuid();
                    person.BusinessEntity = businessEntity;
                    person.BusinessEntityID = businessEntity.BusinessEntityID;

                    person.ModifiedDate = DateTime.Now;
                    db.Person.Add(person);

                    employee.rowguid = Guid.NewGuid();
                    employee.BusinessEntityID = person.BusinessEntityID;
                    employee.ModifiedDate = DateTime.Now;

                    db.Employee.Add(employee);
                    db.SaveChanges();
                }
                return Request.CreateResponse(HttpStatusCode.Created);
            }
            catch (Exception e) {
                return Request.CreateResponse(HttpStatusCode.Conflict);
            }
           
        }

        [HttpDelete]
        public HttpResponseMessage Delete(Employee employee)
        {
            try {
                using (var db = new AdventureWorks2012Entities())
                {
                    var query = from e in db.Employee
                                where e.BusinessEntityID == employee.BusinessEntityID
                                orderby e.BusinessEntityID
                                select e;
                    foreach (var employeeToDelete in query)
                    {
                        employeeToDelete.CurrentFlag = false;
                    }
                    db.SaveChanges();
                }
                return Request.CreateResponse(HttpStatusCode.OK);
            } catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.Conflict);
            }
        }

        [HttpPost]
        public HttpResponseMessage Post(Employee employee)
        {
            try
            {
                using (var db = new AdventureWorks2012Entities())
                {
                    db.Entry(employee).State = EntityState.Modified;
                    db.Entry(employee.Person).State = EntityState.Modified;
                    db.SaveChanges();
                }
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception e) {
                return Request.CreateResponse(HttpStatusCode.Conflict);
            }
        }
    }
}
