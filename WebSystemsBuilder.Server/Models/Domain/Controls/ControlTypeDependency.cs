using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_control_type_dependency", Schema = "public")]
    public class ControlTypeDependency
    {
        [Key]
        [Column("control_type_dependency_id")]
        public int ControlTypeDependencyID { get; set; }
        [Column("control_type_id_parent")]
        public int ControlTypeIDParent { get; set; }
        [Column("control_type_id_child")]
        public int ControlTypeIDChild { get; set; }
    }
}
