using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_property", Schema = "public")]
    public class Property
    {
        [Key]
        [Column("property_id")]
        public int PropertyID { get; set; }
        [Column("control_id")]
        public int ControlID { get; set; }
        [Column("control_type_property_type_id")]
        public int ControlTypePropertyTypeID { get; set; }
        [Column("value")]
        public string Value { get; set; }
    }
}
