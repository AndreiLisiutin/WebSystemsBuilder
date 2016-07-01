using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    class ClientActionInstance : BaseActionInstance
    {
        public ClientActionInstance()
            : base()
        {
        }
        public ClientActionInstance(EventAction EventAction, ClientAction ClientAction,
            ClientActionTypeControlType ClientActionTypeControlType, ClientActionType ClientActionType)
            : base(EventAction)
        {
            this.ClientAction = ClientAction;
            this.ClientActionTypeControlType = ClientActionTypeControlType;
            this.ClientActionType = ClientActionType;
        }
        public ClientAction ClientAction { get; set; }
        public ClientActionTypeControlType ClientActionTypeControlType { get; set; }
        public ClientActionType ClientActionType { get; set; }

        public override int ActionTypeID
        {
            get
            {
                return (int)ActionTypeEnum.Client;
            }
        }
    }
}
