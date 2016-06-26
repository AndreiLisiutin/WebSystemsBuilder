using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_property_type", Schema = "public")]
    public class PropertyType
    {
        [Key]
        [Column("property_type_id")]
        public int PropertyTypeID { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("value_type_id")]
        public int ValueTypeID { get; set; }
    }
}
