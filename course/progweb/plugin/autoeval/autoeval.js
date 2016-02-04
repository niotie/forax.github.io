(function() {
	if( typeof window.addEventListener === 'function' ) {
                console.log('init autoeval');
		var areas = document.querySelectorAll( 'textarea' );

		for( var i = 0, len = areas.length; i < len; i++ ) {
			var element = areas[i];

                        if (element.attributes.autoeval != undefined) {
                          var name = element.attributes.autoeval.value;
                          var e = document.getElementById(name);
                          //console.log("found " + e);
                          (function(element, e) {
                            element.addEventListener('keyup', function(event) {
		                e.innerHTML = element.value;
                                //console.log("modified !" + element.value);
                              }, false);
                           })(element, e);
                        }

                        if (element.attributes.autostyle != undefined) {
                          var frame = frames[element.attributes.autostyle.value];
                          
                          (function(element, frame) {
                            var listener = function(event) {
                              var doc = (frame.contentWindow || frame.contentDocument);
                              if (doc.document) doc = doc.document;

                              var head = doc.head;
                              //console.log("head " + head);

		              head.innerHTML = "<style>" + element.value + "</style>";
                              //console.log("modified !" + element.value);
                            };

                            element.addEventListener('keyup', listener, false);
                            frame.addEventListener('load', listener, false);
                            
                           })(element, frame);
                        }

                        if (element.attributes.autojslog != undefined) {
                          var name = element.attributes.autojslog.value;
                          var e = document.getElementById(name);
                          //console.log("found " + e);

                          (function(element, e) {
                            var listener = function(event) {
                              e.innerHTML = "";
                              var console = { log: function(msg) {
                                e.appendChild(document.createTextNode(msg));
                                e.appendChild(document.createElement("br"));
                              } }; 
                              try {
                                eval(element.value);
                              } catch(err) {
                                var error = document.createElement("div");
                                error.setAttribute("class", "autojserror");
                                error.appendChild(document.createTextNode(err));
                                e.appendChild(error);
                              }
                            };
                            element.addEventListener('keyup', listener, false);
                            Reveal.addEventListener( 'slidechanged', listener);
                          })(element, e);
                        }

                        if (element.attributes.autojs != undefined) {
                          var name = element.attributes.autojs.value;
                          var e = document.getElementById(name);
                          //console.log("found " + e);

                          var trimSemicolon = function(text) {
                            if (text[text.length - 1] == ';') {
                              return text.substring(0, text.length - 1);
                            }
                            return text;
                          };

                          (function(element, e) {
                            var listener = function(event) {
                              e.innerHTML = "";
                              var array = element.value.split('\n').map(function(line, num) {
                                var instr = line.trim();
                                if (instr == "") {
                                  return line;
                                }
                                if (instr.startsWith("var")) {
                                  var index = line.indexOf('=');
                                  if (index == -1) {
                                    return line;
                                  } else {
                                    var init = trimSemicolon(line.substring(index + 1));
                                    return line.substring(0, index) + "= tap(" + num + ", " + init + ");"; 
                                  }
                                }
   
                                if (instr.startsWith("console.") ||
                                    instr.startsWith("return") ||
                                    instr.startsWith("if") ||
                                    instr.startsWith("while") ||
                                    instr.startsWith("for") ||
                                    instr.startsWith("}") ||
                                    instr.startsWith("//")) {
                                  return line;
                                }
                                return "tap(" + num + ", " + trimSemicolon(instr) + ");"; 
                              });

                              array.forEach(function(line) {
                                var div = document.createElement("div");
                                div.setAttribute("class", "autojsresult");
                                div.appendChild(document.createTextNode(String.fromCharCode(160)));
                                e.appendChild(div);
                              });

                              var content = array.join('\n');
                              //window.console.log(content);

                              var tap = function(num, val) {
                                  var div = e.childNodes[num];
                                  div.replaceChild(document.createTextNode(val), div.childNodes[0]);
                                  return val;
                              };
                              eval(content);
                            };
                            element.addEventListener('keyup', listener, false);
                            Reveal.addEventListener( 'slidechanged', listener);
                          })(element, e);
                        }
		}
	}
})();

