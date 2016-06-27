using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_control_type", Schema = "public")]
    public class ControlType
    {
        [Key]
        [Column("control_type_id")]
        public int ControlTypeID { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("control_type_group_id")]
        public int ControlTypeGroupID { get; set; }
        [Column("description")]
        public string Description { get; set; }
        [Column("extjs_class")]
        public string ExtJsClass { get; set; }
    }
}
