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