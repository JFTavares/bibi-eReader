/*!
 *
 * # BiB/i Extension: JaTEx
 *
 * - "Japanes Typesetting Extra"
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 * - Wed July 22 14:24:00 2015 +0900
 */
Bibi.x({name:"JaTEx",description:"Japanese Typesetting Extra",version:"0.1.0",build:20150722,HTMLString:"",Current:0,Log:!1,LogCorrection:!1,LogCancelation:!1,parse:function(a){return a&&"object"==typeof a&&a.tagName&&(a=a.innerHTML),a&&"string"==typeof a?(this.HTMLString=a,this.Current=0,this.Log&&(this.log(1,"BiB/i JaTEx"),this.log(2,"parse"),this.log(3,"HTMLString: "+this.HTMLString)),this.parseInnerHTML()):null},parseInnerHTML:function(){for(var a=(this.Current,[]),b=this.parsePart();null!==b&&(a.push(b),b=this.parsePart()););return a.length?a:null},parsePart:function(){var a=(this.Current,{}),b=this.parseString(/^<[^>]*?>/);if(b)return/^<!--/.test(b)?a.Type="Comment":(a.Type="Tag",/^<ruby[ >]/.test(b)?a.Detail="ruby:open":/^<\/ruby>/.test(b)?a.Detail="ruby:close":/^<span[ >]/.test(b)&&/ class="([\w\d\-]+[\s\t]+)*(tcy|sideways|upright)([\s\t]+[\w\d\-]+)*"/.test(b)?a.Detail="span.x:open":/^<span[ >]/.test(b)?a.Detail="span:open":/^<\/span>/.test(b)&&(a.Detail="span:close")),a.Content=b,a;var c=this.parseString(/[^<]+/);return c?(a.Type="Text",a.Content=c,a):null},parseString:function(a){var b=null,c=!1;if(a instanceof RegExp){var d=this.HTMLString.substr(this.Current,this.HTMLString.length-this.Current);a.test(d)&&(c=!0,a=d.match(a)[0])}else this.HTMLString.substr(this.Current,a.length)===a&&(c=!0);return c&&(this.Current+=a.length,b=a),this.correct(b)},markupEnclosure:function(a,b){for(var c=0,d=b.length;d>c&&b[c];c++){for(var e=b[c][0],f=b[c][1],g=b[c][2],h=new RegExp("("+e+")([^"+e+f+"]+)("+f+")","g");h.test(a);)a=a.replace(h,"<o>$2<c>");a=a.replace(/<o>/g,'<span class="enclosed '+g+'">'+e).replace(/<c>/g,f+"</span>")}return a},markupCharacters:function(a,b,c){for(var d=0,e=b.length;e>d&&b[d];d++)a=a.replace(new RegExp("("+b[d][0]+")","g"),'</span><span class="'+b[d][1]+'">'+c+"</span><span>");return a},markupPlural:function(a,b){return this.markupCharacters(a,b,"<span>$1</span>")},markupSingle:function(a,b){return this.markupCharacters(a,b,"$1")},correct:function(a){return this.Log&&this.LogCorrection&&a&&this.log(3,a),a},cancel:function(a,b){return this.Log&&this.LogCancelation&&this.log(4,"cancel: parse"+b+" ("+a+"-"+this.Current+"/"+this.HTMLString.length+")"),"number"==typeof a&&(this.Current=a),null},log:function(a,b){this.Log&&console&&console.log&&(0==a?b="[ERROR] "+b:1==a?b="---------------- "+b+" ----------------":2==a?b=b:3==a?b=" - "+b:4==a&&(b="   . "+b),console.log("BiB/i JaTEx: "+b))},defineMode:function(a){if(a.JaTEx={Markup:!1,Layout:!1},"ja"==B.Language){var b=a.HTML.getAttribute("data-bibi-jatex");if(b)switch(b=b.replace(/[ \s\t\n\r]+/g,"")){case"markup":a.JaTEx.Markup=!0;break;case"layout":a.JaTEx.Layout=!0;break;case"markup,layout":case"layout,markup":a.JaTEx.Markup=!0,a.JaTEx.Layout=!0}}},Selector:"p, li, dd"})(function(){E.bind("bibi:before:postprocessItem",function(a){X.JaTEx.defineMode(a),a.JaTEx.Markup&&(a.logNow("JaTEx Preprocess Start"),sML.each(a.Body.querySelectorAll(X.JaTEx.Selector),function(){var a=this,b=X.JaTEx.markupEnclosure(a.innerHTML,[["\\(","\\)","parenthesized with-parentheses"],["（","）","parenthesized with-fullwidth-parentheses"],["「","」","bracketed with-corner-brackets"],["『","』","bracketed with-double-corner-brackets"],["“","”","quoted with-double-quotation-marks"],["〝","〟","quoted with-double-prime-quotation-marks"],null]);a.innerHTML=b;var c=X.JaTEx.parse(a.innerHTML);if(c&&c.length){var d="",e=0,f=0;sML.each(c,function(){var a=this;"Comment"==a.Type||("Tag"==a.Type?"ruby:open"==a.Detail?e++:"ruby:close"==a.Detail?e--:"span.x:open"==a.Detail?f++:"span:open"==a.Detail&&(e||f?f++:"span:close"==a.Detail&&(e||f)&&f--):e||f||(a.Content=a.Content.replace(/⋯/g,"…").replace(/―/g,"—"),a.Content=X.JaTEx.markupPlural(a.Content,[["…{3,}","repeated horizontal-ellipses"],["……","repeated as-doublewidth-horizontal-ellipsis"],["—{3,}","repeated em-dashes"],["——","repeated as-doublewidth-em-dash"],["！{3,}","repeated fullwidth-exclamation-marks"],["？{3,}","repeated fullwidth-question-marks"],["！！","coupled as-double-exclamation-mark"],["？？","coupled as-double-question-mark"],["！？","coupled as-exclamation-question-mark"],["？！","coupled as-question-exclamation-mark"],null]),a.Content=X.JaTEx.markupSingle(a.Content,[["\\(","encloser parenthesis left-parenthesis"],["\\)","encloser parenthesis right-parenthesis"],["（","encloser fullwidth-parenthesis fullwidth-left-parenthesis"],["）","encloser fullwidth-parenthesis fullwidth-right-parenthesis"],["「","encloser corner-bracket left-corner-bracket"],["」","encloser corner-bracket right-corner-bracket"],["『","encloser white-corner-bracket left-white-corner-bracket"],["』","encloser white-corner-bracket right-white-corner-bracket"],["“","encloser double-quotation-mark left-double-quotation-mark"],["”","encloser double-quotation-mark right-double-quotation-mark"],["〝","encloser double-prime-quotation-mark reversed-double-prime-quotation-mark"],["〟","encloser double-prime-quotation-mark low-double-prime-quotation-mark"],["　","ideographic-space"],["、","ideographic-comma"],["。","ideographic-full-stop"],["…","horizontal-ellipsis"],["—","em-dash"],["！","fullwidth-exclamation-mark"],["？","fullwidth-question-mark"],null]),a.Content="<span>"+a.Content+"</span>")),d+=a.Content}),a.innerHTML=d.replace(/<span[^>]*><\/span>/g,""),sML.each(a.querySelectorAll(".repeated"),function(){this.innerHTML=this.innerHTML.replace(/<[^>]+>/g,"")}),sML.each(a.querySelectorAll(".coupled"),function(){this.innerHTML=this.innerHTML.replace(/<[^>]+>/g,"")})}}),a.logNow("JaTEx Preprocess End"))}),E.bind("bibi:postprocessItem",function(a){a.RubyParents=[],sML.each(a.Body.querySelectorAll("ruby"),function(){for(var b=this.parentNode;"block"!=getComputedStyle(b).display&&b!=a.Body;)b=b.parentNode;b!=a.Body&&a.RubyParents[a.RubyParents.length-1]!=b&&(a.RubyParents.push(b),b.WritingMode=O.getWritingMode(b),b.LiningLength=/^tb/.test(b.WritingMode)?"Width":"Height",b.LiningBefore=/tb$/.test(b.WritingMode)?"Top":/rl$/.test(b.WritingMode)?"Right":"Left",b.DefaultFontSize=parseFloat(getComputedStyle(b).fontSize),b.OriginalCSSText=b.style.cssText)})}),E.bind("bibi:postprocessItem",function(a){a.JaTEx.Layout&&(sML.CSS.addRule(".jatex-checker","display: block;",a.contentDocument),sML.CSS.addRule(".jatex-checker >span","display: block;",a.contentDocument),sML.CSS.addRule(".jatex-checker >span:last-child","text-align: right;",a.contentDocument),sML.CSS.addRule(".jatex-checker >span:first-child","text-align: left;",a.contentDocument),sML.CSS.addRule(".jatex-checker >span >span","display: inline-block; width: 0; height: 0;",a.contentDocument),sML.CSS.addRule(".jatex-test","display: inline-block; text-indent: 0;",a.contentDocument),sML.CSS.addRule(".jatex-burasage-tate","display: inline-block; position: relative; margin-top: -1em; top: 1em;",a.contentDocument),sML.CSS.addRule(".jatex-burasage-yoko","display: inline-block; position: relative; margin-left: -1em; left: 1em;",a.contentDocument))}),E.bind("bibi:before:resetItem.asReflowableItem.adjustContent",function(a){if(sML.UA.Safari||sML.UA.Chrome){var b=[];a.RubyParents.forEach(function(a){a.style.cssText=a.OriginalCSSText,b.push(a["offset"+a.LiningLength])});var c=sML.CSS.addRule("rt","display: none !important;",a.contentDocument);a.RubyParents.forEach(function(a,c){var d=b[c]-a["offset"+a.LiningLength];if(d>0&&d<a.DefaultFontSize){var e=getComputedStyle(a);a.style["margin"+a.LiningBefore]=parseFloat(e["margin"+a.LiningBefore])-d+"px"}}),sML.CSS.removeRule(c,a.contentDocument)}}),E.bind("bibi:before:resetItem",function(a){if(a.JaTEx.Layout){a.logNow("JaTEx Reset Start");{/^tb/.test(a.HTML.WritingMode)}sML.each(a.Body.querySelectorAll(".ideographic-space, .ideographic-comma, .ideographic-full-stop"),function(){this.className=this.className.replace(/ *jatex[^ ]+/g,"")}),a.logNow("JaTEx Reset End")}}),E.bind("bibi:resetItem",function(a){if(a.JaTEx.Layout){a.logNow("JaTEx Layout Start");var b=/^tb/.test(a.HTML.WritingMode),c=b?"Top":"Left";sML.each(a.Body.querySelectorAll(X.JaTEx.Selector),function(){var a=this.appendChild(sML.create("span",{className:"jatex-checker"}));this.StartPoint=a.appendChild(sML.create("span")).appendChild(sML.create("span"))["offset"+c],this.EndPoint=a.appendChild(sML.create("span")).appendChild(sML.create("span"))["offset"+c],this.removeChild(a);var d=this;sML.each(this.querySelectorAll(".ideographic-space, .ideographic-comma, .ideographic-full-stop"),function(){sML.addClass(this,"jatex-test"),this["offset"+c]==d.StartPoint&&sML.addClass(this,"jatex-burasage-"+(b?"tate":"yoko")),sML.removeClass(this,"jatex-test")})}),a.logNow("JaTEx Layout End")}})});