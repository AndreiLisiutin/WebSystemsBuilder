using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_event", Schema = "public")]
    public class Event
    {
        [Key]
        [Column("event_id")]
        public int EventID { get; set; }
        [Column("event_type_control_type_id")]
        public int EventTypeControlTypeID { get; set; }
        [Column("control_id")]
        public int ControlID { get; set; }
    }
}
