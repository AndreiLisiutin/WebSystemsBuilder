using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_form_parameter", Schema = "public")]
    public class FormParameter
    {
        [Key]
        [Column("form_parameter_id")]
        public int FormParameterID { get; set; }
        [Column("form_id")]
        public int FormID { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("is_public")]
        public bool IsPublic { get; set; }
        [Column("value_type_id")]
        public int ValueTypeID { get; set; }
        [Column("operand_id")]
        public int OperandID { get; set; }
    }
}
