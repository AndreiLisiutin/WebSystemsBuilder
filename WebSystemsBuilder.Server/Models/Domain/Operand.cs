using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_operand", Schema = "public")]
    public class Operand
    {
        [Key]
        [Column("operand_id")]
        public int OperandID { get; set; }
    }
}
