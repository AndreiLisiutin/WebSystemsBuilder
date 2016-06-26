using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebSystemsBuilder.Server;

namespace WebSystemsBuilder.ClientWeb
{
    public class BaseController : Controller
    {
        public BaseController()
        {
#warning IoC
            this._packageManager = new BasePackageManager();
        }
        protected IPackageManager _packageManager;

        #region IPackageManager
        IRequestPackage CreateRequestPackage()
        {
            return this._packageManager.CreateRequestPackage();
        }
        IRequestPackage<T> CreateRequestPackage<T>()
        {
            return this._packageManager.CreateRequestPackage<T>();
        }
        IResponsePackage CreateResponsePackage()
        {
            return this._packageManager.CreateResponsePackage();
        }
        IResponsePackage CreateResponsePackage(Exception ex)
        {
            return this._packageManager.CreateResponsePackage(ex);
        }
        IResponsePackage<T> CreateResponsePackage<T>()
        {
            return this._packageManager.CreateResponsePackage<T>();
        }
        IResponsePackage<T> CreateResponsePackage<T>(Exception ex)
        {
            return this._packageManager.CreateResponsePackage<T>(ex);
        }
        IResponsePackage<T> CreateResponsePackage<T>(T data)
        {
            return this._packageManager.CreateResponsePackage<T>(data);
        }
        #endregion IPackageManager
    }
}