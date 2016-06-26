using System.Web;
using System.Web.Mvc;

namespace WebSystemsBuilder.ClientWeb
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new ErrorHandlerAttribute());
            filters.Add(new HandleErrorAttribute());
        }
    }
}
