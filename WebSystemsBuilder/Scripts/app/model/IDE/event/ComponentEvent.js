Ext.define('WebSystemsBuilder.model.IDE.event.ComponentEvent', {
    extend: 'Ext.data.Model',
    fields: [
        'Event',
        'EventType',
        'EventTypeControlType',
        'EventActions',
        {
            name: 'EventUniqueID',
            convert: function (v, record) {
                var event = record.get('Event');
                if (!event) return null;
                return event.EventUniqueID;
            }
        },
        {
            name: 'EventTypeID',
            convert: function (v, record) {
                var eventType = record.get('EventType');
                if (!eventType) return null;
                return eventType.EventTypeID;
            }
        },
        {
            name: 'Name',
            convert: function (v, record) {
                var eventType = record.get('EventType');
                if (!eventType) return null;
                return eventType.Name;
            }
        },
        {
            name: 'EventTypeControlTypeID',
            convert: function (v, record) {
                var eventTypeControlType = record.get('EventTypeControlType');
                if (!eventTypeControlType) return null;
                return eventTypeControlType.EventTypeControlTypeID;
            }
        },
        {
            name: 'ControlTypeID',
            convert: function (v, record) {
                var eventTypeControlType = record.get('EventTypeControlType');
                if (!eventTypeControlType) return null;
                return eventTypeControlType.ControlTypeID;
            }
        }
    ]
});