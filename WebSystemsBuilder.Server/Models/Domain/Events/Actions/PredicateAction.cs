using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_predicate_action", Schema = "public")]
    public class PredicateAction
    {
        [Key]
        [Column("action_id")]
        public int ActionID { get; set; }
        [Column("operand_id_first")]
        public int OperandIDFirst { get; set; }
        [Column("operand_id_second")]
        public int OperandIDSecond { get; set; }
        [Column("action_id_true")]
        public int ActionIDTrue { get; set; }
        [Column("action_id_false")]
        public int ActionIDFalse { get; set; }
        [Column("predicate_operation_id")]
        public int PredicateOperationID { get; set; }
    }
}
