// Method to upload a valid excel file
function upload() {
    $("#loader").show();
    var files = document.getElementById('file_upload').files;
    if (files.length == 0) {
        alert("Please choose any file...");
        return;
    }
    var filename = files[0].name;
    var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
    if (extension == '.XLS' || extension == '.XLSX') {
        //Here calling another method to read excel file into json
        excelFileToJSON(files[0]);
    } else {
        alert("Please select a valid excel file.");
    }
}
//Method to read excel file and convert it into JSON 
function excelFileToJSON(file) {
    try {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            var result = {};
            var firstSheetName = workbook.SheetNames[0];
            //reading only first sheet data
            var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
            //displaying the json result into HTML table
            displayJsonToHtmlTable(jsonData);
        }
    } catch (e) {
        console.error(e);
    }
}
//Method to display the data in HTML Table
let b;
function displayJsonToHtmlTable(jsonData) {
    if (jsonData.length > 0) {
        var htmlData = '<tr><th>Email</th></tr>';
        var a = [];
        for (var i = 0; i < jsonData.length; i++) {
            var row = jsonData[i];
            htmlData += '<tr><td>' + row["Email"] + '</td></tr>';
            a.push(jsonData[i].Email);
        }
        console.log(a);
        let total = a.length;
        console.log(total);
        var p4 = document.getElementById("display_first_msg3");
        var htmlData7 = '<p style="margin: 0.5rem 0 !important;">Records In File : ' + total + '</p>';
        p4.innerHTML = htmlData7;
        $("#loader").hide();

        b = a;
    } else {
        table.innerHTML = 'There is no data in Excel';
    }
}
// Remove Unwanted Email start
let unwanted = [];
async function remove_unwanted() {
    $("#loader").show();
    setTimeout(() => {
        remove_unwanted_email();
    }, 1000);
}

function remove_unwanted_email() {
    let conditions = ["..", ".comm", ".coml", ".comb", ".educ", ".eduu", ".eduf", ".comc", ".comq", ".comf", ".comu",
     ".comn", ".orgb", ".orgc", ".orgq", ".orgg", ".orgf", ".comd", ".comg", ".coma", ".comx", ".mili", ".govc", ".milv",
      ".saxo", ".govq", "o.ukk", ".comi", "comrh", "grada", ".govw", "com.a", ".coms", "lilli", "comen", "e.coo", ".como", 
      ".govt", "com.t", ".idit", "org.a", ".comk", ".nett" , "org.t", "com.p", ".comz", ".comv", "e.cob", ".govo", ".edum", 
      ".comh", "org.e", "h.cat", "bbr.c", "ca.mi", "wwww", ".com."];
    let condition_str = conditions.toString();
    str1 = condition_str;
    var array_condition = str1.split(',');


    var table2 = document.getElementById("display_excel_data2");
    var htmlData2 = '<tr><th><b>Email</b></th><th><b>Status</b></th></tr>';
    // var emailRegEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.(com|org|edu|gov|io|tech|dk|ai|in)))$/;
    // var emailRegEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.[0-9a-zA-Z][-\w]*[0-9a-zA-Z]))$/;
    // var emailRegEx = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    var emailRegEx =  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,12}$/i;

    let uniquelement_new = b.toString();
    str = uniquelement_new;
    var array = str.split(',');
    let valid = 0;
    let invalid = 0;
    for (var i = 0; i < array.length; i++) {
        var email = array[i];
        if (!email.match(emailRegEx)) {
            invalid++;
            var row2 = email;
            htmlData2 += '<tr><td>' + row2 + '</td><td>Invalid</td></tr>';
            unwanted += row2;
        }

        else if (email.match(emailRegEx)) {
            var err = 0;
            for (var j = 0; j < array_condition.length; j++) {
                // var email_split = email.split('@')[1];
                if (email === (array_condition[j])) {
                    err++;
                    break;
                }
            }
            if (err >= 1) {
                invalid++;
                var row2 = email;
                htmlData2 += '<tr><td>' + row2 + '</td><td>Invalid</td></tr>';
                unwanted += row2;

            }
            else {
                valid++;
                var row2 = email;
                htmlData2 += '<tr><td>' + row2 + '</td><td>-</td></tr>';
                unwanted += row2;

            }
        }

    }
    console.log(unwanted);
    table2.innerHTML = htmlData2;
    var p1 = document.getElementById("display_first_msg");
    var htmlData4 = '<p style="margin: 0.5rem 0 !important;">Valid :<b> ' + valid + '</b> & InValid : <b>' + invalid + '</b></p>';
    p1.innerHTML = htmlData4;
    $("#loader").hide();
    return true
}

