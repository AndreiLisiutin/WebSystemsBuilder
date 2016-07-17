using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_client_action", Schema = "public")]
    public class ClientAction
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("action_id")]
        public int ActionID { get; set; }
        [Column("control_id")]
        public int ControlID { get; set; }
        [Column("client_action_type_control_type_id")]
        public int ClientActionTypeControlTypeID { get; set; }
        [NotMapped]
        public int ControlUniqueID { get; set; }
    }
}
