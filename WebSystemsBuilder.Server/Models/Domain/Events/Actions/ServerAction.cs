using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_server_action", Schema = "public")]
    public class ServerAction
    {
        [Key]
        [Column("action_id")]
        public int ActionID { get; set; }
        [Column("action_id_first")]
        public int? ActionIDFirst { get; set; }
    }
}
