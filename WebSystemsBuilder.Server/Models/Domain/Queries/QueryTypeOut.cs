using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{ 
    [Table("wb_query_type_out", Schema = "public")]
    public class QueryTypeOut
    {
        [Key]
        [Column("query_type_out_id")]
        public int QueryTypeOutID { get; set; }
        [Column("query_type_id")]
        public int QueryTypeID { get; set; }
        [Column("value_type_id")]
        public int ValueTypeID { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("query_type_alias")]
        public string QueryTypeAlias { get; set; }
        [Column("query_type_placeholder")]
        public string QueryTypePlaceholder { get; set; }
    }
}
