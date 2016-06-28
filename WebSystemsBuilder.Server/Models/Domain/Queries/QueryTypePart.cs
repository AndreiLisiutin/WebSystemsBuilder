using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_query_type_part", Schema = "public")]
    public class QueryTypePart
    {
        [Key]
        [Column("query_type_part_id")]
        public int QueryTypePartID { get; set; }
        [Column("query_type_id")]
        public int QueryTypeID { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("sql")]
        public string Sql { get; set; }
        [Column("query_type_placeholder")]
        public string QueryTypePlaceholder { get; set; }
    }
}
