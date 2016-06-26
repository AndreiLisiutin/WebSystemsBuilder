using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_control_type_property_type", Schema = "public")]
    public class ControlTypePropertyType
    {
        [Key]
        [Column("control_type_property_type_id")]
        public int ControlTypePropertyTypeID { get; set; }
        [Column("control_type_id")]
        public int ControlTypeID { get; set; }
        [Column("property_type_id")]
        public int PropertyTypeID { get; set; }
        [Column("default_value")]
        public string DefaultValue { get; set; }
    }
}
