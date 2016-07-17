using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.Server
{
    public class FormBll : ConnectionFactory
    {
        /// <summary>
        /// Get all forms list
        /// </summary>
        /// <returns></returns>
        public List<Form> GetFormList()
        {
            using (var db = this.CreateContext())
            {
                return db.Forms.ToList();
            }
        }

        /// <summary>
        /// Get all form parameters list of current form
        /// </summary>
        /// <returns></returns>
        public List<FormParameter> GetFormParametersList(int formID)
        {
            using (var db = this.CreateContext())
            {
                return db.FormParameters.Where(x => x.FormID == formID).ToList();
            }
        }
        
        /// <summary>
        /// Add new form - Save all the form meta descriptions
        /// </summary>
        /// <param name="formInstance">Form meta-descriptions to save</param>
        /// <returns></returns>
        public FormInstance AddFormMetaDescriptions(FormInstance formInstance)
        {
            // Dictionary<UniqueID, ControlID>
            Dictionary<int, OperandInstance> uniqueIDDictionary = new Dictionary<int, OperandInstance>(); 

            using (var db = this.CreateContext())
            {
                using (var transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        // Save Form
                        db.Forms.Add(formInstance.Form);
                        db.SaveChanges();

                        // Save Form Parameters
                        if (formInstance.FormParameters != null)
                        {
                            foreach (var formParameter in formInstance.FormParameters)
                            {
                                formParameter.FormParameter.FormID = formInstance.Form.FormID;

                                var operand = db.Operands.Add(new Operand());
                                db.SaveChanges();
                                formParameter.FormParameter.OperandID = operand.OperandID;

                                db.FormParameters.Add(formParameter.FormParameter);
                                db.SaveChanges();

                                OperandInstance currentOperand = new OperandInstance()
                                {
                                    ObjectID = formParameter.FormParameter.FormParameterID,
                                    UniqueID = formParameter.FormParameter.UniqueID,
                                    OperandID = formParameter.FormParameter.OperandID
                                };
                                uniqueIDDictionary.Add(formParameter.FormParameter.UniqueID, currentOperand);
                            }
                        }

                        // Recursive save all the controls of the form
                        formInstance.RootControl.Control.FormID = formInstance.Form.FormID;
                        this.SaveControl(formInstance.RootControl, db, transaction);

                        // Dictionary<UniqueID, ControlID>
                        Dictionary<int, OperandInstance> controlIDuniqueIDDictionary = GetUniqueIDControlIDDictionary(formInstance.RootControl, db, transaction);
                        controlIDuniqueIDDictionary.ToList().ForEach(x => uniqueIDDictionary.Add(x.Key, x.Value));
                        
                        // Recursive save all events
                        this.SaveControlEvents(controlIDuniqueIDDictionary, formInstance.RootControl, db, transaction);

                        // Commit transaction
                        db.SaveChanges();
                        transaction.Commit();

                        return formInstance;
                    }
                    catch (Exception)
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }

        /// <summary>
        /// Edit existing form - Save all the form meta descriptions
        /// </summary>
        /// <param name="formInstance">Form meta-descriptions to save</param>
        /// <returns></returns>
        public FormInstance EditFormMetaDescriptions(FormInstance formInstance)
        {
            using (var db = this.CreateContext())
            {
                using (var transaction = db.Database.BeginTransaction())
                {
                    try
                    {
                        // Save Form
                        var originalForm = db.Forms.Find(formInstance.Form.FormID);
                        if (originalForm != null)
                        {
                            db.Entry(originalForm).CurrentValues.SetValues(formInstance.Form);
                            db.SaveChanges();
                        }

                        // Save Form Parameters
                        if (formInstance.FormParameters != null)
                        {
                            // Delete old parameters
                            var oldFormParameters = db.FormParameters
                                .Where(x => x.FormID == formInstance.Form.FormID).ToList()
                                .Where(x => !formInstance.FormParameters.Select(p => p.FormParameter.FormParameterID).Contains(x.FormParameterID)).ToList();
                            List<Operand> oldOperandsList = new List<Operand>();
                            foreach (int operandID in oldFormParameters.Where(x => x.OperandID > 0).Select(x => x.OperandID))
                            {
                                var oldOperand = db.Operands.SingleOrDefault(x => x.OperandID == operandID);
                                oldOperandsList.Add(oldOperand);
                            }
                            db.FormParameters.RemoveRange(oldFormParameters);
                            db.SaveChanges();
                            db.Operands.RemoveRange(oldOperandsList);
                            db.SaveChanges();

                            // Save new form parameters
                            foreach (var formParameter in formInstance.FormParameters)
                            {
                                formParameter.FormParameter.FormID = formInstance.Form.FormID;

                                if (formParameter.FormParameter.OperandID <= 0)
                                {
                                    // Adding
                                    var operand = db.Operands.Add(new Operand());
                                    db.SaveChanges();
                                    formParameter.FormParameter.OperandID = operand.OperandID;

                                    db.FormParameters.Add(formParameter.FormParameter);
                                }
                                else
                                {
                                    var originalParameter = db.FormParameters.Find(formParameter.FormParameter.FormParameterID);
                                    if (originalParameter != null)
                                    {
                                        db.Entry(originalParameter).CurrentValues.SetValues(formParameter.FormParameter);
                                    }
                                }

                                db.SaveChanges();
                            }
                        }
                        else
                        {
                            var formParametersList = db.FormParameters.Where(x => x.FormID == formInstance.Form.FormID).ToList();
                            List<Operand> oldOperandsList = new List<Operand>();
                            foreach (int operandID in formParametersList.Where(x => x.OperandID > 0).Select(x => x.OperandID))
                            {
                                var oldOperand = db.Operands.SingleOrDefault(x => x.OperandID == operandID);
                                oldOperandsList.Add(oldOperand);
                            }
                            db.FormParameters.RemoveRange(formParametersList);
                            db.SaveChanges();
                            db.Operands.RemoveRange(oldOperandsList);
                            db.SaveChanges();
                        }

                        // Recursive save all the controls of the form
                        formInstance.RootControl.Control.FormID = formInstance.Form.FormID;
                        this.SaveControl(formInstance.RootControl, db, transaction);

                        //this.SaveControlEvents(formInstance.RootControl, db, transaction);

                        // Commit transaction
                        db.SaveChanges();
                        transaction.Commit();

                        return formInstance;
                    }
                    catch (Exception)
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }

        /// <summary>
        /// Recursive function - save control, it's propeties and child controls
        /// </summary>
        /// <param name="currentControl"></param>
        /// <param name="db"></param>
        /// <param name="transaction"></param>
        /// <returns></returns>
        public ControlInstance SaveControl(ControlInstance currentControl, WebBuilderEFContext db, DbContextTransaction transaction)
        {
            if (currentControl == null)
            {
                return currentControl;
            }

            // Save current control
            if (currentControl.Control.OperandID == null || currentControl.Control.OperandID <= 0)
            {
                // Get OperandID
                var operand = db.Operands.Add(new Operand());
                db.SaveChanges();
                currentControl.Control.OperandID = operand.OperandID;

                // Add current control
                db.Controls.Add(currentControl.Control);
            }
            else
            {
                // Edit current control
                var originalControl = db.Controls.Find(currentControl.Control.ControlID);
                if (originalControl != null)
                {
                    db.Entry(originalControl).CurrentValues.SetValues(currentControl.Control);
                }
            }
            db.SaveChanges();

            // Save all the control properties
            if (currentControl.Properties != null)
            {
                // Delete old properties
                var oldProperties = db.Properties
                    .Where(x => x.ControlID == currentControl.Control.ControlID)
                    .ToList()
                    .Where(x => !currentControl.Properties.Select(p => p.Property.PropertyID).Contains(x.PropertyID))
                    .ToList();
                db.Properties.RemoveRange(oldProperties);
                db.SaveChanges();

                foreach (PropertyInstance currentProperty in currentControl.Properties)
                {
                    currentProperty.Property.ControlID = currentControl.Control.ControlID;

                    if (currentProperty.Property.PropertyID <= 0)
                    {
                        // Add property
                        var operand = db.Operands.Add(new Operand());
                        db.Properties.Add(currentProperty.Property);
                    }
                    else
                    {
                        // Edit property
                        var originalProperty = db.Properties.Find(currentProperty.Property.PropertyID);
                        if (originalProperty != null)
                        {
                            db.Entry(originalProperty).CurrentValues.SetValues(currentProperty.Property);
                        }
                    }
                    db.SaveChanges();
                }
            }
            else
            {
                var oldPropertiesList = db.Properties.Where(x => x.ControlID == currentControl.Control.ControlID).ToList();
                db.Properties.RemoveRange(oldPropertiesList);
                db.SaveChanges();
            }

            // Children controls
            if (currentControl.ChildControls != null)
            {
                var oldChildControls = db.Controls
                    .Where(x => x.ControlIDParent == currentControl.Control.ControlID).ToList()
                    .Where(x => !currentControl.ChildControls.Select(p => p.Control.ControlID).Contains(x.ControlID)).ToList();
                List<Operand> oldOperandsList = new List<Operand>();
                foreach (int operandID in oldChildControls.Where(x => x.OperandID > 0).Select(x => x.OperandID))
                {
                    var oldOperand = db.Operands.SingleOrDefault(x => x.OperandID == operandID);
                    oldOperandsList.Add(oldOperand);
                }
                List<Property> oldPropertiesList = new List<Property>();
                foreach (var controlID in oldChildControls.Select(x => x.ControlID))
                {
                    var oldProperties = db.Properties.Where(x => x.ControlID == controlID).ToList();
                    oldPropertiesList.AddRange(oldProperties);
                }
                db.Properties.RemoveRange(oldPropertiesList);
                db.SaveChanges();
                db.Controls.RemoveRange(oldChildControls);
                db.SaveChanges();
                db.Operands.RemoveRange(oldOperandsList);
                db.SaveChanges();

                // Recursion: save child controls
                for (int i = 0; i < currentControl.ChildControls.Count; i++)
                {
                    ControlInstance currentChildControl = currentControl.ChildControls[i];
                    currentChildControl.Control.FormID = currentControl.Control.FormID;
                    currentChildControl.Control.ControlIDParent = currentControl.Control.ControlID;
                    this.SaveControl(currentChildControl, db, transaction);
                }
            }
            else
            {
                var oldChildControls = db.Controls.Where(x => x.ControlIDParent == currentControl.Control.ControlID).ToList();
                List<Operand> oldOperandsList = new List<Operand>();
                foreach (int operandID in oldChildControls.Where(x => x.OperandID > 0).Select(x => x.OperandID))
                {
                    var oldOperand = db.Operands.SingleOrDefault(x => x.OperandID == operandID);
                    oldOperandsList.Add(oldOperand);
                }
                List<Property> oldPropertiesList = new List<Property>();
                foreach (var controlID in oldChildControls.Select(x => x.ControlID))
                {
                    var oldProperties = db.Properties.Where(x => x.ControlID == controlID).ToList();
                    oldPropertiesList.AddRange(oldProperties);
                }
                db.Properties.RemoveRange(oldPropertiesList);
                db.SaveChanges();
                db.Controls.RemoveRange(oldChildControls);
                db.SaveChanges();
                db.Operands.RemoveRange(oldOperandsList);
                db.SaveChanges();
            }

            return currentControl;
        }

        /// <summary>
        /// Get Dictionary<UniqueID, ControlID>
        /// </summary>
        /// <param name="currentControl"></param>
        /// <param name="db"></param>
        /// <param name="transaction"></param>
        /// <returns></returns>
        public Dictionary<int, OperandInstance> GetUniqueIDControlIDDictionary(ControlInstance currentControl, WebBuilderEFContext db, DbContextTransaction transaction)
        {
             Dictionary<int, OperandInstance> dictionary = new Dictionary<int, OperandInstance>();

            if (currentControl.Control.UniqueID > 0)
            {
                OperandInstance currentOperand = new OperandInstance()
                {
                    ObjectID = currentControl.Control.ControlID,
                    UniqueID = currentControl.Control.UniqueID,
                    OperandID = currentControl.Control.OperandID.GetValueOrDefault()
                };
                dictionary.Add(currentControl.Control.UniqueID, currentOperand);
            }
            if (currentControl.ChildControls != null)
            {
                foreach (ControlInstance childControl in currentControl.ChildControls)
                {
                    {
                        Dictionary<int, OperandInstance> subDictionary = GetUniqueIDControlIDDictionary(childControl, db, transaction);
                        subDictionary.ToList().ForEach(x => dictionary.Add(x.Key, x.Value));
                    }
                }
            }
            
            return dictionary;
        }
        
        /// <summary>
        /// Recursive function - save control events
        /// </summary>
        /// <param name="currentControl"></param>
        /// <param name="db"></param>
        /// <param name="transaction"></param>
        /// <returns></returns>
        public void SaveControlEvents(Dictionary<int, OperandInstance> controlIDuniqueIDDictionary, ControlInstance currentControl, WebBuilderEFContext db, DbContextTransaction transaction)
        {
            if (currentControl == null)
            {
                return;
            }           

            // Save all the control properties
            if (currentControl.Events != null)
            {
                foreach (ControlEventInstance currentEvent in currentControl.Events)
                {
                    currentEvent.Event.ControlID = currentControl.Control.ControlID;

                    // Event actions
                    if (currentEvent.EventActions != null && currentEvent.EventActions.Count > 0)
                    {
                        db.Events.Add(currentEvent.Event);
                        db.SaveChanges();

                        foreach (ControlEventActionInstance currentEventAction in currentEvent.EventActions)
                        {
                            currentEventAction.EventAction.EventID = currentEvent.Event.EventID;
                            db.EventActions.Add(currentEventAction.EventAction);
                            db.SaveChanges();

                            int actionID = currentEventAction.EventAction.ActionID;
                            switch (currentEventAction.ActionTypeID)
                            {
                                // Client action
                                case 1:
                                    if (currentEventAction.ClientAction != null)
                                    {
                                        currentEventAction.ClientAction.ActionID = actionID;
                                        currentEventAction.ClientAction.ControlID = controlIDuniqueIDDictionary[currentEventAction.ClientAction.ControlUniqueID].ObjectID;
                                        db.ClientActions.Add(currentEventAction.ClientAction);
                                        db.SaveChanges();
                                    }
                                    break;
                                case 2:
                                    if (currentEventAction.OpenFormAction != null)
                                    {
                                        currentEventAction.OpenFormAction.OpenFormAction.ActionID = actionID;
                                        db.OpenFormActions.Add(currentEventAction.OpenFormAction.OpenFormAction);
                                        db.SaveChanges();

                                        if (currentEventAction.OpenFormAction.OpenFormActionParameters != null)
                                        {
                                            foreach(OpenFormActionParameter parameter in currentEventAction.OpenFormAction.OpenFormActionParameters)
                                            {
                                                parameter.OpenFormActionID = actionID;
                                                parameter.OperandIDValue = controlIDuniqueIDDictionary[parameter.OperandUniqueID].OperandID;
                                                db.OpenFormActionParameters.Add(parameter);
                                                db.SaveChanges();
                                            }
                                        }
                                    }
                                    break;
                                case 3:
                                    if (currentEventAction.PredicateAction != null)
                                    {
                                        PredicateAction predicateAction = currentEventAction.PredicateAction.PredicateAction;
                                        predicateAction.ActionID = actionID;
                                        predicateAction.OperandIDFirst = controlIDuniqueIDDictionary[predicateAction.FirstOperandUniqueID].OperandID;
                                        predicateAction.OperandIDSecond = controlIDuniqueIDDictionary[predicateAction.SecondOperandUniqueID].OperandID;
                                        db.PredicateActions.Add(predicateAction);
                                        db.SaveChanges();
                                    }
                                    break;
                                case 5:
                                    if (currentEventAction.QueryType != null)
                                    {
                                        // Query Type
                                        db.QueryTypes.Add(currentEventAction.QueryType.QueryType);
                                        db.SaveChanges();

                                        // Query Action
                                        QueryAction queryAction = new QueryAction()
                                        {
                                            QueryTypeID = currentEventAction.QueryType.QueryType.QueryTypeID,
                                            ActionID = actionID
                                        };
                                        db.QueryActions.Add(queryAction);
                                        db.SaveChanges();

                                        // Query Type Tables
                                        if (currentEventAction.QueryType.QueryTypeTables != null)
                                        {
                                            foreach(QueryTypeTableInstance queryTypeTable in currentEventAction.QueryType.QueryTypeTables)
                                            {
                                                queryTypeTable.QueryTypeTable.QueryTypeID = currentEventAction.QueryType.QueryType.QueryTypeID;
                                                db.QueryTypeTables.Add(queryTypeTable.QueryTypeTable);
                                                db.SaveChanges();
                                            }
                                        }

                                        // Query Type Column
                                        if (currentEventAction.QueryType.QueryTypeColumns != null)
                                        {
                                            foreach (QueryTypeColumnInstance queryTypeColumn in currentEventAction.QueryType.QueryTypeColumns)
                                            {
                                                queryTypeColumn.QueryTypeColumn.QueryTypeID = currentEventAction.QueryType.QueryType.QueryTypeID;
                                                db.QueryTypeColumns.Add(queryTypeColumn.QueryTypeColumn);
                                                db.SaveChanges();
                                            }
                                        }

                                        // QueryTypeIn
                                        if (currentEventAction.QueryType.QueryTypeIns != null)
                                        {
                                            foreach (QueryTypeInInstance queryTypeIn in currentEventAction.QueryType.QueryTypeIns)
                                            {
                                                queryTypeIn.QueryTypeIn.QueryTypeID = currentEventAction.QueryType.QueryType.QueryTypeID;
                                                db.QueryTypeIns.Add(queryTypeIn.QueryTypeIn);
                                                db.SaveChanges();

                                                QueryActionIn queryActionIn = new QueryActionIn()
                                                {
                                                    QueryActionID = actionID,
                                                    QueryTypeInID = queryTypeIn.QueryTypeIn.QueryTypeInID,
                                                    OperandIDValue = controlIDuniqueIDDictionary[queryTypeIn.QueryTypeIn.UniqueID].OperandID
                                                };
                                                db.QueryActionIns.Add(queryActionIn);
                                                db.SaveChanges();
                                            }
                                        }

                                        // Query Type Out
                                        if (currentEventAction.QueryType.QueryTypeOuts!= null)
                                        {
                                            foreach (QueryTypeOutInstance queryTypeOut in currentEventAction.QueryType.QueryTypeOuts)
                                            {
                                                queryTypeOut.QueryTypeOut.QueryTypeID = currentEventAction.QueryType.QueryType.QueryTypeID;
                                                db.QueryTypeOuts.Add(queryTypeOut.QueryTypeOut);
                                                db.SaveChanges();

                                                QueryActionOut queryActionOut = new QueryActionOut()
                                                {
                                                    QueryActionID = actionID,
                                                    QueryTypeOutID = queryTypeOut.QueryTypeOut.QueryTypeOutID,
                                                    OperandIDValue = controlIDuniqueIDDictionary[queryTypeOut.QueryTypeOut.UniqueID].OperandID
                                                };
                                                db.QueryActionOuts.Add(queryActionOut);
                                                db.SaveChanges();
                                            }
                                        }
                                                                                
                                    }
                                    break;
                            }
                        }
                    }
                }
            }

            if (currentControl.ChildControls != null)
            {
                foreach (ControlInstance childControl in currentControl.ChildControls)
                {
                    SaveControlEvents(controlIDuniqueIDDictionary, childControl, db, transaction);
                }
            }            
        }
    }
}
