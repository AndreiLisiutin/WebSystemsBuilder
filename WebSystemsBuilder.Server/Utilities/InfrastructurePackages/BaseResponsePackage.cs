using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebSystemsBuilder.Server
{
    public class BaseResponsePackage : IResponsePackage
    {
        public int Code { get; set; }
        public string Message { get; set; }
    }

    public class BaseResponsePackage<T> : BaseResponsePackage, IResponsePackage<T>
    {
        public T Data { get; set; }
    }
}
