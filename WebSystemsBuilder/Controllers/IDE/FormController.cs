using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebSystemsBuilder.Server;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.ClientWeb
{
    public class FormController : BaseController
    {

        /// <summary>
        /// Get all existing forms list
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult GetFormList()
        {
            var list = new FormBll().GetFormList();
            return Json(this.CreateResponsePackage(list), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Get all form parameters list of current form
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult GetFormParametersList(int formID)
        {
            var list = new FormBll().GetFormParametersList(formID);
            return Json(this.CreateResponsePackage(list), JsonRequestBehavior.AllowGet);
        }
    }
}