using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebSystemsBuilder.Server
{
    public interface IResponsePackage
    {
        int Code { get; set; }
        string Message { get; set; }
    }

    public interface IResponsePackage<T> : IResponsePackage
    {
        T Data { get; set; }
    }
}
