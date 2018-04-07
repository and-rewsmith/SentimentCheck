function search(){
    var name = document.getElementById("autocomplete").value.toLowerCase();
    document.getElementById("searchDiv").style.display = "none";
    $.get({
        dataType: "json",
        url: "https://charitycheck-check.firebaseio.com/charities.json",
        data: "{name: " + name + "}", 
        success: function(data) {
            var charity = null;
            for (var someKey in data) {
                if (data[someKey]["name"].toLowerCase() == name) {
                    displayResults(data[someKey]);
                    return;
                }
            }
	    // if we get here, call Adnrew's endpoint;
            $.get({
		dataTyoe: "json",
		url: "http://127.0.0.1:5000/charity?name="+name,
		data: "{name: " + name + "}"})
            document.getElementById("loadDiv").style="display:lol";
        }
    });
}

document.body.onkeyup = function(e){
    if(e.keyCode == 13){
        search();
    }
}


function displayResults(data) {
    console.log(data);
    console.log(data["name"]);
    document.getElementById("displayDiv").style = "display: lol";
    document.getElementById("charityName").innerHTML = data["name"];
    document.getElementById("charityName").style.padding;
    var pol = Math.round(parseFloat(data["sentiment"][0]) * 100);
    var sub = Math.round(parseFloat(data["sentiment"][1]) * 100);
    document.getElementById("score1").innerHTML = "Polarity: " + pol + "/100";
    document.getElementById("score2").innerHTML = "Subjectivity: " + sub + "/100";
	id = data["positive"][0];
    $.ajax({
        type: "GET",
        dataType: "json",
        url: 'https://publish.twitter.com/oembed?url=https://twitter.com/andypiper/status/' + id,
        success: function(data) {
            console.log(data);
        }
    });
}



var defaultOptions = {
    i18n: {
        selected: '#{value}. Selected #{selected} of #{total}.',
        complete: 'You have selected #{value}',
        found: '#{count} suggestions found. Use up or down key to select.',
        notfound: 'No suggestions found.'
    },
    render: {
        ul: function() {
            var el = document.createElement('ul');
            el.classList.add('autocomplete--suggestions');
            return el;
        },
        li: function(data) {
            var el = document.createElement('li');
            el.setAttribute('tabindex', '-1');
            el.setAttribute('role', 'button');
            el.innerText = data;
            return el;
        }
    }
};

