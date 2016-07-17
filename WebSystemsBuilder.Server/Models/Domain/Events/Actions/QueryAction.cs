using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_query_action", Schema = "public")]
    public class QueryAction
    {
        [Key]
        [Column("action_id")]
        public int ActionID { get; set; }
        [Column("query_type_id")]
        public int QueryTypeID { get; set; }
    }
}
