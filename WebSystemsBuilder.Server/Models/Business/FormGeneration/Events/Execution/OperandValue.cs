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
        private const string _columnName = "SerializedValue";
        private DataTable _value;
        public OperandValue(int operandID, PropertyValueType valueType, string serializedValue)
        {
            this.OperandID = operandID;
            this.ValueType = valueType;

            this._value = new DataTable();
            this._value.Columns.Add(_columnName);
            this.SetSerializedValue(serializedValue);
        }
        public PropertyValueType ValueType { get; set; }
        public int OperandID { get; set; }

        public List<string> Value
        {
            get
            {
                if (this._value == null)
                {
                    return null;
                }

                return this._value
                    .AsEnumerable()
                    .Select(e => e.Field<string>(_columnName))
                    .ToList();
            }
        }

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

            this._value.Rows.Clear();
            this._value.Rows.Add(serializedValue);
        }

        public void SetDeserializedValues(List<object> deserializedArray)
        {
            int valueTypeID = this.ValueType.ValueTypeID;
            string format = this.ValueType.Format;
            try
            {
                var serializedArray = deserializedArray
                    .Select(e => ValueTypeConverter.Serialize(e, valueTypeID, format))
                    .ToArray();
                this._value.Rows.Clear();
                this._value.Rows.Add(serializedArray);
            }
            catch (Exception ex)
            {
                throw new FormGenerationException(string.Format(
                    "Could not convert data set to value type (valueTypeID = {0})",
                        valueTypeID
                ), ex);
            }
        }

        public string GetSerializedValue()
        {
            if (this.Value.Count == 0)
            {
                return null;
            }
            return this.Value[0];
        }
        public object GetDeserializedValue()
        {
            string serializedValue = this.GetSerializedValue();
            return ValueTypeConverter
                .Deserialize(serializedValue, this.ValueType.ValueTypeID, this.ValueType.Format);
        }
    }
}
