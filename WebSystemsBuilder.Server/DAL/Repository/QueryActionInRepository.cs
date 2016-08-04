﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.Server.DAL
{
    public class QueryActionInRepository : GenericRepository<QueryActionIn>
    {
        public QueryActionInRepository(WebBuilderEFContext context) : base(context) { }
    }
}