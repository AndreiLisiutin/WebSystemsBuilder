using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_query_type_in", Schema = "public")]
    public class QueryTypeIn
    {
        [Key]
        [Column("query_type_in_id")]
        public int QueryTypeInID { get; set; }
        [Column("query_type_id")]
        public int QueryTypeID { get; set; }
        [Column("value_type_id")]
        public int ValueTypeID { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("query_type_placeholder")]
        public string QueryTypePlaceholder { get; set; }
        [NotMapped]
        public int UniqueID { get; set; }
    }
}
