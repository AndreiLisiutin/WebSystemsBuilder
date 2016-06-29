using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_query_out", Schema = "public")]
    public class QueryOut
    {
        [Key]
        [Column("query_out_id")]
        public int QueryOutID { get; set; }
        [Column("query_type_out_id")]
        public int QueryTypeOutID { get; set; }
        [Column("query_id")]
        public int QueryID { get; set; }
        [Column("operand_id")]
        public int OperandID { get; set; }
    }
}
