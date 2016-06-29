using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_event_type", Schema = "public")]
    public class EventType
    {
        [Key]
        [Column("event_type_id")]
        public int EventTypeID { get; set; }
        [Column("name")]
        public string Name { get; set; }
    }
}
