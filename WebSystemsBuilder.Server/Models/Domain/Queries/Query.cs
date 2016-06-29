using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_query", Schema = "public")]
    public class Query
    {
        [Key]
        [Column("query_id")]
        public int QueryID { get; set; }
        [Column("query_type_id")]
        public int QueryTypeID { get; set; }
        [Column("form_id")]
        public int FormID { get; set; }
    }
}
