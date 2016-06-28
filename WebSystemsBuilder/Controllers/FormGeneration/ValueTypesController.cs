using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebSystemsBuilder.Server;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.ClientWeb
{
    public class ValueTypesController : BaseController
    {
        public ActionResult GetValueTypes()
        {
            List<PropertyValueType> valueTypes = new ValueTypesBLL().GetValueTypes();
            return Json(this.CreateResponsePackage(valueTypes), JsonRequestBehavior.AllowGet);
        }
    }
}