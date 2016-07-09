﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebSystemsBuilder.Server;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.ClientWeb
{
    public class MainIDEController : BaseController
    {
        /// <summary> 
        /// Get list of all control types, allowed in system
        /// </summary>
        /// <returns>List with all control types, wrapped with IResponsePackage</returns>
        [HttpGet]
        public JsonResult GetControlTypeList()
        {
            var list = new ControlTypeBLL().GetControlTypeList();
            return Json(this.CreateResponsePackage(list), JsonRequestBehavior.AllowGet);
        }

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

        /// <summary> 
        /// Get list of all control type dependencies in system
        /// </summary>
        /// <returns>List with all control type dependencies, wrapped with IResponsePackage</returns>
        [HttpGet]
        public JsonResult GetControlTypeDependencies()
        {
            var list = new ControlTypeBLL().GetControlTypeDependencies();
            return Json(this.CreateResponsePackage(list), JsonRequestBehavior.AllowGet);
        }

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

        /// <summary>
        /// Save all the form meta-descriptions
        /// </summary>
        /// <param name="obj">Object with form meta-descriptions</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult SaveMetaDescriptions(FormInstance obj)
        {
            if (obj.Form.FormID > 0)
            {
                obj = new FormBll().EditFormMetaDescriptions(obj);
            }
            else
            {
                obj = new FormBll().AddFormMetaDescriptions(obj);
            }
            return Json(this.CreateResponsePackage<FormInstance>(obj), JsonRequestBehavior.AllowGet);
        }

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