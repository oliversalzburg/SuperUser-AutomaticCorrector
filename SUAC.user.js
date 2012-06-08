// ==UserScript==
// @name          Super User Automatic Corrector
// @author        Tom Wijsman
// @version       1.0
// @description   Using Jakub Hampl & Nathan Osman's framework to create a Super User specific Automatic Corrector.
// @include       http://superuser.com/*
// @include       http://www.superuser.com/*
// ==/UserScript==

function EmbedCodeOnPage(javascript_code) {
	var code_element = document.createElement('script');
	code_element.type = 'text/javascript';
	code_element.textContent = javascript_code;
	document.getElementsByTagName('head')[0].appendChild(code_element);
}

function EmbedFunctionOnPage(function_name, function_contents) {
	EmbedCodeOnPage(function_contents.toString().replace(/function ?/, 'function ' + function_name));
}

function EmbedFunctionOnPageAndExecute(function_contents) {
	EmbedCodeOnPage("(" + function_contents.toString() + ")()");
}

EmbedFunctionOnPage('LoadDependentScript', function(script_filename, callback) {
	var script    = document.createElement('script');
	script.type   = 'text/javascript';
	script.src    = script_filename;
	script.onload = callback;
	document.getElementsByTagName('head')[0].appendChild(script);
});

EmbedFunctionOnPage('AddToolbarButton', function(toolbar, icon, tooltip, callback) {
	var left = toolbar.find('li:not(.wmd-help-button):last').css('left');

	if(left !== null)
		left = parseInt(left.replace(/\D/g, '')) + 50;
	else
		left = 400;

	var button = $('<li class="wmd-button" style="left: ' + left + 'px; background-image: url(' + icon + '); background-repeat: no-repeat; background-position: center center;" title="' + tooltip + '"></li>');

	button.click(callback);

	toolbar.append(button);

});

EmbedFunctionOnPage('CorrectTitle', function(title) {
	return title.replace(/^([a-z])/g, function(match) { return match.toUpperCase(); }).replace(/(i|I)ssue/g, ''); //.replace(/([A-Z]{2,})/g, function(i) { return i.toLowerCase() });
});

