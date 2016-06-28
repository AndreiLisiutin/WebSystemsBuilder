using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    [Table("wb_table", Schema = "public")]
    public class Table
    {
        [Key]
        [Column("table_id")]
        public int TableID { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("physical_table")]
        public string PhysicalTable { get; set; }
    }
}
