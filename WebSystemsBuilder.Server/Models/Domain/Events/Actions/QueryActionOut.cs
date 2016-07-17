using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_query_action_out", Schema = "public")]
    public class QueryActionOut
    {
        [Key]
        [Column("query_action_out_id")]
        public int QueryActionOutID { get; set; }
        [Column("query_action_id")]
        public int QueryActionID { get; set; }
        [Column("query_type_out_id")]
        public int QueryTypeOutID { get; set; }
        [Column("operand_id_value")]
        public int OperandIDValue { get; set; }
    }
}
