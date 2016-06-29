using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_query_in", Schema = "public")]
    public class QueryIn
    {
        [Key]
        [Column("query_in_id")]
        public int QueryInID { get; set; }
        [Column("query_type_in_id")]
        public int QueryTypeInID { get; set; }
        [Column("query_id")]
        public int QueryID { get; set; }
        [Column("operand_id_value")]
        public int OperandIDValue { get; set; }
    }
}
