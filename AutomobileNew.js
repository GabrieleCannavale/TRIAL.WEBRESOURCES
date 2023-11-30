var Automobile = window.Automobile || {};

(function () {

	//?#region VARIABILI GLOBALI
	var formContext;
	var formType;


	//? rendiamo parlanti gli stati del formtype 
	//? (https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/clientapi/reference/formcontext-ui/getformtype)
	var CrmFormType = {
		create: 1,
		update: 2,
		deactive: 3
	};


	//? rendiamo parlanti gli stati di salvataggio 
	//? https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/clientapi/reference/save-event-arguments/getsavemode
	var CrmSaveMode = {
		autoSave: 70
	};
	//#endregion

	this.preventAutoSave = function (executionContext) {
		var eventArgs = executionContext.getEventArgs();
		if (eventArgs.getSaveMode() === CrmSaveMode.autoSave) {
			eventArgs.preventDefault();
		}
	};
	
	//!ON LOAD FUNCTION
	this.OnLoad = function (executionContext) {
		debugger;
		formContext = executionContext.getFormContext();
		formType = formContext.ui.getFormType();

		if (formType === CrmFormType.update) {

			var cilindrata = formContext.getAttribute("fumag_cilindrata").getValue();
			//var uniqueId = "notificaNumeroCilindrata";
			if (cilindrata == null) {
				var message = "Devi inserire il numero della Cilindrata.";
				formContext.getControl("fumag_cilindrata").setNotification(message, "notificaNumeroCilindrata");
			}
			else {
				formContext.getControl("fumag_cilindrata").clearNotification("notificaNumeroCilindrata");
				formContext.ui.clearFormNotification("FormNot1");

			}

			//? gestisce la visibilità del campo in questione
			formContext.getControl("fumag_isfunzionante").setVisible(false);


		}
		
		if (formType == CrmFormType.create) {
			
			Helper.DoSomething();
			
			var ownerAuto = formContext.getAttribute("ownerid").getValue();
			//id
			//Name
			//IdentityType
			if (ownerAuto != null) {
				var ownerNomeAuto = ownerAuto[0].name;
				var id = ownerAuto[0].id;
				var entT = ownerAuto[0].entityType;
	
				alert(`nome: ${ownerNomeAuto} ID: ${id} entità: ${entT}`);
			}
	
			//? gestisce requiredLevel di un determinato attributo
			//? https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/clientapi/reference/attributes/setrequiredlevel
			formContext.getAttribute("fumag_alimentazione").setRequiredLevel("required");
		
			formContext.getAttribute("fumag_modello").addOnChange(this.OnChangeModello);
		}

		formContext.getAttribute("fumag_name").addOnChange(this.OnChangeNome);
	}

	//!ON SAVE FUNCTION
	this.OnSave = function (executionContext) {
		formContext = executionContext.getFormContext();
		
		this.preventAutoSave(executionContext);

		//* var nomeAuto = formContext.data.entity.attributes.get("fumag_name").getValue();
		// la riga sotto è una versione short della riga sopra
		var nomeAuto = formContext.getAttribute("fumag_name").getValue();

		alert(`Complimenti! Hai salvato il veicolo: ${nomeAuto}, ora riposati`);

	}

 	//!#region VARIABILI ON CHANGE
	this.OnChangeModello = function () {
		debugger;
    var modello = formContext.getAttribute("fumag_modello").getText();
    
    if (modello === "SUV") {
       
        //? gestisce requiredLevel di un determinato attributo
        //? https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/clientapi/reference/attributes/setrequiredlevel
        formContext.getAttribute("fumag_prezzo").setRequiredLevel("required");
    } else {
        formContext.getAttribute("fumag_prezzo").setRequiredLevel("none");
    }
	}

	this.OnChangeNome = function () {
		debugger;
		alert("Stai cambiando il nome al veicolo!");
	
	}
	//#endregion

}).call(Automobile);