function autocomplete(inputEl, listFromValue, prefs) {
    var opened = false;
    var liveEl, suggestionsEl;
    var initialised = false;
    var completed = false;
    var selected = -1;
    var savedValue;

    if (!prefs) { prefs = {} }
    var options = {
        i18n: Object.assign({}, defaultOptions.i18n, prefs.i18n || {}),
        render: Object.assign({}, defaultOptions.render, prefs.render || {})
    };

    inputEl.addEventListener('focus', handleInputFocus, false);

    return {
        destroy: destroy,
        close: close
    };

    function start() {
        if (initialised) return;

        // create live region to indicate results
        liveEl = document.createElement('div');
        liveEl.setAttribute('role', 'status');
        liveEl.setAttribute('aria-live', 'assertive');
        liveEl.setAttribute('aria-relevant', 'additions');
        // hide for all but screenreader
        liveEl.style.position = 'absolute';
        liveEl.style.pointerEvents = 'none';
        liveEl.style.opacity = '0';
        liveEl.style.left = '-9999px';
        document.body.appendChild(liveEl);

        // create list of suggestions to show
        suggestionsEl = options.render.ul();
        suggestionsEl.style.display = 'none'; // hide by default
        if (inputEl.nextSibling) {
            inputEl.parentNode.insertBefore(suggestionsEl, inputEl.nextSibling);
        } else {
            inputEl.parentNode.appendChild(suggestionsEl);
        }

        // listen to input events
        inputEl.addEventListener('change', handleInputChange, false);
        inputEl.addEventListener('input', handleInput, false);
        inputEl.addEventListener('keydown', handleKey, false);
        document.addEventListener('focusin', handleDocumentFocus, false);
        document.addEventListener('click', handleDocumentClick, false);

        initialised = true;
    }

    function stop() {
        if (!initialised) return;
        inputEl.removeEventListener('change', handleInputChange, false);
        inputEl.removeEventListener('input', handleInput, false);
        inputEl.removeEventListener('keydown', handleKey, false);
        document.removeEventListener('focusin', handleDocumentFocus, false);
        document.removeEventListener('click', handleDocumentClick, false);

        liveEl.parentNode.removeChild(liveEl);
        suggestionsEl.parentNode.removeChild(suggestionsEl);

        initialised = false;
    }

    function destroy() {
        close();
        stop();
        inputEl.removeEventListener('focus', handleInputFocus, false);
    }

    // interation event handler

    function handleInputFocus(event) {
        start();
        // select all text on focus
        selectAll();
        if (completed) {
            return;
        }
        updateSuggestions();
    }

    function handleInputChange(event) {
        if (savedValue !== event.target.value) {
            completed = false;
        }
    };

    function handleInput(event) {
        if (savedValue !== event.target.value) {
            completed = false;
            updateSuggestions();
        }
    }

    function handleDocumentClick(event) {
        if (containsElement(inputEl, event.target)) {
            return;
        }
        if (event.target.parentNode === suggestionsEl) {
            setValueOfItem(event.target);
            complete();
        } else {
            stop();
        }
        close();
    }

    function handleDocumentFocus(event) {
        if (!containsElement(inputEl, event.target) && !containsElement(suggestionsEl, event.target)) {
            close();
            stop();
        }
    }

    function handleKey(event) {
        if (!opened) {
            return;
        }
        switch (event.keyCode) {
            case 40: // down
                event.preventDefault();
                event.stopPropagation();
                selectSuggestion(1);
                break;
            case 38: // up
                event.preventDefault();
                event.stopPropagation();
                selectSuggestion(-1);
                break;
            case 27: // escape
                event.preventDefault();
                event.stopPropagation();
                inputEl.value = savedValue;
                inputEl.focus();
                inputEl.select();
                close();
                break;
            case 13: // enter
                event.preventDefault();
                event.stopPropagation();
                complete();
                break;
            case 9: // tab
                complete();
                break;
        }
    }



    function selectSuggestion(value) {
        var inputEls = suggestionsEl.children;
        selected = (selected + value + inputEls.length) % inputEls.length;
        var text;
        for (var i = 0; i < inputEls.length; i++) {
            if (i === selected) {
                inputEls[i].classList.add('is-selected');
                text = setValueOfItem(inputEls[i])
            } else {
                inputEls[i].classList.remove('is-selected');
            }
        }
        selectAll();
        say(fillString(options.i18n.selected, {
            selected: selected + 1,
            total: inputEls.length,
            value: text
        }));
    }

    function setValueOfItem(itemEl) {
        var text = itemEl.innerText;
        inputEl.value = text;
        return text;
    }

    function complete() {
        savedValue = inputEl.value;
        completed = true;
        say(fillString(options.i18n.complete, {
            value: inputEl.value
        }));
        inputEl.focus();
        selectAll();
        setTimeout(function() {
            close();
        }, 0);
    }

    function open() {
        opened = true;
        suggestionsEl.style.display = '';
    }

    function close() {
        opened = false;
        selected = -1;
        suggestionsEl.style.display = 'none';
    }

    var sayTimeout;
    function say(message, delay) {
        clearTimeout(sayTimeout);
        sayTimeout = setTimeout(function() {
            var children = liveEl.children;
            for (var i = 0; i < children; i++) {
                children[i].style.display = 'none';
            }
            liveEl.insertAdjacentHTML('beforeend', '<p>' + message + '</p>');
        }, delay || 0);
    }

    function updateSuggestions() {
        var val = inputEl.value;
        savedValue = val;
        listFromValue(val, function(list) {
            var index = 0;
            // render list
            suggestionsEl.innerHTML = '';
            list.forEach(function(data) {
                index++;
                var liEl = options.render.li(data);
                suggestionsEl.appendChild(liEl);
            });
            if (list.length) {
                open();
                say(fillString(options.i18n.found, {
                    count: list.length,
                    value: val
                }), 1500);
            } else {
                close();
                say(fillString(options.i18n.notfound, {
                    count: 0,
                    value: val
                }), 1500);
            }
        });
    }


    function selectAll() {
        var start = 0;
        var end = inputEl.value.length;
        inputEl.select();
        setTimeout(function() {
            inputEl.selectionStart = start;
            inputEl.selectionEnd = end;
            inputEl.setSelectionRange(start, end);
        }, 1);
    }
}


