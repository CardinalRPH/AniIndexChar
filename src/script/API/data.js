const fetch_data = (query) => {
    return new Promise((resolve, reject) => {
        fetch(`https://api.jikan.moe/v4/characters?q=${query}`).then((response) => {
            return response.json();
        }).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
}


const fetch_data_anime = (index, mdata) => {
    return new Promise((resolve, reject) => {
        fetch(`https://api.jikan.moe/v4/characters/${mdata.data[index].mal_id}/anime`).then(function (response) {
            return response.json();
        }).then(function (data) {
            resolve(data);
        }).catch(function (error) {
            reject(error);
        });
    });
}

export { fetch_data, fetch_data_anime };
