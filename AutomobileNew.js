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
			formContext.getAttribute("fumag_cilindrata").addOnChange(this.OnLoad);

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

		//*aggiunta contatto tramite DRB
		/* var record = {};
		record.firstname = "Roberto"; // Text
		record.lastname = "Baggio"; // Text

		Xrm.WebApi.createRecord("contact", record).then(
			function success(result) {
				debugger;
				var newId = result.id;
				console.log(newId);
			},
			function (error) {
				console.log(error.message);
			}
		); */

		//*retrieve MULTIPLA tramire DRB
		Xrm.WebApi.retrieveMultipleRecords("fumag_evento", "?$select=fumag_name,_ownerid_value&$filter=contains(fumag_name,'EXPO')&$orderby=fumag_eventoid desc").then(
			function success(results) {
				console.log(results);
				for (var i = 0; i < results.entities.length; i++) {
					var result = results.entities[i];
					// Columns
					var fumag_eventoid = result["fumag_eventoid"]; // Guid
					var fumag_name = result["fumag_name"]; // Text
					var ownerid = result["_ownerid_value"]; // Owner
					var ownerid_formatted = result["_ownerid_value@OData.Community.Display.V1.FormattedValue"];
					var ownerid_lookuplogicalname = result["_ownerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
				}
			},
			function (error) {
				console.log(error.message);
			}
		);
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


		//* modifica contatto tramite DRB
		/* var record = {};
		record.birthdate = "1967-02-18"; // Date Time
		record.address1_city = "Mardid"; // Text
		record.lastname = "Carlos"; // Text

		Xrm.WebApi.updateRecord("contact", "8df0add8-5890-ee11-be36-000d3aa9a09b", record).then(
			function success(result) {
				var updatedId = result.id;
				console.log(updatedId);
			},
			function (error) {
				console.log(error.message);
			}
		); */

		//*retrieve singola tramite DRB
		/* Xrm.WebApi.retrieveRecord("fumag_partecipazioni", "acf53b03-7784-ee11-8179-000d3aa9a09b", "?$select=_fumag_eventoid_value,fumag_name,_ownerid_value").then(
			function success(result) {
				console.log(result);
				// Columns
				var fumag_partecipazioniid = result["fumag_partecipazioniid"]; // Guid
				var fumag_eventoid = result["_fumag_eventoid_value"]; // Lookup
				var fumag_eventoid_formatted = result["_fumag_eventoid_value@OData.Community.Display.V1.FormattedValue"];
				var fumag_eventoid_lookuplogicalname = result["_fumag_eventoid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
				var fumag_name = result["fumag_name"]; // Text
				var ownerid = result["_ownerid_value"]; // Owner
				var ownerid_formatted = result["_ownerid_value@OData.Community.Display.V1.FormattedValue"];
				var ownerid_lookuplogicalname = result["_ownerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
			},
			function (error) {
				console.log(error.message);
			}
		); */

	}
	//#endregion

}).call(Automobile);