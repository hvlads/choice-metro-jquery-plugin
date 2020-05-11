!function(e){e.fn.metro=function(a){var n=this,s=t=>{var n=a.callback;e.isFunction(n)&&n.call(this,t)},i=e.extend({},e.fn.metro.defaults,a),o=`<input type="text" id="metro-input" placeholder="${i.placeholder}" class="${i.cssClass}">`,c=function(t){return`<button class="toggle-button">${t}</button>`},l=`<div class="lines-toggle"> ${c("По алфавиту")} ${c("По линии")}</div>`;this.append('<div id="metro-wrapper-2020"></div>');let r=e("#metro-wrapper-2020");e(r).append(o),e(r).append('<div id="selected-metro"></div>'),e(r).append(l),e(r).append('<div id="stations-container"></div>'),e(r).append('<div id="lines-container"></div>'),e(".toggle-button:first").addClass("active"),e(".toggle-button:first").on("click",function(t){t.preventDefault(),e("#lines-container").hide(),e("#stations-container").show(),e(this).addClass("active"),e(".toggle-button:last").removeClass("active")}),e(".toggle-button:last").on("click",function(t){t.preventDefault(),e("#stations-container").hide(),e("#lines-container").show(),e(this).addClass("active"),e(".toggle-button:first").removeClass("active")}),e.ajax({url:`https://api.hh.ru/metro/${i.city}`,dataType:"jsonp",success:function(t){f(t)}});var d=e=>(t="",t+='<div class="station">',t+='<label class="checkbox-group" style="word-wrap:break-word">',t+=`<input data-source='${JSON.stringify(e)}' class="input-${e.id.replace(".","-")}" type="checkbox"> `,t+=`<span class="checkmark"></span> <span class="color-span-line" style="background:#${e.hex_color}"></span> ${e.name}`,t+="</label>",t+="</div>",t),p=()=>{let t="";e("#stations-container").find("input:checked").each((a,n)=>{t+=`<button data-source='${JSON.stringify(e(n).data("source"))}'`,t+=`class="btn_selected">${e(n).parent().text()} <i class="fa fa-close"></i></button>`}),""!==t?e("#selected-metro").html(t):e("#selected-metro").html(""),e(".btn_selected .fa").on("click",t=>{let a=`.input-${e(t.target).parent().data("source").id.replace(".","-")}`;e(a,n).prop("checked",!1),e(t.target).parent().remove(),h()})},h=()=>{let t=[];e("#stations-container input:checked").each((a,n)=>{t.push(e(n).data("source"))}),s(t)},u=(t,e)=>t.name<e.name?-1:t.name>e.name?1:0,f=a=>{let s=(t=>{var a=[];return t.lines.forEach(t=>{t.stations.forEach(n=>{let s=e.extend({},n,{hex_color:t.hex_color});a.push(s)})}),a})(a);s.sort(u),s,e("#stations-container").html((e=>(t="",t+='<div class="station_wrap">',e.forEach(e=>{t+=d(e)}),t+="</div>",t))(s));let i=(a=>(t="",t+='<div class="lines_wrap">',a.lines.forEach(a=>{t+='<div class="line-metro"><i class="fa fa-angle-right" aria-hidden="true"></i><i class="fa fa-angle-down" aria-hidden="true"></i>',t+=`${a.name}<span class="color-span" style="background:#${a.hex_color}"></span>`,t+='<div class="station">',t+='<label  class="checkbox-group" style="word-wrap:break-word">',t+='<input class="all_lines" type="checkbox"> <span class="checkmark"></span> Выбрать все линии ветки',t+="</label>",t+="</div>",a.stations.forEach(n=>{let s=e.extend({},n,{hex_color:a.hex_color});t+=d(s)}),t+="</div>"}),t+="</div>",t))(a);e("#lines-container").html(i),e(".line-metro").on("click",t=>{console.log(e(t.target)),e(t.target).find("div.station").toggle(),e(t.target).find("i").toggle()}),e("input").not(".all_lines").change(function(t){let a=t.target;a.checked?e(n).find(`input.${e(a).attr("class")}`).not(a).prop("checked",!0):e(n).find(`input.${e(a).attr("class")}`).not(a).prop("checked",!1),p(),h()}),e(".all_lines").on("click",t=>{t.target.checked?e(t.target).parents(".line-metro").find("input").not(".all_lines").each((t,a)=>{e(n).find(`input.${e(a).attr("class")}`).prop("checked",!0)}):e(t.target).parents(".line-metro").find("input").not(".all_lines").each((t,a)=>{e(n).find(`input.${e(a).attr("class")}`).prop("checked",!1)}),p(),h()}),e("#metro-input").on("keyup",t=>{e("#lines-container").hide(),e("#stations-container").show();let a=e(t.target).val(),n=s.filter(t=>t.name.startsWith(a));""!==a?(e("#stations-container").find("input").parents(".station").hide(),n.forEach(t=>{e(`#stations-container input.input-${t.id.replace(".","-")}`).parents(".station").show()})):e("#stations-container .station").show()})};return this},e.fn.metro.defaults={placeholder:"Выберите метро",cssClass:"metro",city:"1"}}(jQuery);