EmbedFunctionOnPage('CorrectBody', function(original_body) {
	var corrections = {
		CorrectCommonMisspellings : function(body) {
			var replacements = {
				'dont':'don\'t',
				'i( |\')?':'I$1',
				'teh':'the',
				'(?:ubunto|ubunut|ubunutu|ubunu|ubntu|ubutnu|uuntu|unbuntu|ubunt|ubutu)':'Ubuntu',
				'windows phone':'Windows Phone',
				'windows':'Windows',
				'zune':'Zune',
				'I (got)':'I have',
				'whoo?ping':'',
				'just few':'just a few',
				'I (never|bought|searched)':'I have $1',
				'is your done':'is that you are done',
				'whos':'who\'s',
				'havent':'haven\'t',
				'wouldnt':'wouldn\'t',
				'therfore':'therefore',
				'unrestrictive':'nonrestrictive',
				'thier':'their',
				'isnt':'isn\'t'
			};

			for (var wrong_word in replacements)
				body = body.replace(new RegExp('\\b' + wrong_word + '\\b', 'gi'), replacements[wrong_word]);

			var endings = {
				'essisary':'ecessary',
				'harachters':'haracters',
				'abey':'aybe',
				'efull':'eful',
				'rafic':'raphic',
				'eparatable':'eparable','eperatable':'eparable','eperable':'eparable',
				'ylise':'ylize',
				'tivly':'tively',
				'mmount':'mount',
				'rmenent':'rmanent'
			};

			for (var wrong_word in endings)
				body = body.replace(new RegExp(wrong_word + '\\b', 'gi'), endings[wrong_word]);

			return body;
		},

		GetRidOfSimleys : function (body) {
			body = body
			.replace(/:-\)/gi, '').replace(/:\)/gi, '').replace(/:-\(/gi, '').replace(/:\(/gi, '')
			.replace(/;-\)/gi, '').replace(/;\)/gi, '').replace(/:-D/gi, '').replace(/:D/gi, '')
			.replace(/:-O/gi, '').replace(/:O/gi, '').replace(/:-S/gi, '').replace(/:S/gi, '')
			;return body;
		},

		CorrectFileSizes : function(body) {
			body = body
			.replace(/([0-9])(MB|GB)\b/gi, '$1 $2')
			;return body;
		},

		CorrectMarks : function(body) {
			body = body
			.replace(/\.\.\.+/gi, 'SUPERSPECIALDOTFIX')
			.replace(/\.+/gi, '.')
			.replace(/[.]([ ]+[.]+)+/gi, '.')
			.replace(/\.\?/gi, '?')
			.replace(/\.:/gi, ':')
			.replace(/\?\?+/gi, '?') /* Fix question mark repetition */
			.replace(/!!+/gi, '!') /* Fix exclamation mark repettition */
			.replace(/(?!\w) ([.!?])/gi, '$1') /* Fix (single) space before punctuation mark */
			;return body;
		},

		CorrectShortSentences : function(body) {
			body = body
			.replace(/Any idea(s)?[?]/gi, 'Do you have any idea how I can solve this?')
			;return body;
		},

		ProperSpacesAroundPunctuationMarks : function (body) {
			body = body
			.replace(/(((http:\/\/|https:\/\/|ftp:\/\/|www\.)[a-zA-Z0-9\/.%_#~-]*)|(http:\/\/|https:\/\/|ftp:\/\/)?([0-9]+[.]?)+)?([ ]*[.:!,]+[ ]*)/gi, function (orig,look,_,_,_,_,match) { return look?orig:match.trim().substring(0,1) + ' '; })
			;return body;
		},

		RemoveSentences : function(body) {
			body = body
			.replace(/I have this problem[.:!, ]*/gi, '')
			.replace(/I am stumped[.:!, ]*/gi, '')
			.replace(/[t|T]hanks for help[.:!, ]*/gi, '')
			.replace(/^ *[b|B]ut */gim, '')
			.replace(/[w|W]hat could be the problem[.:!?, ]*/gim, '')
			.replace(/^Wow[.:!?, ]*/gi, '')
			.replace(/[p|P]lease [h|H]elp[.?!,]*/gi, '')
			;return body;
		},

		RemoveHTH : function(body) {
			return body.replace(/^[A-Za-z ]*hope this helps[A-Za-z ?!.]*$/gim, '');
		},

		RemoveThankYou : function(body) {
			return body.replace(/(?:, |many )?(?:thank|k?thn?x(?:bye)?)(?:s|(?: |-)you)?(?: (?:so|very) much)?(?:\s?(?:,|-)(?:[\w\s]+)| :-?\)| a lot| and regards| for(?: any| the)? (?:help|ideas)| in advance)?[.|!]?/i, '');
		},

		CorrectLists : function(body) {
			body = body
			.replace(/([0-9]+\))/gi, function(match) { return match.replace(')', '.'); })
			.replace(/\(([0-9]+)\./gi, function(match) { return match.replace('.', ')'); })
			.replace(/^\w\)/img, function(match) { return "  " + ( match.substr(0,1).toUpperCase().charCodeAt(0) - 64 ) + "."; })
			;return body;
		},

		CorrectFirstLetters : function(body) {
			body = body
			.replace(/\b([A-Za-z]+)(\.|\?|\!)[ ]+([a-z])/gi, function(_, word, one, two) { return word + one + ' ' + two.toUpperCase(); })
			.replace(/(^|(?:\. ))([a-z])/gm, function(match,prefix,letter) { return prefix + letter.toUpperCase(); }) /* Capitalize the first letter of each new sentence. */
			;return body;
		},

		FixEnumerations : function(body) {
		  body = body
			.replace(/and(?=[^,.!?\n]*?and)/gi, function(match) { return ','; }) /* Replace repetitive use of 'and' with comma. */
			;return body;
		},

		CorrectScriptMistakes : function(body) {
			body = body

			// CorrectFirstLetters
			.replace(/,[ ]+I\.e./gi, ', i.e.')

			// ProperSpacesAroundPunctuationMarks
			.replace(/Http:\/\//gi, 'http://')
			.replace(/Ftp:\/\//gi, 'ftp://')
			.replace(/Www\./gi, 'www.')
			.replace(/www\.[ ]/gi, 'www.')
			.replace(/:[ ]\/\//gi, '://')
			.replace(/([.:!,])[ ]\*/gi, '$1*')
			// XXX Breaks: "Oh. So, that was cool." into "Oh.so, that was cool." which is unacceptable. We will want to remove any words from here that could be used after a "." and then uncomment it.
			//.replace(/\.[ ]+(ac|ad|ae|aero|af|ag|ai|al|am|an|ao|aq|as|asia|at|aw|ax|az|ba|bb|be|bf|bg|bh|bi|biz|bj|bm|bo|br|bs|bt|bw|by|bz|ca|cat|cc|cd|cf|cg|ch|ci|cl|cm|cn|co|com|coop|cr|cu|cv|cx|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|es|eu|fi|fm|fo|fr|ga|gd|ge|gf|gg|gh|gi|gl|gm|gov|gp|gq|gr|gs|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|im|in|info|int|io|iq|ir|is|it|je|jo|jobs|jp|kg|ki|km|kn|kr|ky|kz|la|lc|li|lk|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mil|mk|ml|mn|mo|mobi|mp|mq|mr|ms|mu|museum|mv|mw|mx|my|na|name|nc|ne|net|nf|nl|no|nr|nu|org|pa|pe|pf|ph|pk|pl|pm|pn|pr|pro|ps|pt|pw|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sk|sl|sm|sn|so|sr|st|su|sy|sz|tc|td|tel|tf|tg|th|tj|tk|tl|tm|tn|to|travel|tt|tv|tw|ua|ug|us|uz|va|vc|vg|vi|vn|vu|wf|ws|yt|xxx)\b/gi, function(match) { return '.' + match.toLowerCase(); })
			.replace(/\.It'/gm, '. It\'')

			// CorrectMarks
			.replace(/SUPERSPECIALDOTFIX/gi, '...')

			;return body;
		},
	};

	for (var correction in corrections)
		original_body = corrections[correction](original_body);

	return original_body;
});

EmbedFunctionOnPage('diffString', function(o, n) {
	o = o.replace(/\s+$/, '');
	n = n.replace(/\s+$/, '');

	var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/));
	var str = "";

	var oSpace = o.match(/\s+/g);
	if (oSpace == null) {
		oSpace = ["\n"];
	} else {
		oSpace.push("\n");
	}
	var nSpace = n.match(/\s+/g);
	if (nSpace == null) {
		nSpace = ["\n"];
	} else {
		nSpace.push("\n");
	}

	if (out.n.length == 0) {
		for (var i = 0; i < out.o.length; i++) {
			str += '<span class="diff-delete">' + out.o[i] + oSpace[i].replace(/\n/g, ' ') + "</span>";
		}
	} else {
		if (out.n[0].text == null) {
			for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
				str += '<span class="diff-delete">' + out.o[n] + oSpace[n].replace(/\n/g, ' ') + "</span>";
			}
		}

		for (var i = 0; i < out.n.length; i++) {
			if (out.n[i].text == null) {
				str += '<span class="diff-add">' + out.n[i] + nSpace[i] + "</span>";
			} else {
				var pre = "";

				for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++) {
					pre += '<span class="diff-delete">' + out.o[n] + oSpace[n].replace(/\n/g, ' ') + "</span>";
				}
				str += " " + out.n[i].text + nSpace[i] + pre;
			}
		}
	}

	return str.replace(/\b <\/span> \b/gi, '</span> ');
});

