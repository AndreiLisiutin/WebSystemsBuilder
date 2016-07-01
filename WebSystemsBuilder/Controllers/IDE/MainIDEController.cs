using System;
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

    }
}