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
        public DbSet<Operand> Operands { get; set; }

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

        public DbSet<Query> Queries { get; set; }
        public DbSet<QueryIn> QueryIns { get; set; }
        public DbSet<QueryOut> QueryOuts { get; set; }
        public DbSet<QueryPart> QueryParts { get; set; }

        public DbSet<Event> Events { get; set; }
        public DbSet<EventType> EventTypes { get; set; }
        public DbSet<EventTypeControlType> EventTypeControlTypes { get; set; }
        public DbSet<EventAction> EventActions { get; set; }
        public DbSet<ClientAction> ClientActions { get; set; }
        public DbSet<ClientActionType> ClientActionTypes { get; set; }
        public DbSet<ClientActionTypeControlType> ClientActionTypeControlTypes { get; set; }
        public DbSet<OpenFormAction> OpenFormActions { get; set; }
        public DbSet<OpenFormActionParameter> OpenFormActionParameters { get; set; }
        public DbSet<PredicateAction> PredicateActions { get; set; }
        public DbSet<PredicateOperation> PredicateOperations { get; set; }
    }
}
