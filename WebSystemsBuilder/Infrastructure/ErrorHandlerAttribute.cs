using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using WebSystemsBuilder.Server;

namespace WebSystemsBuilder.ClientWeb
{
    public class ErrorHandlerAttribute : HandleErrorAttribute
    {
        private IPackageManager _packageManager;
        public ErrorHandlerAttribute()
        {
            this._packageManager = new BasePackageManager();
        }
        public override void OnException(ExceptionContext filterContext)
        {
            if (filterContext.HttpContext.Request.IsAjaxRequest() && filterContext.Exception != null)
            {
                filterContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                filterContext.Result = new JsonResult
                {
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    Data = _packageManager.CreateResponsePackage(filterContext.Exception)
                };
                filterContext.ExceptionHandled = true;
            }
            else
            {
                base.OnException(filterContext);
            }
        }
    }
}