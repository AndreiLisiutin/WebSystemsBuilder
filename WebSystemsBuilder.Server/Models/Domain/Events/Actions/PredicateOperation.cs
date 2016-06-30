using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_predicate_operation", Schema = "public")]
    public class PredicateOperation
    {
        [Key]
        [Column("predicate_operation_id")]
        public int PredicateOperationID { get; set; }
        [Column("name")]
        public string Name { get; set; }
    }
}
