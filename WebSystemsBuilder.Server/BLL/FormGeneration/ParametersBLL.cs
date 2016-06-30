using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.Server
{
    public class ParametersBLL : ConnectionFactory
    {
        public List<FormParameterInstance> GetParametersByFormID(int formID)
        {
            using (var connection = this.CreateConnection())
            {
                using (var db = base.CreateContext(connection))
                {
                    List<FormParameterInstance> parameters = this._GetParametersByFormID(db, formID);
                    return parameters;
                }
            }
        }

        private List<FormParameterInstance> _GetParametersByFormID(WebBuilderEFContext db, int formID)
        {
            return (
                from formParameter in db.FormParameters
                where formParameter.FormID == formID
                join valueType in db.PropertyValueTypes on formParameter.ValueTypeID equals valueType.ValueTypeID
                select new { formParameter = formParameter, valueType = valueType }
            )
            .ToList()
            .Select(e => new FormParameterInstance(e.formParameter, e.valueType))
            .ToList();
        }
    }
}
