

var banks = [
  {
    email: "bank1@example.com",
    subject: "bank1",
    bankName: "BANK"
  },
  {
    email: "statements@axisbank.com",
    subject: "Axis Bank Statement : Money Quotient for ",
    bankName: "AXIS"
  },
  {
    email: "bank3@bank3.com",
    subject: "bank3",
    bankName: "BANK"
  }
];

function saveBankStatementsForMultipleBanks() {
  for (var i = 0; i < banks.length; i++) {
    var bank = banks[i];
    var searchQuery = "from:" + bank.email + " subject:" + bank.subject + " after:" + Utilities.formatDate(new Date(new Date().getTime()-(7*24*60*60*1000)), Session.getScriptTimeZone(), "yyyy/MM/dd");
    saveBankStatements(searchQuery, bank.bankName);
  }
}

function saveBankStatements(searchQuery, bankNameParam) {
  var threads = GmailApp.search(searchQuery);
  var folderName = "Bank Statements";
  var folderIterator = DriveApp.getFoldersByName(folderName);
  var folder;
  
  if (folderIterator.hasNext()) {
    folder = folderIterator.next();
  } else {
    folder = DriveApp.createFolder(folderName);
  }
  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    for (var j = 0; j < messages.length; j++) {
      var attachments = messages[j].getAttachments();
      for (var k = 0; k < attachments.length; k++) {
        var attachment = attachments[k];
        var attachmentName = attachment.getName();
        if (attachmentName.indexOf(".pdf") !== -1 || attachmentName.indexOf(".csv") !== -1) { // Change this to match the file extensions of your bank statements
        var regex = new RegExp(bankNameParam, "i");
        var bankName = attachmentName.match(regex);
    // Change this regular expression to match the bank name in the subject line
          var date = new Date(messages[j].getDate());
          var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          var monthName = monthNames[date.getMonth()];
          
          var newFileName = bankNameParam + "-" + monthName + "." + attachmentName.split(".").pop();
          var existingFile = folder.getFilesByName(newFileName);
          if (existingFile.hasNext()) {
            // File already exists, skip creating a new file
            continue;
          }
          var file = folder.createFile(attachment.setName(newFileName));
          Logger.log("Saved " + attachmentName + " to " + folder.getName() + " with new name: " + newFileName);
        
        }
      }
    }
  }
}
