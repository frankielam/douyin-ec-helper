function refresh() {
     
     window.location.reload();
     
}

(function(){
	// info()
     setTimeout(function(){
          $('#tips').html('hello')
     }, 3000)

     $('#refresh').click(function() {
          refresh()
     })
})();
