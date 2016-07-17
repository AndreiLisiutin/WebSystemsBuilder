using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_open_form_action_parameter", Schema = "public")]
    public class OpenFormActionParameter
    {
        [Key]
        [Column("open_form_action_parameter_id")]
        public int OpenFormActionParameterID { get; set; }
        [Column("form_parameter_id")]
        public int FormParameterID { get; set; }
        [Column("operand_id_value")]
        public int OperandIDValue { get; set; }
        [Column("open_form_action_id")]
        public int OpenFormActionID { get; set; }
        [NotMapped]
        public int OperandUniqueID { get; set; }
    }
}
