using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_client_action_type_control_type", Schema = "public")]
    public class ClientActionTypeControlType
    {
        [Key]
        [Column("client_action_type_control_type_id")]
        public int ClientActionTypeControlTypeID { get; set; }
        [Column("client_action_type_id")]
        public int ClientActionTypeID { get; set; }
        [Column("control_type_id")]
        public int ControlTypeID { get; set; }
    }
}
