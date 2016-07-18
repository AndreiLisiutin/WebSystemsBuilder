using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebSystemsBuilder.Server;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.ClientWeb
{
    public class EventTypeController : BaseController
    {
        /// <summary> 
        /// Get all clent action types
        /// </summary>
        /// <returns>List with all clent action types, wrapped with IResponsePackage</returns>
        [HttpGet]
        public JsonResult GetClientActionTypeList()
        {
            var list = new ClientActionTypeBll().GetClientActionTypeList();
            return Json(this.CreateResponsePackage(list), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Get all pairs of control types and event types
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult GetEventTypeControlTypeList()
        {
            var list = new EventTypeControlTypeBLL().GetEventTypeControlTypeList();
            return Json(this.CreateResponsePackage(list), JsonRequestBehavior.AllowGet);
        }
    }
}