﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public interface IValueTypeHandler
    {
        ValueTypeEnum ValueType { get; }
        object Deserialize(string serializedValue, string format);
        string Serialize(object value, string format);

        bool Equals(object x, object y);
        bool NotEquals(object x, object y);
        bool GreaterThan(object x, object y);
        bool LowerThan(object x, object y);
    }


}
