using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebSystemsBuilder.Server
{
    public class BaseRequestPackage : IRequestPackage
    {
    }

    public class BaseRequestPackage<T> : BaseRequestPackage, IRequestPackage<T>
    {
        public T Data { get; set; }
    }
}
