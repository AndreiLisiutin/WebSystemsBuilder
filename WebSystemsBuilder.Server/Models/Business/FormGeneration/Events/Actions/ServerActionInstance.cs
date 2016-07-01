using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    class ServerActionInstance : BaseActionInstance
    {
        public ServerActionInstance()
            : base()
        {
        }
        public ServerActionInstance(EventAction EventAction, ServerAction ServerAction)
            : base(EventAction)
        {
            this.ServerAction = ServerAction;
        }
        public ServerAction ServerAction { get; set; }

        public override int ActionTypeID
        {
            get
            {
                return (int)ActionTypeEnum.Server;
            }
        }
    }
}
