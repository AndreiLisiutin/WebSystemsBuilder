using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebSystemsBuilder.Server;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.ClientWeb
{
    public class TableController : BaseController
    {
        /// <summary>
        /// Get all tables list
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult GetTableList()
        {
            var list = new TableBLL().GetTableList();
            return Json(this.CreateResponsePackage(list), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Get all table columns list
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult GetTableColumnList(int tableID)
        {
            var list = new ColumnBLL().GetTableColumnList(tableID);
            return Json(this.CreateResponsePackage(list), JsonRequestBehavior.AllowGet);
        }

    }
}