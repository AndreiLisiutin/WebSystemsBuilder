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
        /// Add new form - Save all the form meta descriptions
        /// </summary>
        /// <param name="formInstance">Form meta-descriptions to save</param>
        /// <returns></returns>
        public FormInstance AddFormMetaDescriptions(FormInstance formInstance)
        {
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
                            }
                        }

                        // Recursive save all the controls of the form
                        formInstance.RootControl.Control.FormID = formInstance.Form.FormID;
                        this.SaveControl(formInstance.RootControl, db, transaction);
                        
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
                        db.Entry(formInstance.Form).State = EntityState.Modified;
                        db.SaveChanges();

                        // Save Form Parameters
                        if (formInstance.FormParameters != null)
                        {
                            // Delete old parameters
                            var oldFormParameters = db.FormParameters                                
                                .Where(x => x.FormID == formInstance.Form.FormID)
                                .ToList()
                                .Where(x => !formInstance.FormParameters.Select(p => p.FormParameter.FormParameterID).Contains(x.FormParameterID));
                            db.FormParameters.RemoveRange(oldFormParameters);

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
                                    db.Entry(formParameter.FormParameter).State = EntityState.Modified;
                                }

                                db.SaveChanges();
                            }
                        }
                        else
                        {
                            var formParametersList = db.FormParameters.Where(x => x.FormID == formInstance.Form.FormID);
                            db.FormParameters.RemoveRange(formParametersList);
                        }

                        // Recursive save all the controls of the form
                        formInstance.RootControl.Control.FormID = formInstance.Form.FormID;
                        this.SaveControl(formInstance.RootControl, db, transaction);

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
            if (currentControl.Control.OperandID <= 0)
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
                db.Entry(currentControl.Control).State = EntityState.Modified;
            }
            db.SaveChanges();

            // Save all the control properties
            if (currentControl.Properties != null)
            {
                // Delete old properties
                var oldProperties = db.Properties
                    .Where(x => x.ControlID == currentControl.Control.ControlID)
                    .ToList()
                    .Where(x => !currentControl.Properties.Select(p => p.Property.PropertyID).Contains(x.PropertyID));
                db.Properties.RemoveRange(oldProperties);

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
                        db.Entry(currentProperty.Property).State = EntityState.Modified;
                    }
                    db.SaveChanges();
                }
            }
            else
            {
                var oldPropertiesList = db.Properties.Where(x => x.ControlID == currentControl.Control.ControlID);
                db.Properties.RemoveRange(oldPropertiesList);
            }

            // Children controls
            if (currentControl.ChildControls != null)
            {
                var oldChildControls = db.Controls
                    .Where(x => x.ControlIDParent == currentControl.Control.ControlID)
                    .ToList()
                    .Where(x => !currentControl.ChildControls.Select(p => p.Control.ControlID).Contains(x.ControlID));
                db.Controls.RemoveRange(oldChildControls);

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
                var oldChildControls = db.Controls.Where(x => x.ControlIDParent == currentControl.Control.ControlID);
                db.Controls.RemoveRange(oldChildControls);
            }

            return currentControl;
        }
    }
}
