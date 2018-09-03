var pattern = /(^\.|\/\.|\.ico$| )/;

var $result = $("#result");
var cleanzip = new JSZip();
var cleanzipFilename = "";

$("#download")
  .removeClass("show")
  .addClass("hidden");

$("#file").on("change", function(evt) {
  // remove content
  $result.html("");
  // be sure to show the results
  $("#result_block")
    .removeClass("hidden")
    .addClass("show");

  // Closure to capture the file information.
  function handleFile(f) {
    cleanzipFilename = f.name.replace(/\.zip/, "_clean.zip");
    var $title = $("<h4>", {
      text: f.name
    });
    var $fileContent = $("<ul>");
    $result.append($title);
    $result.append($fileContent);

    var dateBefore = new Date();
    JSZip.loadAsync(f) // 1) read the Blob
      .then(
        function(zip) {
          var dateAfter = new Date();
          $title.append(
            $("<span>", {
              class: "small",
              text: " (loaded in " + (dateAfter - dateBefore) + "ms)"
            })
          );

          cleanzip = new JSZip();
          zip.forEach(function(relativePath, zipEntry) {
            if (zipEntry.name.match(pattern)) {
              // 2) print entries
              $fileContent.append(
                $("<li>", {
                  text: zipEntry.name,
                  style: "color: red;"
                })
              );
            } else {
              // 2) print entries
              $fileContent.append(
                $("<li>", {
                  text: zipEntry.name
                })
              );
              cleanzip.file(zipEntry.name, zipEntry._data);
            }
          });
        },
        function(e) {
          $result.append(
            $("<div>", {
              class: "alert alert-danger",
              text: "Error reading " + f.name + ": " + e.message
            })
          );
        }
      );
  }

  var files = evt.target.files;
  for (var i = 0; i < files.length; i++) {
    handleFile(files[i]);
  }
  $("#download")
    .removeClass("hidden")
    .addClass("show");
});

$("#blob").on("click", function() {
  cleanzip.generateAsync({ type: "blob" }).then(
    function(blob) {
      // 1) generate the zip file
      saveAs(blob, cleanzipFilename); // 2) trigger the download
    },
    function(err) {
      $("#blob").text(err);
    }
  );
});
