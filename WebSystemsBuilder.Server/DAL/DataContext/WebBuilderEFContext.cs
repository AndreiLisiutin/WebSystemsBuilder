using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.Server
{
    public class WebBuilderEFContext : DbContext
    {
        static WebBuilderEFContext()
        {
            Database.SetInitializer<WebBuilderEFContext>(new NullDatabaseInitializer<WebBuilderEFContext>());
        }

        public WebBuilderEFContext(string connectionString)
            : base(connectionString)
        {
        }
        public WebBuilderEFContext(DbConnection connection, bool contextOwnsConnection = true)
            : base(connection, contextOwnsConnection)
        {
        }

        public DbSet<Control> Controls { get; set; }
        public DbSet<ControlType> ControlTypes { get; set; }
        public DbSet<ControlTypeDependency> ControlTypeDependencies { get; set; }
        public DbSet<ControlTypeGroup> ControlTypeGroups { get; set; }
        public DbSet<ControlTypePropertyType> ControlTypePropertyTypes { get; set; }
        public DbSet<Property> Properties { get; set; }
        public DbSet<Form> Forms { get; set; }
        public DbSet<FormParameter> FormParameters { get; set; }
        public DbSet<PropertyType> PropertyTypes { get; set; }
        public DbSet<PropertyValueType> PropertyValueTypes { get; set; }

        public DbSet<QueryType> QueryTypes { get; set; }
        public DbSet<QueryTypeColumn> QueryTypeColumns { get; set; }
        public DbSet<QueryTypeIn> QueryTypeIns { get; set; }
        public DbSet<QueryTypeOut> QueryTypeOuts { get; set; }
        public DbSet<QueryTypePart> QueryTypeParts { get; set; }
        public DbSet<QueryTypeTable> QueryTypeTables { get; set; }

        public DbSet<Table> Tables { get; set; }
        public DbSet<Column> Columns { get; set; }
    }
}
