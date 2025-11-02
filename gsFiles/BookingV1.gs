const SHEET_NAME = "Buissness Colab Bookings V1";

function doGet() {
  return HtmlService.createHtmlOutput("Web App is running.");
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  if (!sheet) {
    Logger.log("ERROR: Sheet not found: " + SHEET_NAME);
    return ContentService.createTextOutput("Sheet not found");
  }

  Logger.log("DATA RECEIVED: " + JSON.stringify(e.parameter));

  const bookingDate = e.parameter.Date || "";
  const bookingPlace = e.parameter.Place || "";
  const bookingAmount = e.parameter.Amount
    ? parseFloat(e.parameter.Amount)
    : 0;

  const newRow = [
    new Date(),
    bookingDate,
    bookingPlace,
    bookingAmount,
  ];

  sheet.appendRow(newRow);

  // --- START OF HEADER-SAFE SORTING LOGIC ---
  try {
    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();
    
    // Check if there is more than just the header row (i.e., at least 2 rows total)
    if (lastRow > 1) {
      // Define the range to sort: start at Row 2, Column 1 (B1 is the date), 
      // covering all data down to the last row and across all columns.
      // The number of rows to sort is (lastRow - 1)
      const dataRange = sheet.getRange(2, 1, lastRow - 1, lastColumn);
      
      // Sort the defined data range by the Date column (Column 2)
      dataRange.sort({ column: 2, ascending: true });
    }
  } catch (sortError) {
    Logger.log("Sort failed: " + sortError);
  }
  // --- END OF HEADER-SAFE SORTING LOGIC ---

  return ContentService.createTextOutput("Success");
}
