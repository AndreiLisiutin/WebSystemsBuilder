using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class OperandValue
    {
        public OperandValue(int operandID, PropertyValueType valueType, string serializedValue)
        {
            this.OperandID = operandID;
            this.ValueType = valueType;

            this.Value = new DataTable();
            this.Value.Columns.Add("SerializedValue");
            this.SetSerializedValue(serializedValue);
        }
        public PropertyValueType ValueType { get; set; }
        public int OperandID { get; set; }
        public DataTable Value { get; set; }

        public void SetSerializedValue(string serializedValue)
        {
            int valueTypeID = this.ValueType.ValueTypeID;
            string format = this.ValueType.Format;
            bool isValueTypeCorrect = ValueTypeConverter
                .CheckValueTypeCorrectness(serializedValue, valueTypeID, format);
            if (!isValueTypeCorrect)
            {
                throw new FormGenerationException(string.Format(
                    "Operand value passed to server in incorrect format(SerializedValue = {0}, ValueTypeID = {1}, Format = {2})",
                        serializedValue,
                        valueTypeID,
                        format
                ));
            }

            this.Value.Rows.Clear();
            this.Value.Rows.Add(serializedValue);
        }
        public string GetSerializedValue()
        {
            if (this.Value.Rows.Count == 0)
            {
                return null;
            }
            return this.Value.Rows[0].Field<string>("SerializedValue");
        }
        public object GetDeserializedValue()
        {
            string serializedValue = this.GetSerializedValue();
            return ValueTypeConverter
                .Deserialize(serializedValue, this.ValueType.ValueTypeID, this.ValueType.Format);
        }
    }
}
