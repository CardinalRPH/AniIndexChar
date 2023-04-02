//Widget check
const blank_search = document.getElementById("blank-search");
const null_search = document.getElementById("null-search");
const the_content = document.getElementById("the-content");
const laoding_p = document.getElementById("loading-p");

//Search COntainer
const search_contain = document.getElementById("search-input-id");
const search_btn = document.getElementById("search-btn");

//Modal Controll
const mymodal = document.getElementById("exampleModalCenter");

const loading_modal = document.getElementById("loading-modal");
const main_modal = document.getElementById("main-modal-content");

const modal_title = document.getElementById("exampleModalLongTitle");
const char_pict = document.getElementById("char-pict");
const anime_pict = document.getElementById("anime-pict");
const mal_link = document.getElementById("mal-link");
const anime_name = document.getElementById("anime-name");
const nick_name = document.getElementById("nickname");
const about_char = document.getElementById("about-char");

const anime_pict_load = document.getElementById("loading-anime-pict");
const anime_pict_ready = document.getElementById("the-anime-pict");

const modal_btn = document.getElementById("modal-btn-close");


import ErrorHandler from './error_handle.js';
import { fetch_data, fetch_data_anime } from './API/data.js';

let mdata = [];
let mdataanime = [];

document.addEventListener('DOMContentLoaded', () => {
    if (blank_search.style.display == "none") {
        is_blank();
    }
});

search_contain.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        // event.preventDefault();
        is_loading();
        if ((search_contain.value == "") || (search_contain.value == null)) {
            is_null();
        } else {
            // code here for the result
            mdata = [];
            f_data(search_contain.value);
        }
    }
});

search_btn.addEventListener("click", () => {
    // event.preventDefault();
    is_loading();
    if ((search_contain.value == "") || (search_contain.value == null)) {
        is_null();
    } else {
        // code here for the result
        mdata = [];
        f_data(search_contain.value);
    }
});

modal_btn.addEventListener("click", () => {
    modal_blank();
})

const f_data = (query) => {
    fetch_data(query).then((data) => {
        if ((data.data != "") || (data.data != null)) {
            mdata = data;
            builder_char(data)
        } else {
            is_null();
        }
    }).catch((error) => {
        console.log(error);
        let cuserror = new ErrorHandler("Api can't Load Character Query");
        throw cuserror;
    });
}

window.selected = (index) => {
    is_modal_loading();
    f_data_anime(index);
}

window.onclick = (event) => {
    if (event.target == mymodal) {
        modal_blank();
    }
}

window.anime_title_bg = (index, el) => {
    anime_not_sel();
    is_pict_loading();
    anime_pict.setAttribute('src', mdataanime.data[index].anime.images.jpg.image_url);
    el.style.backgroundPosition = "left";
    el.style.color = "#d9e6ff"
}

window.is_pict_ready = () => {
    anime_pict_load.style.display = "none"
    anime_pict_ready.style.display = "block";
}

const f_data_anime = (index) => {
    fetch_data_anime(index, mdata).then((data) => {
        if (data.data != null) {
            mdataanime = data;
            modal_filler(data, index);
        } else {
            modal_blank();
        }
    }).catch( (error) => {
        is_pict_loading();
        anime_pict.setAttribute('src', './public/icons/404.jpg');
        console.log(error);
        let cuserror = new ErrorHandler("Api can't Load Anime of Character");
        throw cuserror;
        
    });
}

const builder_char = (data) => {
    is_content();
    for (let i = 0; i < data.data.length; i++) {
        the_content.innerHTML += `<result-content src="${data.data[i].images.jpg.image_url}" onclick="selected(${i})" charname="${data.data[i].name}"></result-content>`;
    }
}

