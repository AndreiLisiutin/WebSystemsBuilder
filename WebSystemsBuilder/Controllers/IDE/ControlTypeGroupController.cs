using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebSystemsBuilder.Server;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.ClientWeb
{
    public class ControlTypeGroupController : BaseController
    {
        /// <summary> 
        /// Get list of all control type groups, allowed in system
        /// </summary>
        /// <returns>List with all control type groups, wrapped with IResponsePackage</returns>
        [HttpGet]
        public JsonResult GetControlTypeGroupList()
        {
            var list = new ControlTypeGroupBLL().GetControlTypeGroupList();
            list.Add(ControlTypeGroupBLL.ALL_INSTANCE);
            return Json(this.CreateResponsePackage(list), JsonRequestBehavior.AllowGet);
        }

    }
}