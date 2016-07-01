using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_query_action_in", Schema = "public")]
    public class QueryActionIn
    {
        [Key]
        [Column("query_action_in_id")]
        public int QueryActionInID { get; set; }
        [Column("query_type_in_id")]
        public int QueryTypeInID { get; set; }
        [Column("query_action_id")]
        public int QueryActionID { get; set; }
        [Column("operand_id_value")]
        public int OperandIDValue { get; set; }
    }
}
