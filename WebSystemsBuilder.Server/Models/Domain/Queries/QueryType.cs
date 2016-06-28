using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_query_type", Schema = "public")]
    public class QueryType
    {
        [Key]
        [Column("query_type_id")]
        public int QueryTypeID { get; set; }
        [Column("sql")]
        public string Sql { get; set; }
        [Column("name")]
        public string Name { get; set; }
    }
}
