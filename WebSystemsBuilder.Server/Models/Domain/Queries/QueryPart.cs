using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_query_part", Schema = "public")]
    public class QueryPart
    {
        [Key]
        [Column("query_part_id")]
        public int QueryPartID { get; set; }
        [Column("query_id")]
        public int QueryID { get; set; }
        [Column("query_type_part_id")]
        public int QueryTypePartID { get; set; }
        [Column("operand_id_value")]
        public int OperandIDValue { get; set; }
    }
}
