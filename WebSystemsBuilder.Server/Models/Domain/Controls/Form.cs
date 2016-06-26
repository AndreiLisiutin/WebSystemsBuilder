using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_form", Schema = "public")]
    public class Form
    {
        [Key]
        [Column("form_id")]
        public int FormID { get; set; }
        [Column("control_id_root")]
        public int ControlIDRoot { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("description")]
        public string Description { get; set; }
    }
}
