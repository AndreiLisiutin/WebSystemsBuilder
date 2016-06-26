using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_control_type_group", Schema = "public")]
    public class ControlTypeGroup
    {
        [Key]
        [Column("control_type_group_id")]
        public int ControlTypeGroupID { get; set; }
        [Column("name")]
        public string Name { get; set; }
    }
}
