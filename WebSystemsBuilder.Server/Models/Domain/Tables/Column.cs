using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{ 
    [Table("wb_column", Schema = "public")]
    public class Column
    {
        [Key]
        [Column("column_id")]
        public int ColumnID { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("physical_column")]
        public string PhysicalColumn { get; set; }
        [Column("value_type_id")]
        public int ValueTypeID { get; set; }
        [Column("table_id")]
        public int TableID { get; set; }
    }
}
