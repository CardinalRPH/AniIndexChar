const nav_logos = document.getElementById("nav-logos");
const myque = document.getElementById("myque");

//Widget check
const blank_search = document.getElementById("blank-search");
const null_search = document.getElementById("null-search");
const the_content = document.getElementById("the-content");
const laoding_p = document.getElementById("loading-p");
const recent_c = document.getElementById("recent-content");

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

document.getElementById("mygithub").addEventListener('click', () => {
    location.href = "https://github.com/CardinalRPH";
});
document.getElementById("apiref").addEventListener('click', () => {
    location.href = "https://docs.api.jikan.moe/";
});


import ErrorHandler from './error_handle.js';
import { fetch_data, fetch_data_anime, fetch_data_by_id } from './API/data.js';

let mdata = [];
let mdataanime = [];
let storagedata = [];
let index_data = 0;
const storage_key = "recent_data";
const index_storage = "index_data";

document.addEventListener('DOMContentLoaded', () => {
    is_loading();
    if (isStorageExist()) {
        if (localStorage.getItem(storage_key) != null) {
            if (localStorage.getItem(storage_key) != "") {
                storagedata = JSON.parse(localStorage.getItem(storage_key));
                index_data = JSON.parse(localStorage.getItem(index_storage));
                is_recent();
                builder_char_recent();
            } else {
                is_blank();
            }
        } else {
            is_blank();
            localStorage.setItem(storage_key, "");
            localStorage.setItem(index_storage, 0);
        }
    } else {
        is_blank();
    }
});

nav_logos.addEventListener('click', () => {
    is_loading();
    is_recent();
    builder_char_recent();
})

search_contain.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        // event.preventDefault();
        is_loading();
        if ((search_contain.value == "") || (search_contain.value == null)) {
            is_null();
        } else {
            // code here for the result
            mdata = [];
            myque.innerHTML = `Results for "${search_contain.value}"`;
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
        myque.innerHTML = `Results for "${search_contain.value}"`;
        f_data(search_contain.value);
    }
});

modal_btn.addEventListener("click", () => {
    modal_blank();
})

const f_data = (query) => {
    fetch_data(query).then((data) => {
        if (data.data.length !=0) {
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
    push_local(index);
}

window.onclick = (event) => {
    if (event.target == mymodal) {
        modal_blank();
    }
}

window.selected_recent = (index) => {
    is_modal_loading();
    f_data_by_id(index);
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
    fetch_data_anime(mdata.data[index].mal_id).then((data) => {
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
    let name, name_kanji, char_img, mal_url, char_nick, char_about;

    if (Array.isArray(mdata.data)) {
        name = mdata.data[index].name;
        name_kanji = mdata.data[index].name_kanji;
        char_img = mdata.data[index].images.jpg.image_url;
        mal_url = mdata.data[index].url;
        char_nick = mdata.data[index].nicknames;
        char_about = mdata.data[index].about;
    } else {
        name = mdata.data.name;
        name_kanji = mdata.data.name_kanji;
        char_img = mdata.data.images.jpg.image_url;
        mal_url = mdata.data.url;
        char_nick = mdata.data.nicknames;
        char_about = mdata.data.about;
    }
    is_modal_content();
    if (((name != null) || (name != "")) && ((name_kanji == null) || (name_kanji == ""))) {
        modal_title.innerHTML =  `${name} | ...`;
    } else if (((name == null) || (name == "")) && ((name_kanji != null) || (name_kanji != ""))) {
        modal_title.innerHTML = `... | ${name_kanji}`;
    } else {
        modal_title.innerHTML = `${name} | ${name_kanji}`;
    }
    char_pict.setAttribute('src', char_img);
    mal_link.setAttribute('href', mal_url);

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

    if (char_nick.length > 0) {
        for (let i = 0; i < char_nick.length; i++) {
            nick_name.innerHTML += `<li class="text-truncate">${char_nick[i]}</li>`;
        }
    } else {
        nick_name.innerHTML += `<li class="text-truncate">...</li>`;
    }

    if ((char_about == null) || (char_about == "")) {
        about_char.innerHTML = "<h4>About :</h4> ...";
    } else {
        if ((char_about).includes("\n")) {
            about_char.innerHTML = `<h4>About :</h4>${replacer(char_about)}`;
        } else {
            about_char.innerHTML = `<h4>About :</h4> ${char_about}`;
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
    recent_c.style.display = "none";
    recent_c.innerHTML = "";
    the_content.innerHTML - "";
    modal_blank();
}

const is_null = () => {
    laoding_p.style.display = "none";
    blank_search.style.display = "none";
    null_search.style.display = "flex";
    the_content.style.display = "none";
    recent_c.style.display = "none";
    recent_c.innerHTML = "";
    the_content.innerHTML = "";
    modal_blank();
}

const is_content = () => {
    blank_search.style.display = "none";
    null_search.style.display = "none";
    the_content.style.display = "grid";
    laoding_p.style.display = "none";
    recent_c.style.display = "none";
    recent_c.innerHTML = "";
    the_content.innerHTML = "";
}

const is_loading = () => {
    blank_search.style.display = "none";
    null_search.style.display = "none";
    the_content.style.display = "none";
    laoding_p.style.display = "flex";
    recent_c.style.display = "none";
    recent_c.innerHTML = "";
    the_content.innerHTML = "";
}

const is_recent = () => {
    myque.innerHTML = "Recent Search";
    blank_search.style.display = "none";
    null_search.style.display = "none";
    the_content.style.display = "none";
    laoding_p.style.display = "none";
    recent_c.style.display = "grid";
    recent_c.innerHTML = "";
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

const isStorageExist = () =>  {
    if (typeof (Storage) === undefined) {
        return false;
    }
    return true;
}

const generateObject = (id_char, link_pict, name_char) => {
    return {
        id_char, link_pict, name_char
    }
}

const push_local = (index) => {
    if (storagedata.length <= 4) {
        if (!check_object(index)) {
            let DataObj = generateObject(mdata.data[index].mal_id, mdata.data[index].images.jpg.image_url, mdata.data[index].name);
            storagedata[index_data] = DataObj;
            index_data++;
            if (index_data >= 4) {
                index_data = 0;
                saveIndex();
            } else {
                saveIndex();
            }
            saveData();
        }
    }
}

const saveData = () => {
    let parse = JSON.stringify(storagedata);
    localStorage.setItem(storage_key, parse);
}

const saveIndex = () => {
    let parse = JSON.stringify(index_data);
    localStorage.setItem(index_storage, parse)
}

const check_object = (index) => {
    for (let i in storagedata) {
        if (storagedata[i].id_char === mdata.data[index].mal_id) {
            return true;
        }
    }
}

const builder_char_recent = () => {
    for (let i in storagedata) {
        recent_c.innerHTML += `<result-content src="${storagedata[i].link_pict}" onclick="selected_recent(${i})" charname="${storagedata[i].name_char}"></result-content>`;
    }
}

const f_data_by_id = (index) => {
    fetch_data_by_id(storagedata[index].id_char).then((data) => {
        if (data.data != null) {
            mdata = data;
            f_data_by_id_anime(index);
        } else {
            modal_blank();
        }
    }).catch( (error) => {
        is_pict_loading();
        char_pict.setAttribute('src', './public/icons/404.jpg');
        console.log(error);
        let cuserror = new ErrorHandler("Api can't Load Character of Anime");
        throw cuserror;
        
    });
}

const f_data_by_id_anime = (index) => {
    fetch_data_anime(storagedata[index].id_char).then((data) => {
        if (data.data != null) {
            modal_filler(data, 0);
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







