 

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 * @version 0.1
 */


var line_number = 1;
var started = "off";

window.onload = function() {
	var configTable = JSON.parse(localStorage.getItem("modifyTable"));	
	for (var to_add of configTable) appendLine(to_add[0],to_add[1],to_add[2],to_add[3]);
	document.getElementById('save_button').addEventListener('click',function (e) {save_data();});
	document.getElementById('export_button').addEventListener('click',function (e) {export_data();});
	document.getElementById('import_button').addEventListener('change',function (e) {import_data(e);});
	document.getElementById('add_button').addEventListener('click',function (e) {appendLine("add","-","-","off");});
	document.getElementById('start_img').addEventListener('click',function (e) {start_modify();});
	document.getElementById('targetPage').value=localStorage.getItem("targetPage");
	started = localStorage.getItem("started");
	if (started=="on") document.getElementById("start_img").src = "img/stop.png";	
} ;


function appendLine(action,header_name,header_value,status) {

var html = "<td><select id=\"select_action" + line_number + "\" disable=false><option value=\"add\">add</option><option value=\"modify\">modify</option><option value=\"delete\">delete</option></select></td>";
html = html + "<td><input id=\"header_name"+ line_number + "\"></input></td>";
html = html + "<td><input id=\"header_value"+ line_number + "\"></input></td>";
html = html + "<td><select id=\"select_status" + line_number + "\"><option value=\"on\"> on </option><option value=\"off\">off</option></select></td>";
html = html + "<td><input type=\"button\" value=\"DELETE\" id=\"delete_button" + line_number + "\"></input> </td>";

var newTR = document.createElement("tr");
newTR.id="line" + line_number;
newTR.innerHTML = html;
document.getElementById("config_tab").appendChild(newTR);
document.getElementById("select_action"+line_number).value = action;
document.getElementById("select_status"+line_number).value = status;
document.getElementById("header_name"+line_number).value = header_name;
document.getElementById("header_value"+line_number).value = header_value;
var line_number_to_delete = line_number;
document.getElementById('delete_button'+line_number).addEventListener('click',function (e) {delete_line(line_number_to_delete)});
line_number++;
}




function save_data () 
	{
	var tr_elements = document.querySelectorAll("#config_tab tr");
	var to_save = [];
	for (i=1;i<tr_elements.length;i++)  // ignore line 1 which is the table header
		{
		var line_to_save = [];
		line_to_save.push(tr_elements[i].childNodes[0].childNodes[0].value); // select_action 
		line_to_save.push(tr_elements[i].childNodes[1].childNodes[0].value); // header_name
		line_to_save.push(tr_elements[i].childNodes[2].childNodes[0].value); // header_value
		line_to_save.push(tr_elements[i].childNodes[3].childNodes[0].value); // status
		to_save.push(line_to_save);
		}
	localStorage.setItem("modifyTable",JSON.stringify(to_save));
	localStorage.setItem("targetPage",document.getElementById('targetPage').value);
	browser.runtime.sendMessage("reload");
	}

function export_data()
	{
	// Create file data
	var tr_elements = document.querySelectorAll("#config_tab tr");
	var headers = [];
	for (i=1;i<tr_elements.length;i++)  // ignore line 1 which is the table header
		{
	
		var action = tr_elements[i].childNodes[0].childNodes[0].value;
		var header_name = tr_elements[i].childNodes[1].childNodes[0].value;
		var header_value = tr_elements[i].childNodes[2].childNodes[0].value;
		var status = tr_elements[i].childNodes[3].childNodes[0].value;
		headers.push({action:action,header_name:header_name,header_value:header_value,status:status});

		}
	var to_export = {format_version:"1.0",targetPage:document.getElementById('targetPage').value,headers:headers};
	console.log(JSON.stringify(to_export));
	
	// Create file to save 
	var a         = document.createElement('a');
	a.href        = 'data:attachment/json,' +  encodeURIComponent(JSON.stringify(to_export));
	a.target      = '_blank';
	a.download    = 'SimpleModifyHeader.conf';
	document.body.appendChild(a);
	a.click();
	}
	
function import_data(evt)
	{
		var files = evt.target.files;
        var reader = new FileReader();
        reader.addEventListener('load', function() {
			console.log("files[0].name=" + files[0].name);
            alert('Contenu du fichier : "' + files[0].name + '" :\n\n' + reader.result);

        });
        reader.readAsText(files[0]);

 
	}

function delete_line(line_number_to_delete)
	{
	if (line_number_to_delete != line_number) 
			{
			for (i=line_number_to_delete;i<line_number-1;i++)
				{
				var j = i+1;
				document.getElementById("select_action"+i).value = document.getElementById("select_action"+j).value;
				document.getElementById("header_name"+i).value = document.getElementById("header_name"+j).value;
				document.getElementById("header_value"+i).value = document.getElementById("header_value"+j).value;
				document.getElementById("select_status"+i).value = document.getElementById("select_status"+j).value;
				}
			}
	var Node_to_delete = document.getElementById("line"+(line_number-1));
    	Node_to_delete.parentNode.removeChild(Node_to_delete);
	line_number--;
	}


function start_modify()
	{
	if (started=="off") 
		{
		localStorage.setItem("started","on");
		browser.runtime.sendMessage("on");
		started = "on";
		document.getElementById("start_img").src = "img/stop.png";		
		}
	else 
		{
		localStorage.setItem("started","off");
		browser.runtime.sendMessage("off");
		started = "off";
		document.getElementById("start_img").src = "img/start.png";
		}

	}
