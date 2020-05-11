(function ($) {
    $.fn.metro = function (options) {
        var self = this;
        var all_metro;
        var call = (metro) => {
            var callback = options.callback;
            if ($.isFunction(callback)) {
                callback.call(this, metro);
            }
        }
        

        var wrapper = '<div id="metro-wrapper-2020"></div>'
        var opts = $.extend({}, $.fn.metro.defaults, options);
        var input = `<input type="text" id="metro-input" placeholder="${opts.placeholder}" class="${opts.cssClass}">`;
        var button_abc = function (text) {
            return `<button class="toggle-button">${text}</button>`;
        }
        var toggle_template = `<div class="lines-toggle"> ${button_abc('По алфавиту')} ${button_abc('По линии')}</div>`
        var stationsContainer = `<div id="stations-container"></div>`
        var selected = `<div id="selected-metro"></div>`
        var linesContainer = `<div id="lines-container"></div>`
        this.append(wrapper)
        let w = $('#metro-wrapper-2020')
        $(w).append(input);
        $(w).append(selected);
        $(w).append(toggle_template);
        $(w).append(stationsContainer);
        $(w).append(linesContainer);
        $('.toggle-button:first').addClass('active')

        $('.toggle-button:first').on('click', function (e) {
            e.preventDefault();
            $('#lines-container').hide()
            $('#stations-container').show()
            $(this).addClass('active')
            $('.toggle-button:last').removeClass('active')
        });

        $('.toggle-button:last').on('click', function (e) {
            e.preventDefault();
            $('#stations-container').hide()
            $('#lines-container').show()
            $(this).addClass('active')
            $('.toggle-button:first').removeClass('active')
        })

        var metro;

        $.ajax({
            url: `https://api.hh.ru/metro/${opts.city}`,
            dataType: "jsonp",
            success: function (data) {
                after_ajax(data);
            }
        });

        var stations = (metro) => {
            var _stations = [];
            var container = '';
            metro.lines.forEach(line => {
                line.stations.forEach(st => {
                    let m = $.extend({}, st, {'hex_color': line.hex_color});
                    _stations.push(m);
                });
            })
            return _stations;
        }

        var checkbox_template = (el) => {
            t = '';
            t += '<div class="station">'
            t += `<label class="checkbox-group" style="word-wrap:break-word">`;
            t += `<input data-source='${JSON.stringify(el)}' class="input-${el.id.replace('.', '-')}" type="checkbox"> `;
            t += `<span class="checkmark"></span> <span class="color-span-line" style="background:#${el.hex_color}"></span> ${el.name}`;
            t += `</label>`;
            t += '</div>'
            return t;
        }

        var stations_template = (lines) => {
            t = '';
            t += '<div class="station_wrap">'
            lines.forEach((e) => {
                t += checkbox_template(e)
            });
            t += '</div>'
            return t;
        }

        var lines_template = (metro) => {

            t = '';
            t += '<div class="lines_wrap">'
            metro.lines.forEach(line => {
                t += `<div class="line-metro"><i class="fa fa-angle-right" aria-hidden="true"></i><i class="fa fa-angle-down" aria-hidden="true"></i>`;
                t+= `${line.name}<span class="color-span" style="background:#${line.hex_color}"></span>`
                t += `<div class="station">`
                t += `<label  class="checkbox-group" style="word-wrap:break-word">`;
                t += `<input class="all_lines" type="checkbox"> <span class="checkmark"></span> Выбрать все линии ветки`
                t += `</label>`;
                t += '</div>'
                line.stations.forEach(e => {
                    let m = $.extend({}, e, {'hex_color': line.hex_color});
                    t += checkbox_template(m)
                });
                t += `</div>`;
            })
            t += '</div>'
            return t;
        }

        var add_buttons = () => {
            let buttons = '';
            $('#stations-container').find('input:checked').each((i, e) => {
                buttons += `<button data-source='${JSON.stringify($(e).data('source'))}'`;
                buttons += `class="btn_selected">${$(e).parent().text()} <i class="fa fa-close"></i></button>`;
            })
            if (buttons !== '') {
                $('#selected-metro').html(buttons)
            } else {
                $('#selected-metro').html('')
            }
            $('.btn_selected .fa').on('click', (e) => {
                let checkbox_class = `.input-${$(e.target).parent().data('source').id.replace('.', '-')}`
                $(checkbox_class, self).prop('checked', false)
                $(e.target).parent().remove()
                _callback()
            })
        }

        var _callback = () => {
            let m = [];
            $('#stations-container input:checked').each((i, el) => {
                m.push($(el).data('source'))
            })
            call(m);
        }


        var check = () => {
            $("input").not('.all_lines').change(function (e) {
                let inp = e.target
                if (inp.checked) {
                    $(self).find(`input.${$(inp).attr('class')}`).not(inp).prop('checked', true);
                } else {
                    $(self).find(`input.${$(inp).attr('class')}`).not(inp).prop('checked', false);
                }
                add_buttons();
                _callback()
            });
        }
        var all_check = () => {
            $('.all_lines').on('click', (e) => {
                if (e.target.checked) {
                    $(e.target).parents('.line-metro').find('input').not('.all_lines').each((i, a) => {
                        $(self).find(`input.${$(a).attr('class')}`).prop('checked', true);
                    })
                } else {

                    $(e.target).parents('.line-metro').find('input').not('.all_lines').each((i, a) => {
                        $(self).find(`input.${$(a).attr('class')}`).prop('checked', false);
                    })
                }
                add_buttons();
                _callback()
            })
        }

        var compare = (a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        }

        var onlyUnique = (value, index, self) => {
            return self.indexOf(value) === index;
        }


        var after_ajax = (metro) => {
            let st = stations(metro);
            st.sort(compare)//.filter(onlyUnique);
            all_metro = st;
            $('#stations-container').html(stations_template(st))
            let l = lines_template(metro)
            $('#lines-container').html(l)
            $('.line-metro').on('click', (e) => {
                console.log($(e.target))
                $(e.target).find('div.station').toggle();
                $(e.target).find('i').toggle();
            })

            check();
            all_check();

            $('#metro-input').on('keyup', (e) => {
                $('#lines-container').hide()
                $('#stations-container').show()
                let key = $(e.target).val()
                let new_st = st.filter((s) => {
                    return s.name.startsWith(key)
                })
                if (key !== '') {
                    $('#stations-container').find('input').parents('.station').hide()
                    new_st.forEach((el) => {
                        $(`#stations-container input.input-${el.id.replace('.', '-')}`).parents('.station').show()
                    })
                } else {
                    $('#stations-container .station').show()
                }

            });
        }
        return this;
    };

    $.fn.metro.defaults = {
        placeholder: "Выберите метро",
        cssClass: "metro",
        city: "1"
    };
}(jQuery));