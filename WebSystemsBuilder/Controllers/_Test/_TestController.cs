using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebSystemsBuilder.Server;

namespace WebSystemsBuilder.ClientWeb
{
    public class _TestController : Controller
    {
        public ActionResult TestEF()
        {
            try 
            {
                using (var db = new WebBuilderEFContext("WebBuilder"))
                {
                    db.ControlTypes.ToList();
                    return Json("OK", JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(ex, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult TestErrorsHandling()
        {
            throw new Exception("Test");
        }
    }
}