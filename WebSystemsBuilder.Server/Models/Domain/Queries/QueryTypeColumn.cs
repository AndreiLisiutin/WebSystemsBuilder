using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_query_type_column", Schema = "public")]
    public class QueryTypeColumn
    {
        [Key]
        [Column("query_type_column_id")]
        public int QueryTypeColumnID { get; set; }
        [Column("query_type_id")]
        public int QueryTypeID { get; set; }
        [Column("column_id")]
        public int ColumnID { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("query_type_placeholder")]
        public string QueryTypePlaceholder { get; set; }
    }
}
