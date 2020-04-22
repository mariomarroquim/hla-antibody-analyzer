//var electron  = require('electron').remote;
var $         = require('jquery');
var popper    = require('popper.js');
var bootstrap = require('bootstrap');
var xlsx      = require('xlsx');

var datatables = require('datatables.net')(window, $);
require('datatables.net-bs4')(window, $);

var sugar = require('sugar');
sugar.Array.extend();
sugar.String.extend();

$(document).ready(function(){
  var panelTable = $('#panel_table').DataTable({
    'ordering': true,
    'order': [[1, 'desc']],
    'searching': true,
    'paging': false,
    'scrollY': 400,
    'info': false,
    'language': {
      'search': 'Filter',
      'zeroRecords': 'No HLA alleles were found.',
      'infoEmpty': 'No HLA alleles were found.',
      'emptyTable': 'No HLA alleles were found.',
      'decimal': ',',
      'thousands': '.'
    }
  });

  $('#panel_file').change(function(e){
    e.preventDefault();

    if (e.target.files.length == 0) {
      return false;
    }

    $('#results').hide();
    panelTable.clear();

    var reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);

    reader.onload = function(e){
      var rawData = new Uint8Array(reader.result);
      var worksheet = xlsx.read(rawData, {type: 'array'});
      var firstSheet = worksheet.Sheets[worksheet.SheetNames[0]];
      var extractedData = xlsx.utils.sheet_to_json(firstSheet, {raw: true, header: 1});

      //console.log(extractedData);

      $.each(extractedData, function(index, line){
        var allele = null;
        var mfi = null;

        if(typeof(line[0]) === 'string' && line[0].includes('*')){
          allele = line[0];
          mfi = line[1];
        }

        if(allele !== null && mfi !== null){
          allele = allele.removeAll(' ').removeAll('-').split(',').compact(true).join('-');
          mfi = mfi.removeAll("'").split(',')[0].toNumber();

          panelTable.row.add([allele, mfi]);
        }
      });

      $('#results').show();

      panelTable.draw();
    };
  });

  $('#panel_filter_form').submit(function(e){
    e.preventDefault();

    panelTable.search($('#panel_filter').val()).draw();
  });
});