EmbedFunctionOnPage('diff', function(o, n) {
	var ns = new Object();
	var os = new Object();

	for (var i = 0; i < n.length; i++) {
	if (ns[n[i]] == null)
		ns[n[i]] = {
			rows: new Array(),
			o: null
		};
		ns[n[i]].rows.push(i);
	}

	for (var i = 0; i < o.length; i++) {
	if (os[o[i]] == null)
		os[o[i]] = { rows: new Array(), n: null };
		os[o[i]].rows.push(i);
	}

	for (var i in ns) {
		if (ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1) {
			n[ns[i].rows[0]] = {
				text: n[ns[i].rows[0]],
				row: os[i].rows[0]
			};
			o[os[i].rows[0]] = {
				text: o[os[i].rows[0]],
				row: ns[i].rows[0]
			};
		}
	}

	for (var i = 0; i < n.length - 1; i++) {
		if (n[i].text != null && n[i + 1].text == null && n[i].row + 1 < o.length && o[n[i].row + 1].text == null && n[i + 1] == o[n[i].row + 1]) {
			n[i + 1] = {
				text: n[i + 1],
				row: n[i].row + 1
			};
			o[n[i].row + 1] = {
				text: o[n[i].row + 1],
				row: i + 1
			};
		}
	}

	for (var i = n.length - 1; i > 0; i--) {
		if (n[i].text != null && n[i - 1].text == null && n[i].row > 0 && o[n[i].row - 1].text == null && n[i - 1] == o[n[i].row - 1]) {
			n[i - 1] = {
				text: n[i - 1],
				row: n[i].row - 1
			};
			o[n[i].row - 1] = {
				text: o[n[i].row - 1],
				row: i - 1
			};
		}
	}

	return {
		o: o,
		n: n
	};
});

EmbedFunctionOnPageAndExecute(function() {
	LoadDependentScript('http://files.quickmediasolutions.com/js/jquery.livequery.js', function() {
		$('.wmd-button-row').livequery(function() {
			var toolbar = $(this);

			window.setTimeout(function() {
				AddToolbarButton(toolbar, 'http://i.stack.imgur.com/wWIIc.png', 'Stack Exchange Post Editor',
				function() {
					var title = toolbar.parents('.post-editor').find('#title');

					if (title.length) {
						var new_title = CorrectTitle(title.attr('value'));
						title.attr('value', new_title);
						$('#question-header .question-hyperlink').text(new_title)
					}

					var editor = toolbar.parents('.wmd-container').find('.wmd-input');
					var original = editor.val();
					var corrected = CorrectBody(original);
					editor.val(corrected);
					toolbar.parents('.post-editor').find('.wmd-preview').html(diffString(original, corrected).replace(/\n/g, '<br />'));
				});
			}, 100);
		});
	});
});