const modal_filler = (data, index) => {
    is_modal_content();
    if (((mdata.data[index].name != null) || (mdata.data[index].name != "")) && ((mdata.data[index].name_kanji == null) || (mdata.data[index].name_kanji == ""))) {
        modal_title.innerHTML =  `${mdata.data[index].name} | ...`;
    } else if (((mdata.data[index].name == null) || (mdata.data[index].name == "")) && ((mdata.data[index].name_kanji != null) || (mdata.data[index].name_kanji != ""))) {
        modal_title.innerHTML = `... | ${mdata.data[index].name_kanji}`;
    } else {
        modal_title.innerHTML = `${mdata.data[index].name} | ${mdata.data[index].name_kanji}`;
    }
    char_pict.setAttribute('src', mdata.data[index].images.jpg.image_url);
    mal_link.setAttribute('href', mdata.data[index].url);

    if ((data.data == null) || (data.data == "")) {
        anime_name.innerHTML += `<li class="text-truncate anime-text-title" title="???"><h3>???</h3></li>`;
    } else {
        if (data.data.length == 1) {
            anime_name.innerHTML += `<li class="text-truncate anime-text-title" title="${data.data[0].anime.title}" onclick="anime_title_bg(0,this)"><h3>${data.data[0].anime.title}</h3></li>`;
        } else {
            for (let i = 0; i < data.data.length; i++) {
                anime_name.innerHTML += `<li class="text-truncate anime-text-title" title="${data.data[i].anime.title}" onclick="anime_title_bg(${i},this)">${data.data[i].anime.title}</li>`;
            }
        }
    }

    if (mdata.data[index].nicknames.length > 0) {
        for (let i = 0; i < mdata.data[index].nicknames.length; i++) {
            nick_name.innerHTML += `<li class="text-truncate">${mdata.data[index].nicknames[i]}</li>`;
        }
    } else {
        nick_name.innerHTML += `<li class="text-truncate">...</li>`;
    }

    if ((mdata.data[index].about == null) || (mdata.data[index].about == "")) {
        about_char.innerHTML = "<h4>About :</h4> ...";
    } else {
        if ((mdata.data[index].about).includes("\n")) {
            about_char.innerHTML = `<h4>About :</h4>${replacer(mdata.data[index].about)}`;
        } else {
            about_char.innerHTML = `<h4>About :</h4> ${mdata.data[index].about}`;
        }
    }

    if ((data.data.length != 0) || (data.data.length != null) || (data.data.length != "")) {
        is_pict_loading();
        anime_pict.setAttribute('src', data.data[0].anime.images.jpg.image_url);
    } else {
        is_pict_loading();
        anime_pict.setAttribute('src', './public/icons/404.jpg');
    }

    anime_is_sel();

}


const replacer = (data) => {
    return data.replace(/\n/g, "<br>");
}

const anime_not_sel = () => {
    const an_title = document.querySelectorAll(".anime-text-title");
    for (let i = 0; i < an_title.length; i++) {
        an_title[i].style.background = "linear-gradient(to left, transparent 50%, #3577ff 50%) right";
        an_title[i].style.backgroundSize = "200%";
        an_title[i].style.transition = "0.5s ease-out";
        an_title[i].style.color = "#000";
    }
}

const anime_is_sel = () => {
    const an_title = document.querySelectorAll(".anime-text-title");
    an_title[0].style.backgroundPosition = "left";
    an_title[0].style.color = "#d9e6ff"
}

const is_blank = () => {
    blank_search.style.display = "flex";
    null_search.style.display = "none";
    the_content.style.display = "none";
    laoding_p.style.display = "none";
    the_content.innerHTML - "";
    modal_blank();
}

const is_null = () => {
    laoding_p.style.display = "none";
    blank_search.style.display = "none";
    null_search.style.display = "flex";
    the_content.style.display = "none";
    the_content.innerHTML = "";
    modal_blank();
}

const is_content = () => {
    blank_search.style.display = "none";
    null_search.style.display = "none";
    the_content.style.display = "grid";
    laoding_p.style.display = "none";
    the_content.innerHTML = "";
}

const is_loading = () => {
    blank_search.style.display = "none";
    null_search.style.display = "none";
    the_content.style.display = "none";
    laoding_p.style.display = "flex";
    the_content.innerHTML = "";
}

const is_modal_loading = () => {
    loading_modal.style.display = "flex";
    main_modal.style.display = "none";
}

const is_modal_content = () => {
    loading_modal.style.display = "none";
    main_modal.style.display = "flex";
}

const modal_blank = () => {
    modal_title.innerHTML = "Character Name";
    char_pict.setAttribute('src', '');
    anime_pict.setAttribute('src', '');
    mal_link.setAttribute('href', '#');
    anime_name.innerHTML = "";
    nick_name.innerHTML = "";
    about_char.innerHTML = "<h4>About :</h4>";
}

const is_pict_loading = () => {
    anime_pict_load.style.display = "flex"
    anime_pict_ready.style.display = "none";
}



