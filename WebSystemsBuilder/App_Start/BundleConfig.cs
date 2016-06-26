using System.Web;
using System.Web.Optimization;

namespace WebSystemsBuilder.ClientWeb
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/extjs").Include("~/Scripts/ext/build/ext-all.js"));
            bundles.Add(new ScriptBundle("~/bundles/viewport").Include("~/Scripts/app/app.js"));
            bundles.Add(new StyleBundle("~/content/extjs").Include("~/Scripts/ext/build/classic/theme-classic/resources/theme-classic-all.css"));
        }
    }
}
