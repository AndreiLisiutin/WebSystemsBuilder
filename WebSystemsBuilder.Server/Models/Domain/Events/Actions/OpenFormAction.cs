using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_open_form_action", Schema = "public")]
    public class OpenFormAction
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("action_id")]
        public int ActionID { get; set; }
        [Column("form_id")]
        public int FormID { get; set; }
    }
}
