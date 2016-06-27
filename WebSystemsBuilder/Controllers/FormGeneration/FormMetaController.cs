using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebSystemsBuilder.Server;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.ClientWeb
{
    public class FormMetaController : BaseController
    {
        public ActionResult GetFormMetaDescriptions(int formID)
        {
            FormInstance formInstance = new FormMetaDescriptionsBLL().GetFormMetaDescriptions(formID);
            return Json(this.CreateResponsePackage(formInstance));
        }
    }
}