// Remove Unwanted Email End

// Download a excel for remove Unwanted  start
document.getElementById('clickme1').addEventListener('click', function () {

    $('#display_excel_data2').table2excel({
        exclude: ".no-export",
        filename: `Valid.xls`,
        fileext: ".xls",
        exclude_links: true,
        exclude_inputs: true
    });
})
// Download a excel for remove Unwanted end

// Duplicate Email Separator Start   
function upload1() {
    $("#loader2").show();

    var files = document.getElementById('file_upload1').files;
    if (files.length == 0) {
        alert("Please choose any file...");
        return;
    }
    var filename = files[0].name;
    var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
    if (extension == '.XLS' || extension == '.XLSX') {
        //Here calling another method to read excel file into json
        excelFileToJSON1(files[0]);
    } else {
        alert("Please select a valid excel file.");
    }
}

//Method to read excel file and convert it into JSON 
function excelFileToJSON1(file) {
    try {
        var reader1 = new FileReader();
        reader1.readAsBinaryString(file);
        reader1.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            var result = {};
            var firstSheetName = workbook.SheetNames[0];
            //reading only first sheet data
            var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
            //displaying the json result into HTML table
            displayJsonToHtmlTable1(jsonData);
        }
    } catch (e) {
        console.error(e);
    }
}
//Method to display the data in HTML Table
let duplicate_mail;
function displayJsonToHtmlTable1(jsonData) {
    if (jsonData.length > 0) {
        var htmlData = '<tr><th>Email</th></tr>';
        var a = [];
        for (var i = 0; i < jsonData.length; i++) {
            var row = jsonData[i];
            htmlData += '<tr><td>' + row["Email"] + '</td></tr>';
            a.push(jsonData[i].Email);
        }
        console.log(a);
        let total = a.length;
        console.log(total);
        var p4 = document.getElementById("duplicate_msg_1");
        var htmlData7 = '<p style="margin: 0.5rem 0 !important;">Records In File : ' + total + '</p>';
        p4.innerHTML = htmlData7;
        duplicate_mail = a;
        $("#loader2").hide();

    } else {
        table.innerHTML = 'There is no data in Excel';
    }
}

async function remove_duplicate() {
    $("#loader2").show();
    setTimeout(() => {
        remove_duplicate_email();
    }, 1000);

}

function remove_duplicate_email() {

    var table3 = document.getElementById("display_excel_data3");
    var htmlData11 = '<tr><th><b>Email</b></th><th><b>Status</b></th</tr>';
    let duplicate_mail_new = duplicate_mail.toString();
    str = duplicate_mail_new;
    var characters = str.split(',');
    var distinctCharacters = [];
    jQuery.each(characters, function (index, c) {

        if (jQuery.inArray(c, distinctCharacters) > -1) {

            htmlData11 += '<tr><td>' + distinctCharacters[distinctCharacters.length - 1] + '</td><td>Duplicate</td></tr>';

        } else {
            distinctCharacters.push(c);
            htmlData11 += '<tr><td>' + distinctCharacters[distinctCharacters.length - 1] + '</td><td>-</td></tr>';

        }
    });
    console.log(distinctCharacters);
    let uniquelement_total = distinctCharacters.length;
    console.log(uniquelement_total);
    var d1 = document.getElementById("duplicate_msg_2");
    var htmlData8 = '<p style="margin: 0.5rem 0 !important;">Unique Email In File : ' + uniquelement_total + '</p>';
    d1.innerHTML = htmlData8;
    table3.innerHTML = htmlData11;
    $("#loader2").hide();

}

// Download a excel for remove Unwanted  start
document.getElementById('clickme2').addEventListener('click', function () {
    $('#display_excel_data3').table2excel({
        exclude: ".no-export",
        filename: `Duplicate.xls`,
        fileext: ".xls",
        exclude_links: true,
        exclude_inputs: true
    });
})

