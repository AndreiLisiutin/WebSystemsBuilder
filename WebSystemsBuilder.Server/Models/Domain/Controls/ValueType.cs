using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_value_type", Schema = "public")]
    public class PropertyValueType
    {
        [Key]
        [Column("value_type_id")]
        public int ValueTypeID { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("format")]
        public string Format { get; set; }
    }
}