// helpers

function fillString(str, data) {
    if (typeof str === 'function') {
        return str(data);
    }
    for (var key in data) {
        str = str.replace(new RegExp('#\{' + key + '\}', 'g'), data[key]);
    }
    return str;
}

function containsElement(container, element) {
    while (element) {
        if (container === element) {
            return true;
        }
        element = element.parentNode;
    }
    return false;
}



// Demo Code:


autocomplete(document.getElementById('autocomplete'), function(value, cb) {
    cb(values.filter(function(v) {
        return v.toLowerCase().indexOf(value.toLowerCase()) === 0;
    }));
});


var values = [
    "AARP",
    "Acorns Children's Hospice",
    "Action Against Hunger",
    "Action Deafness",
    "ActionAid",
    "Acumen (organization)",
    "Adelson Foundation",
    "Adventist Development and Relief Agency",
    "Aerospace Heritage Foundation of Canada",
    "Aleh Negev",
    "Alex's Lemonade Stand Foundation",
    "Alexander S. Onassis Foundation",
    "Allegheny Foundation",
    "The Alliance for Safe Children",
    "Alpha Sigma Tau National Foundation, Inc.",
    "American Academy in Rome",
    "American Heart Association",
    "American Himalayan Foundation",
    "American India Foundation",
    "American Indian College Fund",
    "American Near East Refugee Aid",
    "American Red Cross",
    "Amici del Mondo World Friends Onlus",
    "Amref Health Africa",
    "Andrew W. Mellon Foundation",
    "Artforum Culture Foundation",
    "Asbestos Disease Awareness Organization",
    "The Asia Foundation",
    "Association L'APPEL",
    "Association of Gospel Rescue Missions",
    "Atlantic Philanthropies",
    "Azim Premji",
    "Baan Gerda",
    "Best Friends Animal Society",
    "Bharat Sevashram Sangha",
    "Big Brothers Big Sisters of America",
    "Big Brothers Big Sisters of Canada",
    "Big Brothers Big Sisters of New York City",
    "Bill & Melinda Gates Foundation",
    "Bilqees Sarwar Foundation",
    "Bloomberg Philanthropies",
    "Born This Way Foundation",
    "Boys & Girls Clubs of America",
    "Bread for the World",
    "Bremen Overseas Research and Development Association",
    "British Heart Foundation",
    "Burroughs Wellcome Fund",
    "Bush Foundation",
    "CAFOD",
    "Calouste Gulbenkian Foundation",
    "Campaign for Liberty",
    "The Canadian International Learning Foundation",
    "Cancer Research UK",
    "CanTeen",
    "Cardiac Risk in the Young",
    "CARE (relief agency)",
    "Caritas (charity)",
    "Carter Center",
    "Carthage Foundation",
    "Casa Pia",
    "Catholic Charities USA",
    "Catholic Relief Services",
    "CCIVS",
    "Cesvi",
    "Child In Need Institute",
    "Child Watch Phuket",
    "Child's Dream",
    "Child's Play (charity)",
    "Children at Risk",
    "Children in Need",
    "Children International",
    "Children of Peace International",
    "Children's Defense Fund",
    "Children's Development Trust",
    "The Children's Investment Fund Foundation",
    "Children's Liver Disease Foundation",
    "Children's Miracle Network Hospitals",
    "Children's National Medical Center",
    "Christian Blind Mission",
    "Christian Care Foundation for Children with Disabilities",
    "Christian Children's Fund of Canada",
    "Church World Service",
    "The Citizens Foundation",
    "City Year",
    "Clinton Foundation",
    "Comenius Foundation for Child Development",
    "Comic Relief",
    "Community Network Projects",
    "Compassion International",
    "Confetti Foundation",
    "Conrad N. Hilton Foundation",
    "Counterpart International",
    "The Crohn's and Colitis Foundation of Canada",
    "Cystic Fibrosis Foundation",
    "David and Lucile Packard Foundation",
    "David Suzuki Foundation",
    "Do Something",
    "Dream Center",
    "Drosos Foundation",
    "The Duke Endowment",
    "East Meets West (non-governmental organization)",
    "Edhi Foundation",
    "Engineers Without Borders",
    "Epilepsy Foundation",
    "Epilepsy Outlook",
    "Eppley Foundation",
    "Feeding America",
    "Feed My Starving Children",
    "FINCA International",
    "Food Allergy Initiative",
    "Food Not Bombs",
    "Ford Foundation",
    "The Foundation for a Better Life",
    "Foundation for Child Development",
    "The Fred Hollows Foundation",
    "Free the Children",
    "Fremont Area Community Foundation",
    "Friedrich Ebert Foundation",
    "Fritt Ord (organization)",
    "Fund for Reconciliation and Development",
    "Fundacion Manantiales",
    "Garfield Weston Foundation",
    "GEFEK",
    "George S. and Dolores Dore Eccles Foundation",
    "German Foundation for World Population",
    "Gill Foundation",
    "Girl Scouts of the USA",
    "GiveIndia",
    "The Global Fund to Fight AIDS, Tuberculosis and Malaria",
    "GlobalGiving",
    "Global Greengrants Fund",
    "Global Village Foundation",
    "Gordon and Betty Moore Foundation",
    "Grassroots Business Fund",
    "Greenpeace",
    "Habitat for Humanity",
    "Handicap International",
    "Hands on Network",
    "Hands on Tzedakah",
    "Heal the World Foundation",
    "Heart to Heart International",
    "Heifer International",
    "Helen Keller International",
    "Heritage Action",
    "The Heritage Foundation",
    "High Fives Foundation",
    "Holt International Children's Services",
    "Howard Hughes Medical Institute",
    "The Idries Shah Foundation",
    "IHH (Turkish NGO)",
    "Illinois Prairie Community Foundation",
    "Imam Khomeini Relief Foundation",
    "International Children Assistance Network",
    "International Federation of Red Cross and Red Crescent Societies",
    "International Foundation for Electoral Systems",
    "International Fund for Animal Welfare",
    "International Literacy Foundation",
    "International Medical Corps",
    "International Planned Parenthood Federation",
    "International Republican Institute",
    "International Resources for the Improvement of Sight",
    "International Trachoma Initiative",
    "International Union for Conservation of Nature",
    "Invisible Children, Inc.",
    "Islamic Relief",
    "ISSO Seva",
    "J. Paul Getty Trust",
    "Jain Foundation",
    "Jane Goodall Institute",
    "Jesse's Journey",
    "Jesuit Refugee Service",
    "Jewish Community Center",
    "John A. Hartford Foundation",
    "John D. and Catherine T. MacArthur Foundation",
    "Just a Drop",
    "Kin Canada",
    "Knut and Alice Wallenberg Foundation",
    "Konrad Adenauer Foundation",
    "The Kresge Foundation",
    "La Caixa",
    "Laidlaw Foundation",
    "The Lawrence Foundation",
    "LDS Humanitarian Services",
    "Legal Education Foundation",
    "The Leona M. and Harry B. Helmsley Charitable Trust",
    "Lepra",
    "Li Ka Shing Foundation",
    "Libra Foundation",
    "Lifeline Express",
    "Lilly Endowment",
    "Lions Clubs International",
    "Make-A-Wish Foundation",
    "Malteser International",
    "Marie Stopes International",
    "The MasterCard Foundation",
    "Material World Charitable Foundation",
    "Maybach Foundation",
    "McKnight Foundation",
    "MÃĐdecins du Monde",
    "MÃĐdecins Sans FrontiÃĻres",
    "Mercy Corps",
    "Mercy International Foundation",
    "Michael and Susan Dell Foundation",
    "Mohammed bin Rashid Al Maktoum Foundation",
    "Movimento Sviluppo e Pace",
    "Mukti (organization)",
    "Multiple Sclerosis Foundation",
    "National Collegiate Cancer Foundation",
    "Nemours Foundation",
    "Netherlands Leprosy Relief",
    "Network for Good",
    "The New Brunswick Innovation Foundation",
    "Nimmagadda Foundation",
    "Nippon Foundation",
    "Nobel Foundation",
    "Norwegian Mission Alliance",
    "NYRR Foundation",
    "The Oaktree Foundation",
    "Omar-Sultan Foundation",
    "ONS Foundation",
    "Operation Blessing International",
    "Operation Smile",
    "Operation USA",
    "Opportunity International",
    "Orbis International",
    "Ormiston Trust",
    "Oxfam",
    "The Pew Charitable Trusts",
    "Pin-ups for Vets",
    "Plan (aid organisation)",
    "Ratanak International",
    "Realdania",
    "Refresh Bolivia",
    "Reggio Children Foundation",
    "REHASWISS",
    "Robert Bosch Stiftung",
    "Robert Wood Johnson Foundation",
    "Rockefeller Brothers Fund",
    "Rockefeller Foundation",
    "Rotary Foundation",
    "Royal Flying Doctor Service of Australia",
    "Royal London Society for Blind People",
    "Royal Society for the Prevention of Cruelty to Animals",
    "Royal Society for the Protection of Birds",
    "Saint Camillus Foundation",
    "The Salvation Army",
    "Samaritan's Purse",
    "Samsara Foundation",
    "Santa Casa da MisericÃģrdia",
    "Save the Children",
    "Save the Manatee Club",
    "Scaife Family Foundation",
    "Scare for a Cure",
    "Schowalter Foundation",
    "Silicon Valley Community Foundation",
    "Simone and Cino Del Duca Foundation",
    "Sir Dorabji Tata and Allied Trusts",
    "SKIP of New York",
    "SmileTrain",
    "Societat de BeneficÃĻncia de Naturals de Catalunya",
    "Society of Saint Vincent de Paul",
    "Somaly Mam Foundation",
    "SOS Children's Villages",
    "SOS Children's Villages UK",
    "SOS Children's Villages â USA",
    "Sparebankstiftelsen DnB",
    "St. Baldrick's Foundation",
    "St. Jude Children's Research Hospital",
    "Starlight Children's Foundation",
    "Stichting INGKA Foundation",
    "Students Helping Honduras",
    "Surdna Foundation",
    "Survivor Corps",
    "Susan G. Komen for the Cure",
    "SystemX",
    "Taproot Foundation",
    "Thrive Africa",
    "Tom Joyner Foundation",
    "Toys for Tots",
    "Traffic (conservation programme)",
    "Tulsa Community Foundation",
    "UNICEF",
    "United Methodist Committee on Relief",
    "United Nations Foundation",
    "United States Artists",
    "United Way Worldwide",
    "Universal Health Care Foundation of Connecticut",
    "Vancouver Foundation",
    "Varkey Foundation",
    "VeniÃąos",
    "Vietnam Children's Fund",
    "Vietnam Veterans Memorial Fund",
    "Vietnam Veterans of America Foundation",
    "Virtu Foundation",
    "Voluntary Service Overseas",
    "Volunteers of America",
    "The W. Garfield Weston Foundation",
    "W. K. Kellogg Foundation",
    "The Walter and Duncan Gordon Foundation",
    "Waste No Food",
    "Water Agriculture and Health in Tropical Area",
    "Wellcome Trust",
    "The Weston Foundation",
    "Wetlands International",
    "Wikimedia Foundation",
    "WildAid",
    "Wildlife Conservation Society",
    "William and Flora Hewlett Foundation",
    "The Winnipeg Foundation",
    "Woodrow Wilson National Fellowship Foundation",
    "World Association of Girl Guides and Girl Scouts",
    "World Literacy Foundation",
    "World Medical Relief",
    "World Scout Foundation",
    "World Transformation Movement",
    "World Vision International",
    "World Wide Fund for Nature",
    "Wounded Warrior Project",
    "Wyoming Wildlife Federation",
    "Young Lives",
    "Youth With A Mission",
    "YouthBuild",
    ]
