using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebSystemsBuilder.Server
{
    public interface IRequestPackage
    {
    }

    public interface IRequestPackage<T> : IRequestPackage
    {
        T Data { get; set; }
    }
}
