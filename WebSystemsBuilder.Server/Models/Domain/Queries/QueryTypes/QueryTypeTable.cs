using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{ 
    [Table("wb_query_type_table", Schema = "public")]
    public class QueryTypeTable
    {
        [Key]
        [Column("query_type_table_id")]
        public int QueryTypeTableID { get; set; }
        [Column("query_type_id")]
        public int QueryTypeID { get; set; }
        [Column("table_id")]
        public int TableID { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("query_type_placeholder")]
        public string QueryTypePlaceholder { get; set; }
    }
}
