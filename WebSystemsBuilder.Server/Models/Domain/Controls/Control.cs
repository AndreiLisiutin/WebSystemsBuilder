using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_control", Schema = "public")]
    public class Control
    {
        [Key]
        [Column("control_id")]
        public int ControlID { get; set; }
        [Column("form_id")]
        public int FormID { get; set; }
        [Column("control_type_id")]
        public int ControlTypeID { get; set; }
        [Column("control_id_parent")]
        public int? ControlIDParent { get; set; }
    }
}
