using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server
{
    public interface IPackageManager
    {
        IRequestPackage CreateRequestPackage();
        IRequestPackage<T> CreateRequestPackage<T>();
        IResponsePackage CreateResponsePackage();
        IResponsePackage CreateResponsePackage(Exception ex);
        IResponsePackage<T> CreateResponsePackage<T>();
        IResponsePackage<T> CreateResponsePackage<T>(Exception ex);
        IResponsePackage<T> CreateResponsePackage<T>(T data);
    }
}
