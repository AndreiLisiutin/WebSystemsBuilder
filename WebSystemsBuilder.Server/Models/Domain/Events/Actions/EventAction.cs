using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_action", Schema = "public")]
    public class EventAction
    {
        [Key]
        [Column("action_id")]
        public int ActionID { get; set; }
        [Column("action_id_parent")]
        public int? ActionIDParent { get; set; }
        [Column("event_id")]
        public int EventID { get; set; }
    }
}
