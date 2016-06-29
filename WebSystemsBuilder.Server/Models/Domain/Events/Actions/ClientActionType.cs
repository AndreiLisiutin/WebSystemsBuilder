using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_client_action_type", Schema = "public")]
    public class ClientActionType
    {
        [Key]
        [Column("client_action_type_id")]
        public int ClientActionTypeID { get; set; }
        [Column("name")]
        public string Name { get; set; }
    }
}
