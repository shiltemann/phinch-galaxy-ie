// Generated by CoffeeScript 1.10.0
(function() {
  var readFile,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  readFile = (function() {
    var progress, reader;

    reader = new FileReader();

    progress = document.querySelector('.percent');

    function readFile() {
      this.clearOldEntries = bind(this.clearOldEntries, this);
      this.removeRow = bind(this.removeRow, this);
      this.reloadRow = bind(this.reloadRow, this);
      this.listRecentFiles = bind(this.listRecentFiles, this);
      this.readBlob = bind(this.readBlob, this);
      this.dragFileProc = bind(this.dragFileProc, this);
      this.handleFileSelect = bind(this.handleFileSelect, this);
      var fileDrag;

      db.open({
        server: "BiomData",
        version: 1,
        schema: {
          "biom": {
            key: {
              keyPath: 'id',
              autoIncrement: true
            }
          }
        }
      }).done((function(_this) {
        return function(s) {
          _this.server = s;
          return _this.listRecentFiles();
        };
      })(this));
      document.querySelector('#parse').addEventListener('click', (function(_this) {
        return function(evt) {
          var files;
          if (evt.target.tagName.toLowerCase() === 'button') {
            files = document.getElementById('files').files;
            files = '/home/Phinch/data/'+'REPLACE_ME';
            return _this.checkFile(files);
          }
        };
      })(this), false);
      document.getElementById('loadTestFile').addEventListener('click', (function(_this) {
        return function(evt) {
          var hostURL, testfile;
          $('#loadTestFile').html('loading...&nbsp;&nbsp;<i class="icon-spinner icon-spin icon-large"></i>');
          hostURL = 'http://' + window.location.host + window.location.pathname.substr(0, window.location.pathname.lastIndexOf('/'));
          testfile = hostURL + '/data/'+'REPLACE_ME';
          return $.get(testfile, function(testdata) {
            var biomToStore, d;
            biomToStore = {};
            //biomToStore.name = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)+'.biom';
            biomToStore.name = 'REPLACE_ME';
            biomToStore.size = 15427024;
            biomToStore.data = testdata;
            d = new Date();
            biomToStore.date = d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCDate() + "T" + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds() + " UTC";
            return _this.server.biom.add(biomToStore).done(function() {
              return setTimeout("window.location.href = 'preview.html'", 2000);
            });
          });
        };
      })(this), false);
      document.getElementById('files').addEventListener('change', this.handleFileSelect, false);
      fileDrag = document.getElementById('fileDrag');
      fileDrag.addEventListener('dragover', this.dragFileProc, false);
      fileDrag.addEventListener('dragleave', this.dragFileProc, false);
      fileDrag.addEventListener('drop', this.dragFileProc, false);
      fileDrag.addEventListener('drop', this.handleFileSelect, false);
    }

    readFile.prototype.checkFile = function(files) {
      var acceptable_filetype, filetype;
      if (files.length === 0) {
        return alert("Please select a file!");
      } else {
        filetype = files[0].name.split("").reverse().join("").split(".")[0].toLowerCase();
        acceptable_filetype = ["moib", "txt"];
        if (acceptable_filetype.indexOf(filetype) === -1) {
          return alert("Please upload .biom or or .txt file!");
        } else {
          return this.readBlob(files[0]);
        }
      }
    };

    readFile.prototype.handleFileSelect = function(evt) {
      progress.style.width = '0%';
      reader.onerror = this.errorHandler;
      reader.onprogress = this.updateProgress;
      reader.onabort = function(e) {
        return alert("File loading cancelled!");
      };
      reader.onloadstart = function(e) {
        return document.getElementById('progress_bar').className = 'loading';
      };
      return reader.onload = function(e) {
        progress.style.width = '100%';
        return setTimeout("document.getElementById('progress_bar').className='';", 8000);
      };
    };

    readFile.prototype.errorHandler = function(evt) {
      switch (evt.target.error.code) {
        case evt.target.error.NOT_FOUND_ERR:
          return alert("File Not Found!");
        case evt.target.error.NOT_READABLE_ERR:
          return alert("File Not Readable!");
        default:
          return alert("File Not Readable!");
      }
    };

    readFile.prototype.updateProgress = function(evt) {
      var percentLoaded;
      if (evt.lengthComputable) {
        percentLoaded = Math.round((evt.loaded / evt.total) * 100);
        if (percentLoaded < 100) {
          return progress.style.width = percentLoaded + '%';
        }
      }
    };

    readFile.prototype.dragFileProc = function(evt) {
      var files;
      evt.stopPropagation();
      evt.preventDefault();
      switch (evt.type) {
        case 'dragover':
          return $('#fileDrag').addClass('hover');
        case 'dragleave':
          return $('#fileDrag').removeClass('hover');
        case 'drop':
          $('#fileDrag').removeClass('hover');
          files = evt.target.files || evt.dataTransfer.files;
          return this.checkFile(files);
      }
    };

    readFile.prototype.readBlob = function(file) {
      reader.onloadend = (function(_this) {
        return function(evt) {
          var biomToStore, d;
          if (evt.target.readyState === FileReader.DONE) {
            biomToStore = {};
            biomToStore.name = file.name;
            biomToStore.size = file.size;
            biomToStore.data = evt.target.result;
            d = new Date();
            biomToStore.date = d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCDate() + "T" + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds() + " UTC";
            console.log(_this);
            if (JSON.parse(biomToStore.data).format.indexOf("Biological Observation Matrix") !== -1) {
              return _this.server.biom.add(biomToStore).done(function(item) {
                _this.currentData = item;
                return setTimeout("window.location.href = 'preview.html'", 2000);
              });
            } else {
              return alert("Incorrect biom format field! Please check your file content!");
            }
          }
        };
      })(this);
      return reader.readAsBinaryString(file);
    };

    readFile.prototype.listRecentFiles = function() {
      return this.server.biom.query().all().execute().done((function(_this) {
        return function(results) {
          var content, j, k, l, m, p, ref, ref1, ref2, results1, tk;
          if (results.length > 100) {
            for (p = j = 0, ref = results.length - 1; 0 <= ref ? j <= ref : j >= ref; p = 0 <= ref ? ++j : --j) {
              if (results[p].name === "testdata.biom") {
                _this.server.biom.remove(results[p].id).done;
                results.splice(p, 1);
              }
            }
            if (results.length > 0) {
              _this.clearOldEntries(results);
            }
            if (results.length > 0) {
              $('#recent').show();
              _this.currentData = results;
              content = "<table id='recent_data'>";
              for (k = l = 0, ref1 = results.length - 1; 0 <= ref1 ? l <= ref1 : l >= ref1; k = 0 <= ref1 ? ++l : --l) {
                tk = results.length - 1 - k;
                content += '<tr><td class="reload" id="reload_' + k + '">LOAD' + '</td><td>';
                content += results[tk].name.substring(0, 55) + '</td><td>' + (results[tk].size / 1000000).toFixed(1) + " MB" + '</td><td>' + results[tk].date;
                content += '</td><td class="del" id="del_' + k + '"><i class="icon-fa-times icon-large"></i></td></tr>';
              }
              content += "</table>";
              $("#recent").append(content);
              results1 = [];
              for (k = m = 0, ref2 = results.length - 1; 0 <= ref2 ? m <= ref2 : m >= ref2; k = 0 <= ref2 ? ++m : --m) {
                $('#reload_' + k).click(_this.reloadRow);
                results1.push($('#del_' + k).click(_this.removeRow));
              }
              return results1;
            }
          }
        };
      })(this));
    };

    readFile.prototype.reloadRow = function(evt) {
      var biomToStore, d, i;
      i = this.currentData.length - 1 - evt.currentTarget.id.replace("reload_", "");
      biomToStore = {};
      biomToStore.name = this.currentData[i].name;
      biomToStore.size = this.currentData[i].size;
      biomToStore.data = this.currentData[i].data;
      d = new Date();
      biomToStore.date = d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCDate() + "T" + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds() + " UTC";
      return this.server.biom.add(biomToStore).done(function(item) {
        this.currentData = item;
        return setTimeout("window.location.href = 'preview.html'", 1000);
      });
    };

    readFile.prototype.removeRow = function(evt) {
      var i, j, k, ref, results1, totalrows;
      i = evt.currentTarget.id;
      totalrows = $('#recent_data tr .del').length;
      results1 = [];
      for (k = j = 0, ref = totalrows - 1; 0 <= ref ? j <= ref : j >= ref; k = 0 <= ref ? ++j : --j) {
        if (i === $('#recent_data tr .del')[k].id) {
          console.log(this.currentData[totalrows - k - 1].id);
          results1.push(this.server.biom.remove(this.currentData[totalrows - k - 1].id).done(function() {
            return location.reload(true);
          }));
        } else {
          results1.push(void 0);
        }
      }
      return results1;
    };

    readFile.prototype.clearOldEntries = function(results) {
      console.log(results.length);
      if (results.length > 10) {
        return this.server.biom.remove(results[0].id).done((function(_this) {
          return function() {
            results.splice(0, 1);
            return location.reload(true);
          };
        })(this));
      }
    };

    return readFile;

  })();

  window.readFile = readFile;

}).call(this);
