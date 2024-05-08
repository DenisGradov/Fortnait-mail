function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    console.log("Clipboard API not available");
    return;
  }
  navigator.clipboard
    .writeText(text)
    .then(function () {
      console.log("Text copied to clipboard");
    })
    .catch(function (err) {
      console.error("Could not copy text: ", err);
    });
}

export default copyTextToClipboard;
