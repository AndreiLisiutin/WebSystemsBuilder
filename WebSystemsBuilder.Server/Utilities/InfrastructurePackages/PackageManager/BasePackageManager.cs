using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebSystemsBuilder.Server
{
    public class BasePackageManager : IPackageManager
    {
        public IRequestPackage CreateRequestPackage()
        {
            return new BaseRequestPackage();
        }
        public IResponsePackage CreateResponsePackage()
        {
            return new BaseResponsePackage();
        }
        public IRequestPackage<T> CreateRequestPackage<T>()
        {
            return new BaseRequestPackage<T>();
        }
        public IResponsePackage<T> CreateResponsePackage<T>()
        {
            return new BaseResponsePackage<T>();
        }
        public IResponsePackage CreateResponsePackage(Exception ex)
        {
            IResponsePackage response = this.CreateResponsePackage();
            response.Code = -1;
            response.Message = ex.Message;
            return response;
        }
        public IResponsePackage<T> CreateResponsePackage<T>(Exception ex)
        {
            IResponsePackage<T> response = this.CreateResponsePackage<T>();
            response.Code = -1;
            response.Message = ex.Message;
            return response;
        }
        public IResponsePackage<T> CreateResponsePackage<T>(T data)
        {
            IResponsePackage<T> response = this.CreateResponsePackage<T>();
            response.Data = data;
            return response;
        }
    }
}
