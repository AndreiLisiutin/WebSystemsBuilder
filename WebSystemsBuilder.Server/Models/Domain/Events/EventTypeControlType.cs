using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_event_type_control_type", Schema = "public")]
    public class EventTypeControlType
    {
        [Key]
        [Column("event_type_control_type_id")]
        public int EventTypeControlTypeID { get; set; }
        [Column("event_type_id")]
        public int EventTypeID { get; set; }
        [Column("control_type_id")]
        public int ControlTypeID { get; set; }
    }
}
