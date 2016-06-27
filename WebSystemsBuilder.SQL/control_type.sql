INSERT INTO public.wb_control_type(control_type_id, name, control_type_group_id, description, extjs_class)
                   VALUES (1, 'Window', 1, 'Окно. Специализированная панель, предназначенная для использования в качестве окна приложения. У окон по умолчанию можно изменять размер, а также их можно перетаскивать. Окна можно увеличить, чтобы заполнить всю область просмотра, восстановить до его исходного размера и свернуть.', 'Ext.window.Window');
INSERT INTO public.wb_control_type(control_type_id, name, control_type_group_id, description, extjs_class)
                   VALUES (2, 'Container (hbox)', 2, 'Горизонтальный контенер. Контейнер может содержать компоненты формы в горизонтальном порядке. Контейнеры обрабатывают основные параметры поведения элементов, которых они содержат, а именно добавление, вставка и удаление элементов.', 'Ext.container.Container');
INSERT INTO public.wb_control_type(control_type_id, name, control_type_group_id, description, extjs_class)
                   VALUES (3, 'FieldSet', 2, 'Группа полей. Контейнер для группировки наборов полей по какому-либо признаку. Наименование признака может быть описана в заголовке элемента. Данный контейнер  обычно содержит простые поля, но также может содержать вложенные контейнеры элементов.', 'Ext.form.FieldSet');
INSERT INTO public.wb_control_type(control_type_id, name, control_type_group_id, description, extjs_class)
                   VALUES (4, 'ToolBar', 2, 'Тулбар. Основная панель инструментов формы. Может располагаться снизу, справа, слева или сверху формы. Основным компонентом, который содержит данный контейнер, является кнопка.', 'Ext.toolbar.Toolbar');
INSERT INTO public.wb_control_type(control_type_id, name, control_type_group_id, description, extjs_class)
                   VALUES (5, 'Panel', 3, 'Панель. Панель представляет собой контейнер, который имеет определенные функциональные и структурные компоненты, которые делают его идеальным строительным блоком для разработки прикладных пользовательских интерфейсов.', 'Ext.panel.Panel');
INSERT INTO public.wb_control_type(control_type_id, name, control_type_group_id, description, extjs_class)
                   VALUES (6, 'TabPanel', 3, 'Панель с закладками. Ее можно использовать так же, как стандартную панель для макетирования, но она имеет специальную возможность - возможность содержания дочерних компонентов, которые отображаются в виде отдельных вкладок.', 'Ext.tab.Panel');
INSERT INTO public.wb_control_type(control_type_id, name, control_type_group_id, description, extjs_class)
                   VALUES (7, 'NewTab', 3, 'Закладка панели с закладками. Представляет собой стандартную панель со всеми ее функциями и свойствами, отображащуюся в виде отдельной вкладки.', 'Ext.panel.Panel');
INSERT INTO public.wb_control_type(control_type_id, name, control_type_group_id, description, extjs_class)
                   VALUES (8, 'GridPanel', 4, 'Таблица. Таблица представляет собой компонент, позволяющий показать большое количество табличных данных на стороне клиента. Таблица облегчает получение, сортировку и фильтрацию большого объема данных. Таблица состоит из двух основных частей - хранилище данных и набор столбцов для их визуализации.', 'Ext.grid.Panel');
INSERT INTO public.wb_control_type(control_type_id, name, control_type_group_id, description, extjs_class)
                   VALUES (9, 'GridColumn', 4, 'Колонка таблицы с произвольным форматом данных. Отображается в виде столбца таблицы, определяет формат данных столбца.', 'Ext.grid.column.Column');
INSERT INTO public.wb_control_type(control_type_id, name, control_type_group_id, description, extjs_class)
                   VALUES (10, 'DateColumn', 4, 'Колонка таблицы с данными, представляющими дату. Отображается в виде столбца таблицы, определяет формат данных столбца. Может быть задан формат хранения и отображения информации.', 'Ext.grid.column.Date');
INSERT INTO public.wb_control_type(control_type_id, name, control_type_group_id, description, extjs_class)
                   VALUES (11, 'NumberColumn', 4, 'Колонка таблицы с данными, представляющими число. Отображается в виде столбца таблицы, определяет формат данных столбца. Может быть задан формат хранения и отображения информации.', 'Ext.grid.column.Number');
INSERT INTO public.wb_control_type(control_type_id, name, control_type_group_id, description, extjs_class)
                   VALUES (12, 'TextField', 5, 'Текстовое поле. Стандартное текстовое поле, позволяющее вводить и отображать данные в виде текста.', 'Ext.form.field.Text');
INSERT INTO public.wb_control_type(control_type_id, name, control_type_group_id, description, extjs_class)
                   VALUES (13, 'DateField', 5, 'Поле типа дата. Позволяет пользователю выбрать дату и отобразить ее в заданном формате.', 'Ext.form.field.Date');
INSERT INTO public.wb_control_type(control_type_id, name, control_type_group_id, description, extjs_class)
                   VALUES (14, 'NumberField', 5, 'Поле типа число. Позволяет пользователю выбрать число и отобразить его в заданном формате. Есть возможность работы с числами с плавающей точкой.', 'Ext.form.field.Number');
INSERT INTO public.wb_control_type(control_type_id, name, control_type_group_id, description, extjs_class)
                   VALUES (15, 'ComboBox', 5, 'Поле с выпадающим списком допустимых значений. Содержит функционал, позволяющий удаленную загрузку данных, автозаполнение и многие другие функции.', 'Ext.form.field.ComboBox');
INSERT INTO public.wb_control_type(control_type_id, name, control_type_group_id, description, extjs_class)
                   VALUES (16, 'Button', 6, 'Кнопка. Представляет собой стандартную кнопку. Есть возможность задать кнопке иконку, выпадающее меню и другие опции.', 'Ext.button.Button');
INSERT INTO public.wb_control_type(control_type_id, name, control_type_group_id, description, extjs_class)
                   VALUES (19, 'Container (vbox)', 2, 'Вертикальный Контенер. Контейнер может содержать компоненты формы в вертикальном порядке. Контейнеры обрабатывают основные параметры поведения элементов, которых они содержат, а именно добавление, вставка и удаление элементов.', 'Ext.container.Container');
