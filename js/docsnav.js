// docsnav search uses https://github.com/slashdotdash/jekyll-lunr-js-search

$(function() {
  $('#search-query').lunrSearch({
    indexUrl: '/search.json',             // URL of the `search.json` index data for your site
    results:  '#search-results',          // jQuery selector for the search results container
    entries:  '.docsnav-entries',         // jQuery selector for the element to contain the results list, must be a child of the results element above.
    template: '#search-results-template'  // jQuery selector for the Mustache.js template
  });

  $("#search-query").keydown(function(event) {
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
    $(this).val() ? $(".docsnav-section").hide() : $(".docsnav-section").show();
  });

    var headings = $("<ul>", { "class" : "docsnav-title visible" })
        .insertAfter('.docsnav-section .active');

    $('#content h3').each(function(){
        var text = $(this).text().match(/^\s*([^\(]+)/)[1];
        var link = $('<a>', { href: '#' + $(this).attr('id'), text: text });
        link.appendTo(headings).wrap('<li>')
    });
});
