using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_query_action_part", Schema = "public")]
    public class QueryActionPart
    {
        [Key]
        [Column("query_action_part_id")]
        public int QueryActionPartID { get; set; }
        [Column("query_action_id")]
        public int QueryActionID { get; set; }
        [Column("query_type_part_id")]
        public int QueryTypePartID { get; set; }
        [Column("operand_id_value")]
        public int OperandIDValue { get; set; }
    }
}
